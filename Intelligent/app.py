from flask import Flask, Response, render_template, jsonify, request
import cv2
import numpy as np
import json
import base64
from threading import Thread, Lock
import logging
import subprocess
import os
import time
from video_consumer import VideoStreamConsumer
from service.StreamService import start_consumer_thread, cleanup_processes

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Global variables for frame storage
current_frame = None
frame_lock = Lock()

# Kafka configuration
KAFKA_BOOTSTRAP_SERVERS = os.environ.get('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
KAFKA_TOPIC = 'video-stream'

# Global variables for camera management
active_cameras = {}  # {ip: process}
camera_lock = Lock()

def update_frame(frame):
    """Callback to update current frame"""
    global current_frame
    with frame_lock:
        current_frame = frame

# Initialize consumer with callback
video_consumer = VideoStreamConsumer(KAFKA_TOPIC, KAFKA_BOOTSTRAP_SERVERS, frame_callback=update_frame)

def generate_frames():
    """Generator function to yield video frames"""
    global current_frame
    
    while True:
        with frame_lock:
            if current_frame is None:
                # Send a placeholder frame if no video available
                placeholder = np.zeros((480, 640, 3), dtype=np.uint8)
                cv2.putText(placeholder, 'Waiting for video stream...', 
                           (50, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                frame = placeholder
            else:
                frame = current_frame.copy()
        
        # Encode frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue
            
        frame_bytes = buffer.tobytes()
        
        # Yield frame in multipart format
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index_page():
    """Main page with video player"""
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    """Video streaming route"""
    return Response(generate_frames(),
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

@app.route('/api/camera/start', methods=['POST'])
def start_camera():
    """Start camera stream by IP"""
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
                    'status': 'already_active'
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
                print(f"Start {camera_ip} camera")
                # Check if running in Docker
                kafka_servers = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
                print(f"Kafka is running in {kafka_servers}")
                
                process = subprocess.Popen([
                    'python', 'video_producer.py', video_file, '--kafka-servers', kafka_servers
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
                
                active_cameras[camera_ip] = process
                
                return jsonify({
                    'message': f'Camera {camera_ip} started successfully',
                    'status': 'started',
                    'video_file': video_file,
                    'process_id': process.pid
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
            
            process = active_cameras[camera_ip]
            
            try:
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

@app.route('/api/camera/list', methods=['GET'])
def list_cameras():
    """List all active cameras"""
    try:
        with camera_lock:
            camera_list = []
            for ip, process in active_cameras.items():
                # Check if process is still running
                if process.poll() is None:
                    camera_list.append({
                        'ip': ip,
                        'status': 'running',
                        'process_id': process.pid,
                        'video_file': f"{ip}.mp4"
                    })
                else:
                    # Process has died, remove from active list
                    camera_list.append({
                        'ip': ip,
                        'status': 'stopped',
                        'process_id': process.pid,
                        'video_file': f"{ip}.mp4"
                    })
            
            # Clean up dead processes
            active_cameras_copy = active_cameras.copy()
            for ip, process in active_cameras_copy.items():
                if process.poll() is not None:
                    del active_cameras[ip]
            
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
                    'video_file': f"{ip}.mp4",
                    'file_exists': os.path.exists(f"{ip}.mp4")
                }), 200
            
            process = active_cameras[ip]
            if process.poll() is None:
                return jsonify({
                    'ip': ip,
                    'status': 'running',
                    'process_id': process.pid,
                    'video_file': f"{ip}.mp4",
                    'file_exists': os.path.exists(f"{ip}.mp4")
                }), 200
            else:
                # Process has died
                del active_cameras[ip]
                return jsonify({
                    'ip': ip,
                    'status': 'stopped',
                    'video_file': f"video/{ip}.mp4",
                    'file_exists': os.path.exists(f"{ip}.mp4")
                }), 200
                
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500



import atexit

def cleanup_on_exit():
    """Cleanup function for atexit"""
    cleanup_processes(active_cameras, camera_lock)

atexit.register(cleanup_on_exit)

if __name__ == '__main__':
    # Start Kafka consumer
    start_consumer_thread(video_consumer)
    
    # Start Flask server
    try:
        app.run(host='0.0.0.0', port=5001, debug=False, threaded=True)
    except KeyboardInterrupt:
        logging.info("Shutting down server...")
        cleanup_processes(active_cameras, camera_lock)
