from flask import Flask, Response, render_template_string, jsonify
from kafka import KafkaConsumer
import cv2
import numpy as np
import json
import base64
from threading import Thread, Lock
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Global variables for frame storage
current_frame = None
frame_lock = Lock()

# Kafka configuration
KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'
KAFKA_TOPIC = 'video-stream'

class VideoStreamConsumer:
    def __init__(self, topic, bootstrap_servers):
        self.topic = topic
        self.bootstrap_servers = bootstrap_servers
        self.consumer = None
        self.running = False
        
    def start(self):
        """Start consuming video frames from Kafka"""
        self.running = True
        self.consumer = KafkaConsumer(
            self.topic,
            bootstrap_servers=self.bootstrap_servers,
            auto_offset_reset='latest',
            enable_auto_commit=True,
            value_deserializer=lambda x: json.loads(x.decode('utf-8'))
        )
        
        logging.info(f"Started consuming from topic: {self.topic}")
        
        for message in self.consumer:
            if not self.running:
                break
                
            try:
                data = message.value
                
                # Decode base64 image
                img_data = base64.b64decode(data['frame'])
                nparr = np.frombuffer(img_data, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                # Update global frame
                global current_frame
                with frame_lock:
                    current_frame = frame
                    
            except Exception as e:
                logging.error(f"Error processing frame: {e}")
                
    def stop(self):
        """Stop consuming"""
        self.running = False
        if self.consumer:
            self.consumer.close()

# Initialize consumer
video_consumer = VideoStreamConsumer(KAFKA_TOPIC, KAFKA_BOOTSTRAP_SERVERS)

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
def index():
    """Main page with video player"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Police Video Monitoring System</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            }
            h1 {
                color: #333;
                text-align: center;
                margin-bottom: 10px;
            }
            .subtitle {
                text-align: center;
                color: #666;
                margin-bottom: 30px;
            }
            .video-container {
                position: relative;
                width: 100%;
                max-width: 960px;
                margin: 0 auto;
                background: #000;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }
            .video-stream {
                width: 100%;
                height: auto;
                display: block;
            }
            .controls {
                margin-top: 20px;
                text-align: center;
            }
            .btn {
                padding: 12px 30px;
                margin: 0 10px;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s;
            }
            .btn-primary {
                background: #667eea;
                color: white;
            }
            .btn-primary:hover {
                background: #5568d3;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            .btn-danger {
                background: #f56565;
                color: white;
            }
            .btn-danger:hover {
                background: #e53e3e;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);
            }
            .status {
                text-align: center;
                margin-top: 20px;
                padding: 15px;
                border-radius: 5px;
                font-weight: bold;
            }
            .status.online {
                background: #c6f6d5;
                color: #22543d;
            }
            .status.offline {
                background: #fed7d7;
                color: #742a2a;
            }
            .info-panel {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }
            .info-card {
                background: #f7fafc;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            .info-card h3 {
                margin: 0 0 5px 0;
                font-size: 14px;
                color: #666;
            }
            .info-card p {
                margin: 0;
                font-size: 20px;
                font-weight: bold;
                color: #333;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚔 Police Video Monitoring System</h1>
            <p class="subtitle">Real-time CCTV Stream via Kafka</p>
            
            <div class="video-container">
                <img class="video-stream" src="{{ url_for('video_feed') }}" alt="Video Stream">
            </div>
            
            <div class="controls">
                <button class="btn btn-primary" onclick="refreshStream()">🔄 Refresh Stream</button>
                <button class="btn btn-danger" onclick="fullscreen()">⛶ Fullscreen</button>
            </div>
            
            <div id="status" class="status online">
                ● Stream Active
            </div>
            
            <div class="info-panel">
                <div class="info-card">
                    <h3>Kafka Topic</h3>
                    <p>video-stream</p>
                </div>
                <div class="info-card">
                    <h3>Server</h3>
                    <p>localhost:9092</p>
                </div>
                <div class="info-card">
                    <h3>Status</h3>
                    <p id="connection-status">Connected</p>
                </div>
            </div>
        </div>
        
        <script>
            function refreshStream() {
                const img = document.querySelector('.video-stream');
                const src = img.src;
                img.src = '';
                setTimeout(() => {
                    img.src = src + '?t=' + new Date().getTime();
                }, 100);
            }
            
            function fullscreen() {
                const container = document.querySelector('.video-container');
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
            }
            
            // Check stream status periodically
            setInterval(() => {
                fetch('/api/status')
                    .then(response => response.json())
                    .then(data => {
                        const statusDiv = document.getElementById('status');
                        const connectionStatus = document.getElementById('connection-status');
                        
                        if (data.streaming) {
                            statusDiv.className = 'status online';
                            statusDiv.textContent = '● Stream Active';
                            connectionStatus.textContent = 'Connected';
                        } else {
                            statusDiv.className = 'status offline';
                            statusDiv.textContent = '○ Stream Inactive';
                            connectionStatus.textContent = 'Waiting...';
                        }
                    })
                    .catch(error => {
                        console.error('Status check failed:', error);
                    });
            }, 3000);
        </script>
    </body>
    </html>
    """
    return render_template_string(html)

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

def start_consumer_thread():
    """Start Kafka consumer in background thread"""
    consumer_thread = Thread(target=video_consumer.start, daemon=True)
    consumer_thread.start()
    logging.info("Kafka consumer thread started")

if __name__ == '__main__':
    # Start Kafka consumer
    start_consumer_thread()
    
    # Start Flask server
    app.run(host='0.0.0.0', port=5001, debug=False, threaded=True)
