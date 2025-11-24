import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import csv
import cv2
import os
import chromadb
from mtcnn import MTCNN
from FaceData import FaceData
from IdentityResult import IdentityResult
from kafka import KafkaConsumer
import json
import base64

def get_image_paths(directory, valid_extensions=(".jpg", ".jpeg", ".png", ".bmp", ".gif")):
    image_paths = []

    # Iterate over all files in the directory
    for root, dirs, files in os.walk(directory):
        for file in files:
            # Check if file is an image based on its extension
            if file.lower().endswith(valid_extensions):
                # Append the full path of the image file to the list
                image_paths.append(os.path.join(root, file))

    return image_paths


def save_face_embeddings(embedding):
# Ensure the embedding is a numpy array
    embedding = np.array(embedding)

    # Save to CSV
    with open('avg_face_embeddings.csv', mode="w", newline='') as file:
        writer = csv.writer(file)
        writer.writerow(embedding)


def plt_img(image, cmap="gray"):
    """Display an image using matplotlib"""
    plt.imshow(image, cmap)
    plt.axis('on')
    plt.show()
    
def preprocess_img(image):
    """
    Preprocess Image:
    
    Args:
        image: np.ndarray
    
    Returns:
        4D(batch_size, height, width, channels)
            'batch_size': This is the number of images (or samples) processed together in one pass through the model.
            'height': The height of each image in pixels.
            'width': The width of each image in pixels.
            'channels': The number of color channels in each image.
    """
    # Dimensions
    IMG_W = 160
    IMG_H = 160
    
    # Resize the image
    image = cv2.resize(image, dsize = (IMG_W, IMG_H))
    
    # Convert image stype or normalize
    image = image.astype(np.float32)/255.0
    
    return image


def image_to_embedding(image: np.ndarray, model_infer):
    """Generate face embedding from an image."""
    
    # Increase image dim
    image_input = image[np.newaxis,...] # (1, 160, 160, 3)
    
    # Perform inference using the callable function
    result = model_infer(tf.convert_to_tensor(image_input, dtype=tf.float32))
    
    # Extract result from output key (1,128)
    embedding = result['Bottleneck_BatchNorm'].numpy()
    
    # Normalize bedding using L2 norm.
    embedding /= np.linalg.norm(embedding, ord=2)
    
    return embedding


def cal_embeddings_dist(embedding_1: np.ndarray, embedding_2: np.ndarray) -> float:
    """
    Compares two embeddings and returns L2 norm of the distance vector.

    Args:
    - embedding_1: A 128-dimensional embedding vector.
    - embedding_2: A 128-dimensional embedding vector.

    Returns:
    - L2 norm of the distance vector
    """

    # Calculate the distance between the embeddings
    embedding_distance = embedding_1 - embedding_2

    # Calculate the L2 norm of the distance vector
    embedding_distance_norm = np.linalg.norm(embedding_distance)
    
    return embedding_distance_norm


def plot_image_grid(images, images_per_row=5, total_images=50):
    # Ensure we don't exceed the available images or the limit of 50
    total_images = min(total_images, len(images))
    
    # Calculate the number of rows needed
    num_rows = (total_images + images_per_row - 1) // images_per_row

    # Create a figure with a grid of subplots
    fig, axs = plt.subplots(num_rows, images_per_row, figsize=(15, 3 * num_rows))

    # Flatten the axes array in case of more than one row
    axs = axs.ravel()

    for i in range(total_images):
        # Read and display the image
        img = images[i]
        axs[i].imshow(img)
        axs[i].axis('off')  # Turn off the axis for clean presentation

    # Turn off any remaining unused subplots (if total_images < images_per_row * num_rows)
    for j in range(total_images, len(axs)):
        axs[j].axis('off')

    # Show the grid of images
    plt.tight_layout()
    plt.show()
    

def plt_embeddings(embedding):
    # Normalized embedding
    embedding_normalized = (embedding - np.min(embedding)) / (np.max(embedding) - np.min(embedding))
    
    # Plt barcode
    plt.figure(figsize=(12, 2))
    plt.bar(range(len(embedding_normalized)), embedding_normalized)
    plt.show()

def search_face(face, infer, top_k=5, collection=None):
    if (collection == None ):
        print("Import collection before predict...")
        return None
    # Load image test
    preprocessed_img = preprocess_img(face)

    # Extract embedding
    vector = image_to_embedding(preprocessed_img, infer)
    if isinstance(vector, np.ndarray):
        embedding_to_query = vector.flatten().tolist()
    else:
        embedding_to_query = vector

    query_vector = [embedding_to_query] 

    # Query in collection
    results = collection.query(
        query_embeddings=query_vector,
        n_results=top_k,
        include=['metadatas', 'distances', 'documents']
    )

    return results


def load_model():
    # Define path model & DB
    MODEL_PATH = "pre_train_model/"

    # Load model 
    model = tf.saved_model.load(MODEL_PATH)
    infer = model.signatures['serving_default']

    print(f"Signature available: {list(model.signatures.keys())}")
    print("Model load successfully as tf.Module.")
    return infer


def load_chroma_database(collection_name="image_embeddings", DB_PATH='chromadb'):
    try: 
        # Connect to ChromaDB saved 
        client = chromadb.PersistentClient(path=DB_PATH)
        collection = client.get_or_create_collection(name=collection_name, metadata={"hnsw:space": "cosine"})
    except ArithmeticError:
        print('Not found chromadb.Client`')
        exit()
    return collection, client


def crop_face(image, bbox):
    if image is not None and bbox is not None:
        x, y, w, h = bbox
        return image[y:y+h, x:x+w]
    

def predict_identity_from_image(
        collection=load_chroma_database(DB_PATH='chromadb'), 
        infer = load_model(), 
        detector = MTCNN(), 
        image=None, 
        top_k=1):
    # Store all of result prediction faces
    all_predictions = [] 
    try:
        print('-'*20)
        print('- Load model and database')
        
        if image is not None:
            faces = detector.detect_faces(image=image)
            print(f'- Detect {len(faces) } face in image')
            for face in faces:
                bbox = face['box']
                (x, y, w, h) = bbox
                face_croped = crop_face(image=image, bbox=bbox)

                results = search_face(face_croped, infer, top_k=top_k, collection=collection)
                print(f'- Searching {results} face in database')

                if results is not None and results['ids'] and results['distances']:
                    # Get result Top-1
                    top_k_ids = results['ids'][0]
                    top_k_distance = results['distances'][0][0]
                    top_k_metadatas = results['metadatas'][0]
                    top_k_documents = results['documents'][0]
                    
                    # Get top_k_person_names
                    top_k_person_names = [metadata.get('identity', 'UNKNOWN') for metadata in top_k_metadatas]

                    # Encapsulation data
                    face_data = FaceData(x=x, y=y, width=w, height=h, distance=top_k_distance)

                    prediction = IdentityResult(
                        face_data=face_data,
                        ids=top_k_ids,
                        person_name=top_k_person_names,
                        document=top_k_documents
                    )
                    
                # Add predict identity face to dictionary
                all_predictions.append(prediction.to_dict())
            return all_predictions
    except Exception as e:
        print(f'Error when predict image: {e}')
        return None


def add_person_to_chromadb(collection=None, ids=None, face_image=None, identity_name='', filename=''):
    if face_image is not None and identity_name != '' and filename is not None:
        model = load_model()
        _, collection = load_chroma_database()
        metadatas = {
            "identity": identity_name,
            "filename": filename,
        }
        documents= {f'Face indentity: {identity_name}'}
        embedding = image_to_embedding(face_image, model_infer=model)

        collection.add(
            ids=ids,
            embeddings=embedding,
            metadatas=metadatas,
            documents=documents
        )

def process_video_stream(topic, bootstrap_servers='localhost:9092', callback=None):
    """
    Process video stream from Kafka and detect faces
    
    Args:
        topic: Kafka topic name
        bootstrap_servers: Kafka server address
        callback: Optional callback function to handle detection results
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
    
    Args:
        video_path: Path to video file
        target_person_id: Specific person ID to search for (None for all)
        threshold: Distance threshold for face matching (lower = more strict)
        output_path: Optional path to save annotated video
    
    Returns:
        List of detections with timestamps
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
    
    Args:
        target_person_id: Person ID to search for
        topic: Kafka topic name
        bootstrap_servers: Kafka server address
        threshold: Distance threshold for matching
        alert_callback: Function to call when person is detected
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
    
    Args:
        video_dir: Directory containing video files
        target_person_id: Person ID to search for
        threshold: Distance threshold
        output_dir: Directory to save results
    
    Returns:
        Dictionary of results per video
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
    Optimized: Only reads 1 frame every 3 seconds (skips other frames for maximum speed)
    
    Args:
        uploaded_image: numpy array of uploaded image
        video_path: Path to video file
        threshold: Distance threshold for face matching
    
    Returns:
        List of frame numbers where person was detected
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