"""
Face Recognition Service - Monitors video stream and detects missing persons
"""

import untils
import logging
import json
import requests
import os
from datetime import datetime

logging.basicConfig(level=logging.INFO)

# Configuration
KAFKA_TOPIC = 'video-stream'
KAFKA_SERVERS = 'localhost:9092'
BACKEND_API = 'http://localhost:8080/api'
DETECTION_THRESHOLD = 0.6

def send_alert_to_backend(alert_data):
    """Send detection alert to backend API"""
    try:
        response = requests.post(
            f"{BACKEND_API}/alerts/face-detection",
            json=alert_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            logging.info(f"Alert sent successfully for {alert_data['person_id']}")
        else:
            logging.error(f"Failed to send alert: {response.status_code}")
            
    except Exception as e:
        logging.error(f"Error sending alert to backend: {e}")

def alert_handler(alert_data, frame):
    """Handle detection alerts"""
    # Log to console
    logging.info(f"🚨 PERSON DETECTED: {alert_data['person_id']}")
    logging.info(f"   Camera: {alert_data.get('camera_id', 'Unknown')}")
    logging.info(f"   Time: {alert_data['timestamp']}")
    logging.info(f"   Confidence: {(1 - alert_data['distance']) * 100:.1f}%")
    
    # Send to backend
    send_alert_to_backend(alert_data)
    
    # Save detection image (optional)
    try:
        import cv2
        bbox = alert_data['bbox']
        x, y, w, h = bbox['x'], bbox['y'], bbox['width'], bbox['height']
        
        # Crop face
        face_img = frame[y:y+h, x:x+w]
        
        # Save with timestamp
        timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"detections/{alert_data['person_id']}_{timestamp_str}.jpg"
        
        os.makedirs('detections', exist_ok=True)
        cv2.imwrite(filename, face_img)
        logging.info(f"   Saved detection image: {filename}")
        
    except Exception as e:
        logging.error(f"Error saving detection image: {e}")

def start_monitoring(target_person_id=None):
    """
    Start monitoring video stream for face recognition
    
    Args:
        target_person_id: Specific person to search for (None = monitor all)
    """
    if target_person_id:
        logging.info(f"🔍 Starting targeted search for: {target_person_id}")
        untils.search_person_in_video_stream(
            target_person_id=target_person_id,
            topic=KAFKA_TOPIC,
            bootstrap_servers=KAFKA_SERVERS,
            threshold=DETECTION_THRESHOLD,
            alert_callback=alert_handler
        )
    else:
        logging.info("🔍 Starting general face recognition monitoring")
        untils.process_video_stream(
            topic=KAFKA_TOPIC,
            bootstrap_servers=KAFKA_SERVERS,
            callback=lambda predictions, frame, metadata: handle_all_detections(predictions, frame, metadata)
        )

def handle_all_detections(predictions, frame, metadata):
    """Handle all face detections (not just specific person)"""
    if predictions:
        logging.info(f"Detected {len(predictions)} face(s) in frame {metadata.get('frame_number')}")
        
        for pred in predictions:
            person_name = pred.get('person_name')
            distance = pred.get('face', {}).get('distance')
            
            if distance < DETECTION_THRESHOLD:
                alert_data = {
                    'person_id': person_name,
                    'distance': distance,
                    'timestamp': metadata.get('timestamp'),
                    'camera_id': metadata.get('camera_id'),
                    'frame_number': metadata.get('frame_number'),
                    'bbox': pred.get('face')
                }
                
                # Send alert for any recognized person
                alert_handler(alert_data, frame)

if __name__ == '__main__':
    import sys
    import os
    
    # Get target person from command line
    target_person = sys.argv[1] if len(sys.argv) > 1 else None
    
    try:
        start_monitoring(target_person_id=target_person)
    except KeyboardInterrupt:
        logging.info("\n👋 Face recognition service stopped")
    except Exception as e:
        logging.error(f"Error in face recognition service: {e}")
