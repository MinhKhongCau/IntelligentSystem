from kafka import KafkaConsumer
import json
import base64
import numpy as np
import cv2
import logging
import time

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
        
        try:
            self.consumer = KafkaConsumer(
                self.topic,
                bootstrap_servers=self.bootstrap_servers,
                auto_offset_reset='latest',
                enable_auto_commit=True,
                consumer_timeout_ms=1000,  # Timeout to allow checking running flag
                value_deserializer=lambda x: json.loads(x.decode('utf-8'))
            )
            
            logging.info(f"Started consuming from topic: {self.topic}")
            
            while self.running:
                try:
                    # Poll with timeout to allow graceful shutdown
                    messages = self.consumer.poll(timeout_ms=1000)
                    
                    for topic_partition, records in messages.items():
                        for message in records:
                            if not self.running:
                                break
                                
                            try:
                                data = message.value
                                
                                # Decode base64 image
                                img_data = base64.b64decode(data['frame'])
                                nparr = np.frombuffer(img_data, np.uint8)
                                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                                
                                # Call callback if provided
                                if self.frame_callback and frame is not None:
                                    self.frame_callback(frame)
                                    
                            except Exception as e:
                                logging.error(f"Error processing frame: {e}")
                                
                except Exception as e:
                    if self.running:
                        logging.error(f"Error polling messages: {e}")
                    time.sleep(0.1)
                    
        except Exception as e:
            logging.error(f"Error starting consumer: {e}")
        finally:
            self._cleanup()
                
    def stop(self):
        """Stop consuming"""
        logging.info(f"Stopping consumer for topic: {self.topic}")
        self.running = False
        time.sleep(0.5)  # Give time for poll loop to exit
        self._cleanup()
        
    def _cleanup(self):
        """Clean up consumer resources"""
        if self.consumer:
            try:
                self.consumer.close(autocommit=False)
                logging.info(f"Consumer closed for topic: {self.topic}")
            except Exception as e:
                logging.warning(f"Error closing consumer: {e}")
            finally:
                self.consumer = None
