import numpy as np
import cv2
import os
import json
import base64
from kafka import KafkaConsumer
from mtcnn import MTCNN
from .face_utils import (
    load_model, 
    load_chroma_database, 
    predict_identity_from_image,
    search_face,
    crop_face
)


def process_video_stream(topic, bootstrap_servers='localhost:9092', callback=None):
    """
    Process video stream from Kafka and detect faces
    """
    consumer = KafkaConsumer(
        topic,
        bootstrap_servers=bootstrap_servers,
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='face-recognition-group',
        value_deserializer=lambda x: json.loads(x.decode('utf-8')))

    collection, _ = load_chroma_database()
    infer = load_model()
    detector = MTCNN()

    print("Face recognition service started...")
    print(f"Listening to topic: {topic}")

    for message in consumer:
        data = message.value
        frame_data = data.get('frame')

        if frame_data:
            # Decode the base64 string
            img_bytes = base64.b64decode(frame_data)
            
            # Convert bytes to numpy array
            nparr = np.frombuffer(img_bytes, np.uint8)
            
            # Decode image
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is not None:
                predictions = predict_identity_from_image(
                    collection=collection,
                    infer=infer,
                    detector=detector,
                    image=frame,
                    top_k=1
                )
                
                if predictions:
                    print(f"Detected faces: {len(predictions)}")
                    for pred in predictions:
                        print(f"  - Identity: {pred.get('person_name')}, Distance: {pred.get('face', {}).get('distance')}")
                    
                    # Call callback if provided
                    if callback:
                        callback(predictions, frame, data)


def process_video_file_for_face_recognition(video_path, target_person_id=None, threshold=0.6, output_path=None):
    """
    Process a video file and detect specific person or all faces
    """
    collection, _ = load_chroma_database()
    infer = load_model()
    detector = MTCNN()
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Cannot open video file {video_path}")
        return None
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0
    detections = []
    
    # Video writer for output
    out = None
    if output_path:
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    print(f"Processing video: {video_path}")
    print(f"FPS: {fps}, Target: {target_person_id if target_person_id else 'All faces'}")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_count += 1
        timestamp = frame_count / fps
        
        # Process every 5 frames to improve performance
        if frame_count % 5 == 0:
            predictions = predict_identity_from_image(
                collection=collection,
                infer=infer,
                detector=detector,
                image=frame,
                top_k=1
            )
            
            if predictions:
                for pred in predictions:
                    person_name = pred.get('person_name')
                    distance = pred.get('face', {}).get('distance')
                    
                    # Check if matches target and threshold
                    if distance < threshold:
                        if target_person_id is None or person_name == target_person_id:
                            detection = {
                                'frame': frame_count,
                                'timestamp': timestamp,
                                'person_name': person_name,
                                'distance': distance,
                                'bbox': pred.get('face')
                            }
                            detections.append(detection)
                            
                            print(f"[{timestamp:.2f}s] Detected: {person_name} (distance: {distance:.3f})")
                            
                            # Draw bounding box on frame
                            if out:
                                face = pred.get('face', {})
                                x, y, w, h = face.get('x'), face.get('y'), face.get('width'), face.get('height')
                                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                                cv2.putText(frame, f"{person_name} ({distance:.2f})", 
                                          (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Write frame to output video
        if out:
            out.write(frame)
        
        # Progress indicator
        if frame_count % 100 == 0:
            print(f"Processed {frame_count} frames...")
    
    cap.release()
    if out:
        out.release()
        print(f"Annotated video saved to: {output_path}")
    
    print(f"\nTotal detections: {len(detections)}")
    return detections


def search_person_in_video_stream(target_person_id, topic='video-stream', 
                                   bootstrap_servers='localhost:9092', 
                                   threshold=0.6,
                                   alert_callback=None):
    """
    Monitor video stream for specific person and trigger alerts
    """
    def detection_callback(predictions, frame, metadata):
        for pred in predictions:
            person_name = pred.get('person_name')
            distance = pred.get('face', {}).get('distance')
            
            if person_name == target_person_id and distance < threshold:
                alert_data = {
                    'person_id': person_name,
                    'distance': distance,
                    'timestamp': metadata.get('timestamp'),
                    'camera_id': metadata.get('camera_id'),
                    'frame_number': metadata.get('frame_number'),
                    'bbox': pred.get('face')
                }
                
                print(f"\n🚨 ALERT: {target_person_id} detected!")
                print(f"   Camera: {alert_data['camera_id']}")
                print(f"   Time: {alert_data['timestamp']}")
                print(f"   Confidence: {1 - distance:.2%}")
                
                if alert_callback:
                    alert_callback(alert_data, frame)
    
    print(f"🔍 Searching for: {target_person_id}")
    print(f"📹 Monitoring stream: {topic}")
    process_video_stream(topic, bootstrap_servers, callback=detection_callback)


def batch_process_videos_for_person(video_dir, target_person_id, threshold=0.6, output_dir=None):
    """
    Process multiple videos to search for a specific person
    """
    video_extensions = ('.mp4', '.avi', '.mov', '.mkv')
    video_files = [f for f in os.listdir(video_dir) if f.lower().endswith(video_extensions)]
    
    all_results = {}
    
    for video_file in video_files:
        video_path = os.path.join(video_dir, video_file)
        output_path = None
        
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            output_path = os.path.join(output_dir, f"annotated_{video_file}")
        
        print(f"\n{'='*60}")
        print(f"Processing: {video_file}")
        print(f"{'='*60}")
        
        detections = process_video_file_for_face_recognition(
            video_path, 
            target_person_id=target_person_id,
            threshold=threshold,
            output_path=output_path
        )
        
        all_results[video_file] = detections
    
    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    for video_file, detections in all_results.items():
        if detections:
            print(f"✓ {video_file}: {len(detections)} detections")
        else:
            print(f"✗ {video_file}: No detections")
    
    return all_results


def search_person_by_image_in_video(uploaded_image, video_path, threshold=0.6):
    """
    Search for a person in video by comparing with uploaded image using ChromaDB
    Optimized: Only reads 1 frame every 3 seconds
    """
    collection, _ = load_chroma_database()
    infer = load_model()
    detector = MTCNN()
    
    # Extract face embedding from uploaded image and add to temporary collection
    faces_in_upload = detector.detect_faces(uploaded_image)
    if not faces_in_upload:
        return {'error': 'No face detected in uploaded image', 'detections': []}
    
    # Get the first face from uploaded image
    bbox = faces_in_upload[0]['box']
    uploaded_face = crop_face(uploaded_image, bbox)
    
    # Open video file
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {'error': f'Cannot open video file {video_path}', 'detections': []}
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps
    
    # Process 1 frame every 3 seconds
    frame_interval = int(fps * 3)  # 3 seconds worth of frames
    
    detections = []
    frames_to_process = list(range(0, total_frames, frame_interval))
    
    print(f"Processing video: {video_path}")
    print(f"Duration: {duration:.1f}s, FPS: {fps}, Total frames: {total_frames}")
    print(f"Sampling: 1 frame every 3 seconds (interval: {frame_interval} frames)")
    print(f"Total frames to process: {len(frames_to_process)}")
    
    for idx, frame_number in enumerate(frames_to_process):
        # Jump directly to the frame we want to process
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
        ret, frame = cap.read()
        
        if not ret:
            print(f"Warning: Could not read frame {frame_number}")
            continue
        
        timestamp = frame_number / fps
        
        # Detect faces in this frame
        faces_in_frame = detector.detect_faces(frame)
        
        for face in faces_in_frame:
            bbox = face['box']
            (x, y, w, h) = bbox
            face_cropped = crop_face(frame, bbox)
            
            # Use search_face to find similar faces in ChromaDB
            results = search_face(face_cropped, infer, top_k=1, collection=collection)
            
            if results and results['distances'] and len(results['distances'][0]) > 0:
                distance = results['distances'][0][0]
                
                # Check if match
                if distance < threshold:
                    confidence = (1 - distance) * 100
                    # Store full detection information
                    detection = {
                        'frame_number': frame_number,
                        'timestamp': round(timestamp, 2),
                        'confidence': round(confidence, 2),
                        'distance': round(float(distance), 4),
                        'bbox': {
                            'x': int(x),
                            'y': int(y),
                            'width': int(w),
                            'height': int(h)
                        }
                    }
                    detections.append(detection)
                    print(f"✓ [{timestamp:.1f}s] Frame {frame_number} - Match! Confidence: {confidence:.2f}%")
                    break  # Only need one match per frame
        
        # Progress indicator
        if (idx + 1) % 10 == 0 or (idx + 1) == len(frames_to_process):
            progress = ((idx + 1) / len(frames_to_process)) * 100
            print(f"Progress: {progress:.1f}% ({idx + 1}/{len(frames_to_process)} frames processed)")
    
    cap.release()
    print(f"\n✓ Processing complete!")
    print(f"Total frames in video: {total_frames}")
    print(f"Frames processed: {len(frames_to_process)} ({(len(frames_to_process)/total_frames)*100:.1f}%)")
    print(f"Detections found: {len(detections)}")
    
    return {
        'detections': detections, 
        'total_frames': total_frames, 
        'processed_frames': len(frames_to_process), 
        'fps': fps,
        'duration': round(duration, 2)
    }
