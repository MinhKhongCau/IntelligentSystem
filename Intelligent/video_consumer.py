from kafka import KafkaConsumer
import json
import base64
import numpy as np
import cv2
import logging

class VideoStreamConsumer:
    def __init__(self, topic, bootstrap_servers, frame_callback=None):
        self.topic = topic
        self.bootstrap_servers = bootstrap_servers
        self.consumer = None
        self.running = False
        self.frame_callback = frame_callback
        
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
                
                # Call callback if provided
                if self.frame_callback:
                    self.frame_callback(frame)
                    
            except Exception as e:
                logging.error(f"Error processing frame: {e}")
                
    def stop(self):
        """Stop consuming"""
        self.running = False
        if self.consumer:
            self.consumer.close()
