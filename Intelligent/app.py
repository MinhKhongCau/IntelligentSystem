import cv2
import numpy as np
import json
import base64
import logging
import subprocess
import os
import time
from utils import utils

from video_consumer import VideoStreamConsumer
from service.StreamService import start_consumer_thread, cleanup_processes, register_cleanup_handler
from flask import Flask, Response, render_template, jsonify, request
from flask_cors import CORS
from threading import Thread, Lock
from mtcnn import MTCNN

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Suppress Kafka debug warnings
logging.getLogger('kafka').setLevel(logging.ERROR)

# ============================================================================
# THREAD ARCHITECTURE:
# - Background threads: Kafka consumers continuously receive frames from Kafka
# - Main thread: Flask handles HTTP requests (search, compare, etc.)
# - Shared memory: Frames are stored in dictionaries with thread-safe locks
# ============================================================================

# Global variables for frame storage (shared between consumer thread and Flask)
current_frame = None  # Latest frame from default stream
frame_lock = Lock()  # Thread-safe access to current_frame

# Kafka configuration
KAFKA_BOOTSTRAP_SERVERS = os.environ.get('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
KAFKA_TOPIC = 'video-stream'

# Global variables for camera management
active_cameras = {}  # {ip: {'process': process, 'topic': topic, 'thread': thread}}
camera_lock = Lock()  # Thread-safe access to active_cameras

# Global variables for multiple camera consumers (background threads)
camera_consumers = {}  # {ip: VideoStreamConsumer instance}
camera_frames = {}  # {ip: latest_frame} - shared memory for frames
camera_frames_lock = Lock()  # Thread-safe access to camera_frames

# Track active stream connections (for monitoring)
active_streams = {}  # {camera_ip: connection_count}
active_streams_lock = Lock()

# Load model, database and detector (global resources)
try:
    INFER = utils.load_model()
    COLLECTION, CHROMA_CLIENT = utils.load_chroma_database(DB_PATH='chromadb_centroid')
    DETECTOR = MTCNN()
    print("Tải mô hình và database thành công.")
except Exception as e:
    print(f"Lỗi khi tải tài nguyên chính: {e}")
    INFER = None
    COLLECTION = None
    DETECTOR = None

# ============================================================================
# FRAME CALLBACKS (Called by background consumer threads)
# These functions update shared memory with latest frames
# ============================================================================

def update_frame(frame):
    """
    Callback to update current frame (for default stream)
    Called by background consumer thread
    Thread-safe: Uses lock to update shared memory
    """
    global current_frame
    with frame_lock:
        current_frame = frame

def create_camera_frame_callback(camera_ip):
    """
    Create a callback function for a specific camera
    Returns a function that will be called by consumer thread
    Thread-safe: Uses lock to update shared memory
    """
    def callback(frame):
        with camera_frames_lock:
            camera_frames[camera_ip] = frame
    return callback

# Initialize default consumer (will run in background thread)
video_consumer = VideoStreamConsumer(KAFKA_TOPIC, KAFKA_BOOTSTRAP_SERVERS, frame_callback=update_frame)

# ============================================================================
# VIDEO FEED GENERATORS (Run in Flask request context)
# These functions read frames from shared memory (non-blocking)
# Background consumer threads continuously update the frames
# ============================================================================

def generate_frames():
    """
    Generator function to yield video frames for default stream
    Runs in Flask request context (main thread)
    Non-blocking: Only reads from shared memory updated by consumer thread
    """
    global current_frame
    no_frame_count = 0
    max_no_frame_attempts = 150  # Stop after 5 seconds of no frames (at ~30fps)
    
    try:
        while True:
            # Non-blocking read from shared memory
            with frame_lock:
                if current_frame is None:
                    no_frame_count += 1
                    if no_frame_count >= max_no_frame_attempts:
                        logging.info("No frames available for extended period, stopping stream")
                        break
                    
                    # Send a placeholder frame if no video available
                    placeholder = np.zeros((480, 640, 3), dtype=np.uint8)
                    cv2.putText(placeholder, 'Waiting for video stream...', 
                               (50, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                    frame = placeholder
                else:
                    no_frame_count = 0
                    frame = current_frame.copy()
            
            # Encode frame as JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            if not ret:
                continue
                
            frame_bytes = buffer.tobytes()
            
            # Yield frame in multipart format
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            
            time.sleep(0.033)  # ~30 fps
    except GeneratorExit:
        logging.info("Client disconnected from default stream")
    except Exception as e:
        logging.error(f"Error in generate_frames: {str(e)}")

@app.route('/')
def index_page():
    """Main page with video player"""
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    """Video streaming route (default stream)"""
    return Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed/<camera_ip>')
def video_feed_by_camera(camera_ip):
    """
    Video streaming route for specific camera
    Runs in Flask request context (main thread)
    Non-blocking: Only reads frames from shared memory
    """
    
    # Track connection
    with active_streams_lock:
        if camera_ip not in active_streams:
            active_streams[camera_ip] = 0
        active_streams[camera_ip] += 1
        logging.info(f"Client connected to camera {camera_ip} stream (total: {active_streams[camera_ip]})")
    
    def generate_camera_frames():
        """
        Generator for specific camera frames
        Non-blocking: Only reads from shared memory updated by consumer thread
        """
        no_frame_count = 0
        max_no_frame_attempts = 150  # Stop after 5 seconds of no frames (at ~30fps)
        last_frame_time = time.time()
        timeout_seconds = 10  # Stop if no new frames for 10 seconds
        
        try:
            while True:
                # Non-blocking read from shared memory
                with camera_frames_lock:
                    if camera_ip not in camera_frames or camera_frames[camera_ip] is None:
                        no_frame_count += 1
                        
                        # Check if camera is still active
                        with camera_lock:
                            camera_active = camera_ip in active_cameras
                        
                        # If camera is not active or timeout reached, stop streaming
                        if not camera_active or (time.time() - last_frame_time) > timeout_seconds:
                            logging.info(f"Camera {camera_ip} inactive or timeout, stopping stream")
                            break
                        
                        if no_frame_count >= max_no_frame_attempts:
                            logging.info(f"No frames from camera {camera_ip} for extended period, stopping stream")
                            break
                        
                        # Send placeholder frame
                        placeholder = np.zeros((480, 640, 3), dtype=np.uint8)
                        cv2.putText(placeholder, f'Waiting for camera {camera_ip}...', 
                                   (50, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                        frame = placeholder
                    else:
                        no_frame_count = 0
                        last_frame_time = time.time()
                        frame = camera_frames[camera_ip].copy()
                
                # Encode frame as JPEG
                ret, buffer = cv2.imencode('.jpg', frame)
                if not ret:
                    continue
                    
                frame_bytes = buffer.tobytes()
                
                # Yield frame in multipart format
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                
                time.sleep(0.033)  # ~30 fps
                
        except GeneratorExit:
            logging.info(f"Client disconnected from camera {camera_ip} stream")
        except Exception as e:
            logging.error(f"Error in generate_camera_frames for {camera_ip}: {str(e)}")
        finally:
            # Decrease connection count
            with active_streams_lock:
                if camera_ip in active_streams:
                    active_streams[camera_ip] -= 1
                    logging.info(f"Client disconnected from camera {camera_ip} (remaining: {active_streams[camera_ip]})")
                    
                    # Clean up if no more connections
                    if active_streams[camera_ip] <= 0:
                        del active_streams[camera_ip]
    
    return Response(generate_camera_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/status')
def status():
    """API endpoint to check stream status"""
    global current_frame
    with frame_lock:
        streaming = current_frame is not None
    
    return jsonify({
        'streaming': streaming,
        'topic': KAFKA_TOPIC,
        'server': KAFKA_BOOTSTRAP_SERVERS
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'video-streaming'})

# ============================================================================
# CAMERA MANAGEMENT APIs (Run in main thread)
# These endpoints manage camera processes and consumer threads
# ============================================================================

@app.route('/api/camera/start', methods=['POST'])
def start_camera():
    """
    Start camera stream by IP
    Runs in main thread
    Creates: 1) Producer process, 2) Consumer background thread
    """
    try:
        data = request.get_json()
        camera_ip = data.get('ip')
        
        if not camera_ip:
            return jsonify({'error': 'IP address is required'}), 400
        
        # Validate IP format (basic validation)
        ip_parts = camera_ip.split('.')
        if len(ip_parts) != 4 or not all(part.isdigit() and 0 <= int(part) <= 255 for part in ip_parts):
            return jsonify({'error': 'Invalid IP address format'}), 400
        
        
        with camera_lock:
            # Check if camera is already running
            if camera_ip in active_cameras:
                return jsonify({
                    'message': f'Camera {camera_ip} is already running',
                    'status': 'already_active',
                    'topic': active_cameras[camera_ip]['topic']
                }), 200
            
            # Check if video file exists
            video_file = f"video/{camera_ip}.mp4"
            if not os.path.exists(video_file):
                return jsonify({
                    'error': f'Video file {video_file} not found',
                    'suggestion': f'Please place a video file named {video_file} in the current directory'
                }), 404
            
            # Start video producer process
            try:
                logging.info(f"Start {camera_ip} camera")
                # Check if running in Docker
                kafka_servers = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
                logging.info(f"Kafka is running in {kafka_servers}")
                
                # Create topic name from camera IP
                topic = f"camera-{camera_ip.replace('.', '-')}"
                
                process = subprocess.Popen([
                    'python', 'video_producer.py', video_file, 
                    '--kafka-servers', kafka_servers,
                    '--camera-ip', camera_ip
                ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                
                # Wait a moment to check if process started successfully
                time.sleep(2)
                if process.poll() is not None:
                    # Process has terminated
                    stdout, stderr = process.communicate()
                    return jsonify({
                        'error': 'Failed to start video producer',
                        'details': stderr.decode('utf-8') if stderr else 'Unknown error'
                    }), 500
                
                # Store process and topic
                active_cameras[camera_ip] = {
                    'process': process,
                    'topic': topic
                }
                
                # Create consumer for this camera
                consumer = VideoStreamConsumer(
                    topic, 
                    kafka_servers, 
                    frame_callback=create_camera_frame_callback(camera_ip)
                )
                camera_consumers[camera_ip] = consumer
                
                # Start consumer in a separate BACKGROUND thread
                # This thread will continuously receive frames from Kafka
                # and update shared memory via callback
                consumer_thread = Thread(target=consumer.start, daemon=True, name=f"Consumer-{camera_ip}")
                consumer_thread.start()
                
                # Store thread reference
                active_cameras[camera_ip]['thread'] = consumer_thread
                
                logging.info(f"Started background consumer thread for camera {camera_ip} on topic {topic}")
                
                return jsonify({
                    'message': f'Camera {camera_ip} started successfully',
                    'status': 'started',
                    'video_file': video_file,
                    'process_id': process.pid,
                    'topic': topic
                }), 200
                
            except Exception as e:
                return jsonify({
                    'error': f'Failed to start camera process: {str(e)}'
                }), 500
                
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/camera/stop', methods=['POST'])
def stop_camera():
    """Stop camera stream by IP"""
    try:
        data = request.get_json()
        camera_ip = data.get('ip')
        
        if not camera_ip:
            return jsonify({'error': 'IP address is required'}), 400
        
        with camera_lock:
            if camera_ip not in active_cameras:
                return jsonify({
                    'message': f'Camera {camera_ip} is not running',
                    'status': 'not_active'
                }), 200
            
            camera_info = active_cameras[camera_ip]
            process = camera_info['process']
            
            try:
                # Stop consumer
                if camera_ip in camera_consumers:
                    camera_consumers[camera_ip].stop()
                    del camera_consumers[camera_ip]
                
                # Remove frame
                with camera_frames_lock:
                    if camera_ip in camera_frames:
                        del camera_frames[camera_ip]
                
                # Terminate the process
                process.terminate()
                
                # Wait for process to terminate gracefully
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    # Force kill if it doesn't terminate gracefully
                    process.kill()
                    process.wait()
                
                del active_cameras[camera_ip]
                
                return jsonify({
                    'message': f'Camera {camera_ip} stopped successfully',
                    'status': 'stopped'
                }), 200
                
            except Exception as e:
                return jsonify({
                    'error': f'Failed to stop camera process: {str(e)}'
                }), 500
                
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/streams/active', methods=['GET'])
def list_active_streams():
    """List all active stream connections"""
    try:
        with active_streams_lock:
            streams = [
                {'camera_ip': ip, 'connections': count}
                for ip, count in active_streams.items()
            ]
        
        return jsonify({
            'active_streams': streams,
            'total_streams': len(streams),
            'total_connections': sum(s['connections'] for s in streams)
        }), 200
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/camera/list', methods=['GET'])
def list_cameras():
    """List all active cameras"""
    try:
        with camera_lock:
            camera_list = []
            for ip, camera_info in active_cameras.items():
                process = camera_info['process']
                topic = camera_info['topic']
                
                # Check if process is still running
                if process.poll() is None:
                    camera_list.append({
                        'ip': ip,
                        'status': 'running',
                        'process_id': process.pid,
                        'video_file': f"{ip}.mp4",
                        'topic': topic
                    })
                else:
                    # Process has died, remove from active list
                    camera_list.append({
                        'ip': ip,
                        'status': 'stopped',
                        'process_id': process.pid,
                        'video_file': f"{ip}.mp4",
                        'topic': topic
                    })
            
            # Clean up dead processes
            active_cameras_copy = active_cameras.copy()
            for ip, camera_info in active_cameras_copy.items():
                if camera_info['process'].poll() is not None:
                    del active_cameras[ip]
                    if ip in camera_consumers:
                        camera_consumers[ip].stop()
                        del camera_consumers[ip]
            
            return jsonify({
                'cameras': camera_list,
                'total_active': len([c for c in camera_list if c['status'] == 'running'])
            }), 200
            
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/camera/status/<ip>', methods=['GET'])
def camera_status(ip):
    """Get status of specific camera"""
    try:
        with camera_lock:
            if ip not in active_cameras:
                return jsonify({
                    'ip': ip,
                    'status': 'inactive',
                    'video_file': f"video/{ip}.mp4",
                    'file_exists': os.path.exists(f"video/{ip}.mp4")
                }), 200
            
            camera_info = active_cameras[ip]
            process = camera_info['process']
            topic = camera_info['topic']
            
            if process.poll() is None:
                return jsonify({
                    'ip': ip,
                    'status': 'running',
                    'process_id': process.pid,
                    'video_file': f"video/{ip}.mp4",
                    'file_exists': os.path.exists(f"video/{ip}.mp4"),
                    'topic': topic
                }), 200
            else:
                # Process has died
                del active_cameras[ip]
                if ip in camera_consumers:
                    camera_consumers[ip].stop()
                    del camera_consumers[ip]
                    
                return jsonify({
                    'ip': ip,
                    'status': 'stopped',
                    'video_file': f"video/{ip}.mp4",
                    'file_exists': os.path.exists(f"video/{ip}.mp4")
                }), 200
                
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

# ============================================================================
# PROCESSING APIs (Run in main thread)
# These endpoints perform CPU-intensive operations
# They read video files directly (not from Kafka stream)
# ============================================================================

@app.route('/api/search/person-in-video', methods=['POST'])
def search_person_in_video():
    """
    Search for a person in video by uploaded image
    Runs in main thread (blocking operation)
    Reads video file directly (not from Kafka stream)
    
    Request:
        - image: uploaded image file (multipart/form-data)
        - camera_ip: IP address of camera
        - threshold: optional confidence threshold (default: 0.6)
    
    Response:
        - detections: list of matches with frame_number, timestamp, confidence
        - total_frames: total frames processed
        - fps: video frame rate
    """
    try:
        # Validate request
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        if 'camera_ip' not in request.form:
            return jsonify({'error': 'Camera IP is required'}), 400
        
        image_file = request.files['image']
        camera_ip = request.form['camera_ip']
        threshold = float(request.form.get('threshold', 0.6))
        
        # Validate image file
        if image_file.filename == '':
            return jsonify({'error': 'Empty image filename'}), 400
        
        # Validate IP format
        ip_parts = camera_ip.split('.')
        if len(ip_parts) != 4 or not all(part.isdigit() and 0 <= int(part) <= 255 for part in ip_parts):
            return jsonify({'error': 'Invalid IP address format'}), 400
        
        # Check if video file exists
        video_file = f"video/{camera_ip}.mp4"
        if not os.path.exists(video_file):
            return jsonify({
                'error': f'Video file for camera {camera_ip} not found',
                'suggestion': f'Please ensure video file {video_file} exists'
            }), 404
        
        # Read and decode image
        image_bytes = image_file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        uploaded_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if uploaded_image is None:
            return jsonify({'error': 'Failed to decode image file'}), 400
        
        # Search for person in video
        logging.info(f"Searching for person in camera {camera_ip} with threshold {threshold}")
        result = utils.search_person_by_image_in_video(
            uploaded_image=uploaded_image,
            video_path=video_file,
            threshold=threshold
        )
        
        # Check for errors
        if 'error' in result and result['error']:
            if 'No face detected' in result['error']:
                return jsonify({'error': result['error']}), 422
            else:
                return jsonify({'error': result['error']}), 500
        
        # Return results
        return jsonify({
            'success': True,
            'camera_ip': camera_ip,
            'threshold': threshold,
            'detections': result.get('detections', []),
            'total_detections': len(result.get('detections', [])),
            'total_frames': result.get('total_frames', 0),
            'fps': result.get('fps', 0)
        }), 200
        
    except ValueError as e:
        return jsonify({'error': f'Invalid parameter value: {str(e)}'}), 400
    except Exception as e:
        logging.error(f"Error in person search: {str(e)}")
        return jsonify({'error': 'Internal server error occurred'}), 500

@app.route('/api/detection/frame-image', methods=['POST'])
def get_detection_frame_image():
    """
    Get frame image with bounding boxes drawn for multiple faces
    Runs in main thread
    Reads video file directly (not from Kafka stream)
    
    Request (JSON):
        - camera_ip: IP address of camera
        - frame_number: frame number to extract
        - faces: list of face objects, each containing:
            - bbox: {x, y, width, height}
            - confidence: confidence score (optional)
            - label: text label (optional, e.g., person name)
    
    Response:
        - JPEG image with bounding boxes drawn for all faces
    
    Example request:
    {
        "camera_ip": "192.168.1.100",
        "frame_number": 150,
        "faces": [
            {
                "bbox": {"x": 100, "y": 50, "width": 80, "height": 100},
                "confidence": 95.5,
                "label": "John Doe"
            },
            {
                "bbox": {"x": 300, "y": 60, "width": 75, "height": 95},
                "confidence": 87.3,
                "label": "Jane Smith"
            }
        ]
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        camera_ip = data.get('camera_ip')
        frame_number = data.get('frame_number')
        faces = data.get('faces', []) 
        
        if not camera_ip:
            return jsonify({'error': 'camera_ip is required'}), 400
        if frame_number is None:
            return jsonify({'error': 'frame_number is required'}), 400
        
        # Validate faces is a list
        if not isinstance(faces, list):
            return jsonify({'error': 'faces must be a list'}), 400
        
        # Validate IP format
        ip_parts = camera_ip.split('.')
        if len(ip_parts) != 4 or not all(part.isdigit() and 0 <= int(part) <= 255 for part in ip_parts):
            return jsonify({'error': 'Invalid IP address format'}), 400
        
        # Check if video file exists
        video_file = f"video/{camera_ip}.mp4"
        if not os.path.exists(video_file):
            return jsonify({
                'error': f'Video file for camera {camera_ip} not found',
                'suggestion': f'Please ensure video file {video_file} exists'
            }), 404
        
        # Open video file
        cap = cv2.VideoCapture(video_file)
        if not cap.isOpened():
            return jsonify({'error': 'Failed to open video file'}), 500
        
        # Set frame position
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
        
        # Read frame
        ret, frame = cap.read()
        cap.release()
        
        if not ret or frame is None:
            return jsonify({'error': f'Failed to read frame {frame_number}'}), 404
        
        # Draw bounding boxes for all faces
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.6
        font_thickness = 2
        box_thickness = 2
        
        # Define colors for different faces (cycle through if more faces than colors)
        colors = [
            (0, 255, 0),    # Green
            (255, 0, 0),    # Blue
            (0, 0, 255),    # Red
            (255, 255, 0),  # Cyan
            (255, 0, 255),  # Magenta
            (0, 255, 255),  # Yellow
        ]
        
        for idx, face in enumerate(faces):
            # Validate face structure
            if not isinstance(face, dict):
                logging.warning(f"Skipping invalid face at index {idx}: not a dict")
                continue
            
            bbox = face.get('bbox')
            if not bbox:
                logging.warning(f"Skipping face at index {idx}: missing bbox")
                continue
            
            # Validate bbox structure
            required_bbox_fields = ['x', 'y', 'width', 'height']
            if not all(field in bbox for field in required_bbox_fields):
                logging.warning(f"Skipping face at index {idx}: bbox missing required fields")
                continue
            
            try:
                # Extract bbox coordinates
                x = int(bbox['x'])
                y = int(bbox['y'])
                width = int(bbox['width'])
                height = int(bbox['height'])
                
                # Get color for this face (cycle through colors)
                color = colors[idx % len(colors)]
                
                # Draw bounding box
                cv2.rectangle(frame, (x, y), (x + width, y + height), color, box_thickness)
                
                # Prepare label text
                label_parts = []
                
                # Add custom label if provided
                if 'label' in face and face['label']:
                    label_parts.append(str(face['label']))
                
                # Add confidence if provided
                confidence = face.get('confidence')
                if confidence is not None:
                    label_parts.append(f"{confidence:.1f}%")
                
                # Combine label parts
                if label_parts:
                    label = " - ".join(label_parts)
                    
                    # Get text size for background
                    (text_width, text_height), baseline = cv2.getTextSize(
                        label, font, font_scale, font_thickness
                    )
                    
                    # Calculate text position (above bbox)
                    text_y = y - 10
                    if text_y < text_height + 10:
                        # If not enough space above, put it below
                        text_y = y + height + text_height + 10
                    
                    # Draw background rectangle for text
                    cv2.rectangle(
                        frame, 
                        (x, text_y - text_height - 5), 
                        (x + text_width + 5, text_y + 5), 
                        color, 
                        -1
                    )
                    
                    # Draw text
                    cv2.putText(
                        frame, 
                        label, 
                        (x + 2, text_y), 
                        font, 
                        font_scale, 
                        (255, 255, 255),  # White text
                        font_thickness
                    )
                
            except (ValueError, TypeError) as e:
                logging.warning(f"Error processing face at index {idx}: {str(e)}")
                continue
        
        # Encode frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 95])
        if not ret:
            return jsonify({'error': 'Failed to encode image'}), 500
        
        # Return image
        return Response(buffer.tobytes(), mimetype='image/jpeg')
        
    except ValueError as e:
        return jsonify({'error': f'Invalid parameter value: {str(e)}'}), 400
    except Exception as e:
        logging.error(f"Error generating detection frame image: {str(e)}")
        return jsonify({'error': 'Internal server error occurred'}), 500

@app.route('/api/compare-faces', methods=['POST'])
def compare_two_faces():
    """
    Compare two face images and calculate similarity
    Runs in main thread (CPU-intensive operation)
    Independent of Kafka streaming
    
    Request (multipart/form-data):
        - image1: first face image file (required)
        - image2: second face image file (required)
        - threshold: optional distance threshold (default: 0.6)
    
    Response:
        - distance: L2 distance between embeddings
        - similarity: similarity percentage (0-100%)
        - is_match: boolean indicating if faces match
        - threshold: threshold used for comparison
    """
    try:
        # Validate request
        if 'image1' not in request.files:
            return jsonify({'error': 'image1 is required'}), 400
        
        if 'image2' not in request.files:
            return jsonify({'error': 'image2 is required'}), 400
        
        image1_file = request.files['image1']
        image2_file = request.files['image2']
        threshold = float(request.form.get('threshold', 0.6)) or 0.5
        
        # Validate image files
        if image1_file.filename == '':
            return jsonify({'error': 'Empty image1 filename'}), 400
        
        if image2_file.filename == '':
            return jsonify({'error': 'Empty image2 filename'}), 400
        
        # Read and decode images
        image1_bytes = image1_file.read()
        image2_bytes = image2_file.read()
        
        nparr1 = np.frombuffer(image1_bytes, np.uint8)
        nparr2 = np.frombuffer(image2_bytes, np.uint8)
        
        image1 = cv2.imdecode(nparr1, cv2.IMREAD_COLOR)
        image2 = cv2.imdecode(nparr2, cv2.IMREAD_COLOR)
        
        if image1 is None:
            return jsonify({'error': 'Failed to decode image1'}), 400
        
        if image2 is None:
            return jsonify({'error': 'Failed to decode image2'}), 400
        
        # Detect faces
        logging.info("Detecting faces in both images...")
        faces1 = DETECTOR.detect_faces(image1)
        faces2 = DETECTOR.detect_faces(image2)
        
        if not faces1:
            return jsonify({'error': 'No face detected in image1'}), 422
        
        if not faces2:
            return jsonify({'error': 'No face detected in image2'}), 422
        
        # Get first face from each image
        bbox1 = faces1[0]['box']
        bbox2 = faces2[0]['box']
        
        # Crop faces
        face1 = utils.crop_face(image1, bbox1)
        face2 = utils.crop_face(image2, bbox2)
        
        # Preprocess faces
        logging.info("Preprocessing faces...")
        face1_preprocessed = utils.preprocess_img(face1)
        face2_preprocessed = utils.preprocess_img(face2)
        
        # Generate embeddings
        logging.info("Generating embeddings...")
        embedding1 = utils.image_to_embedding(face1_preprocessed, INFER)
        embedding2 = utils.image_to_embedding(face2_preprocessed, INFER)
        embedding1 = embedding1.flatten()
        embedding2 = embedding2.flatten()
        
        # Calculate distance
        logging.info("Calculating distance...")
        distance = utils.cosine_similarity_numpy(embedding1, embedding2)
        
        # Distance around -1 - 1
        # Calculate similarity percentage
        similarity = (distance+1)/2 * 100
        
        # Determine if match
        is_match = distance > threshold
        
        # Return results
        return jsonify({
            'success': True,
            'distance': float(distance),
            'similarity': float(similarity),
            'is_match': bool(is_match),
            'threshold': threshold,
            'bbox1': {
                'x': int(bbox1[0]),
                'y': int(bbox1[1]),
                'width': int(bbox1[2]),
                'height': int(bbox1[3])
            },
            'bbox2': {
                'x': int(bbox2[0]),
                'y': int(bbox2[1]),
                'width': int(bbox2[2]),
                'height': int(bbox2[3])
            },
            'embedding_dimension': int(embedding1.shape[0]) if hasattr(embedding1, 'shape') else len(embedding1)
        }), 200
        
    except ValueError as e:
        return jsonify({'error': f'Invalid parameter value: {str(e)}'}), 400
    except Exception as e:
        logging.error(f"Error comparing faces: {str(e)}")
        return jsonify({'error': 'Internal server error occurred'}), 500


@app.route('/api/add-chroma', methods=['POST'])
def add_person_to_chroma():
    """
    Add a person's face embedding to ChromaDB
    Runs in main thread (CPU-intensive operation)
    Independent of Kafka streaming
    
    Request (JSON):
        - person_id: unique identifier for the person (required)
        - name: person's full name (required)
        - image_url: URL to face image (required)
        - metadata: optional object with additional metadata
    
    Response:
        - success: boolean indicating if operation succeeded
        - person_id: the ID of the added person
        - message: status message
    """
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        # Validate required fields
        if 'person_id' not in data:
            return jsonify({'error': 'person_id is required'}), 400
        
        if 'name' not in data:
            return jsonify({'error': 'name is required'}), 400
        
        if 'image_url' not in data:
            return jsonify({'error': 'image_url is required'}), 400
        
        person_id = data['person_id']
        name = data['name']
        image_url = data['image_url']
        
        # Validate image URL
        if not image_url or not isinstance(image_url, str):
            return jsonify({'error': 'Invalid image_url'}), 400
        
        # Download image from URL
        logging.info(f"Downloading image from URL: {image_url}")
        try:
            import requests
            
            # Determine if it's a local file path or URL
            if image_url.startswith('http://') or image_url.startswith('https://'):
                # Download from URL
                response = requests.get(image_url, timeout=10)
                if response.status_code != 200:
                    return jsonify({'error': f'Failed to download image from URL: HTTP {response.status_code}'}), 400
                image_bytes = response.content
            else:
                # Local file path (relative to backend uploads directory)
                # Construct full path
                backend_base_url = os.getenv('BACKEND_BASE_URL', 'http://localhost:8080')
                full_url = f"{backend_base_url}{image_url}"
                
                logging.info(f"Fetching image from backend: {full_url}")
                response = requests.get(full_url, timeout=10)
                if response.status_code != 200:
                    return jsonify({'error': f'Failed to fetch image from backend: HTTP {response.status_code}'}), 400
                image_bytes = response.content
            
            # Decode image
            nparr = np.frombuffer(image_bytes, np.uint8)
            uploaded_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if uploaded_image is None:
                return jsonify({'error': 'Failed to decode image from URL'}), 400
                
        except requests.exceptions.Timeout:
            return jsonify({'error': 'Timeout while downloading image'}), 408
        except requests.exceptions.RequestException as e:
            return jsonify({'error': f'Failed to download image: {str(e)}'}), 400
        except Exception as e:
            return jsonify({'error': f'Error processing image: {str(e)}'}), 400
        
        # Parse optional metadata
        metadata = data.get('metadata', {})
        if not isinstance(metadata, dict):
            metadata = {}
        
        # Add name to metadata
        metadata['name'] = name
        
        # Add person to ChromaDB
        logging.info(f"Adding person {name} (ID: {person_id}) to ChromaDB")
        result = utils.add_person_to_chroma(
            person_id=str(person_id),
            face_image=uploaded_image,
            metadata=metadata,
            infer=INFER,
            collection=COLLECTION,
            detector=DETECTOR
        )
        
        # Check for errors
        if 'error' in result and result['error']:
            if 'No face detected' in result['error']:
                return jsonify({'error': result['error']}), 422
            else:
                return jsonify({'error': result['error']}), 500
        
        # Return success response
        return jsonify({
            'success': True,
            'person_id': person_id,
            'name': name,
            'message': f'Successfully added {name} to ChromaDB',
            'embedding_dimension': result.get('embedding_dimension', 128)
        }), 201
        
    except ValueError as e:
        return jsonify({'error': f'Invalid parameter value: {str(e)}'}), 400
    except Exception as e:
        logging.error(f"Error adding person to ChromaDB: {str(e)}")
        return jsonify({'error': 'Internal server error occurred'}), 500



# ============================================================================
# APPLICATION STARTUP
# ============================================================================

if __name__ == '__main__':
    logging.info("="*80)
    logging.info("STARTING VIDEO STREAMING APPLICATION")
    logging.info("="*80)
    logging.info("Thread Architecture:")
    logging.info("  - Main Thread: Flask HTTP server (handles API requests)")
    logging.info("  - Background Threads: Kafka consumers (receive video frames)")
    logging.info("  - Shared Memory: Frame dictionaries with thread-safe locks")
    logging.info("="*80)
    
    # Register cleanup handler with all consumers
    register_cleanup_handler(active_cameras, camera_lock, camera_consumers, video_consumer)
    logging.info("✓ Cleanup handlers registered")
    
    # Start default Kafka consumer in background thread
    # This thread will continuously receive frames and update shared memory
    start_consumer_thread(video_consumer)
    logging.info(f"✓ Default consumer thread started (topic: {KAFKA_TOPIC})")
    
    # Start Flask server in main thread
    # This handles all HTTP requests (streaming, search, processing)
    logging.info("✓ Starting Flask server on 0.0.0.0:5001")
    logging.info("="*80)
    
    try:
        app.run(host='0.0.0.0', port=5001, debug=False, threaded=True)
    except KeyboardInterrupt:
        logging.info("\n" + "="*80)
        logging.info("SHUTTING DOWN APPLICATION")
        logging.info("="*80)
        from service.StreamService import cleanup_consumers
        
        # Stop all consumers
        logging.info("Stopping camera consumers...")
        cleanup_consumers(camera_consumers)
        
        logging.info("Stopping default consumer...")
        video_consumer.stop()
        
        # Cleanup camera processes
        logging.info("Cleaning up camera processes...")
        cleanup_processes(active_cameras, camera_lock)
        
        logging.info("✓ Shutdown complete")
        logging.info("="*80)
