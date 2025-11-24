"""
Video Producer - Captures video and sends frames to Kafka
This simulates a CCTV camera streaming to Kafka
"""

from kafka import KafkaProducer
import cv2
import json
import base64
import time
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)

class VideoProducer:
    def __init__(self, topic='video-stream', bootstrap_servers='localhost:9092', camera_ip=None):
        # Use camera IP as topic name if provided
        if camera_ip:
            self.topic = f"camera-{camera_ip.replace('.', '-')}"
        else:
            self.topic = topic
        
        self.camera_ip = camera_ip
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        logging.info(f"Video Producer initialized for topic: {self.topic}")
        
    def stream_from_camera(self, camera_id=0, fps=30):
        """Stream video from camera to Kafka"""
        cap = cv2.VideoCapture(camera_id)
        
        if not cap.isOpened():
            logging.error(f"Cannot open camera {camera_id}")
            return
        
        logging.info(f"Streaming from camera {camera_id} at {fps} FPS")
        frame_count = 0
        
        try:
            while True:
                ret, frame = cap.read()
                
                if not ret:
                    logging.warning("Failed to read frame")
                    break
                
                # Resize frame for better performance
                frame = cv2.resize(frame, (640, 480))
                
                # Add timestamp overlay
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                cv2.putText(frame, f"CCTV - {timestamp}", (10, 30),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                
                # Encode frame as JPEG
                ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                
                if ret:
                    # Convert to base64
                    frame_base64 = base64.b64encode(buffer).decode('utf-8')
                    
                    # Create message
                    message = {
                        'frame': frame_base64,
                        'timestamp': timestamp,
                        'camera_id': camera_id,
                        'frame_number': frame_count
                    }
                    
                    # Send to Kafka
                    self.producer.send(self.topic, value=message)
                    frame_count += 1
                    
                    if frame_count % 100 == 0:
                        logging.info(f"Sent {frame_count} frames")
                
                # Control FPS
                time.sleep(1.0 / fps)
                
        except KeyboardInterrupt:
            logging.info("Streaming stopped by user")
        finally:
            cap.release()
            self.producer.close()
            logging.info("Camera released and producer closed")
    
    def stream_from_video_file(self, video_path, fps=30, loop=True):
        """Stream video from file to Kafka"""
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            logging.error(f"Cannot open video file: {video_path}")
            return
        
        logging.info(f"Streaming from video file: {video_path}")
        frame_count = 0
        
        try:
            while True:
                ret, frame = cap.read()
                
                if not ret:
                    if loop:
                        # Restart video
                        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                        logging.info("Video restarted (loop mode)")
                        continue
                    else:
                        break
                
                # Resize frame
                frame = cv2.resize(frame, (640, 480))
                
                # Add timestamp overlay
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                cv2.putText(frame, f"CCTV Recording - {timestamp}", (10, 30),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                
                # Encode frame as JPEG
                ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                
                if ret:
                    # Convert to base64
                    frame_base64 = base64.b64encode(buffer).decode('utf-8')
                    
                    # Create message
                    message = {
                        'frame': frame_base64,
                        'timestamp': timestamp,
                        'source': video_path,
                        'frame_number': frame_count
                    }
                    
                    # Send to Kafka
                    self.producer.send(self.topic, value=message)
                    frame_count += 1
                    
                    if frame_count % 100 == 0:
                        logging.info(f"Sent {frame_count} frames")
                
                # Control FPS
                time.sleep(1.0 / fps)
                
        except KeyboardInterrupt:
            logging.info("Streaming stopped by user")
        finally:
            cap.release()
            self.producer.close()
            logging.info("Video file closed and producer closed")

if __name__ == '__main__':
    import sys
    import argparse
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Video Producer for Kafka Streaming')
    parser.add_argument('source', nargs='?', help='Camera ID or video file path')
    parser.add_argument('--kafka-servers', default='localhost:9092', help='Kafka bootstrap servers')
    parser.add_argument('--topic', default=None, help='Kafka topic (optional, will use camera IP if not provided)')
    parser.add_argument('--camera-ip', default=None, help='Camera IP address (used as topic name)')
    parser.add_argument('--fps', type=int, default=30, help='Frames per second')
    
    args = parser.parse_args()
    
    # Extract camera IP from video file path if not provided
    camera_ip = args.camera_ip
    if not camera_ip and args.source:
        # Try to extract IP from filename (e.g., video/10.0.0.1.mp4 -> 10.0.0.1)
        import re
        ip_match = re.search(r'(\d+\.\d+\.\d+\.\d+)', args.source)
        if ip_match:
            camera_ip = ip_match.group(1)
    
    producer = VideoProducer(
        topic=args.topic, 
        bootstrap_servers=args.kafka_servers,
        camera_ip=camera_ip
    )
    
    # Check video source
    if args.source:
        video_source = args.source
        if video_source.isdigit():
            # Camera ID
            producer.stream_from_camera(camera_id=int(video_source), fps=args.fps)
        else:
            # Video file path
            producer.stream_from_video_file(video_path=video_source, fps=args.fps, loop=True)
    else:
        # Default: use webcam
        print("Usage: python video_producer.py [camera_id|video_file_path] [--kafka-servers SERVERS] [--camera-ip IP]")
        print("Starting with default camera (0)...")
        producer.stream_from_camera(camera_id=0, fps=args.fps)
