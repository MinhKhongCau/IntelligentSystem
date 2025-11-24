from threading import Thread, Lock
import logging
import subprocess
import atexit
import time

def start_consumer_thread(video_consumer):
    """Start Kafka consumer in background thread"""
    consumer_thread = Thread(target=video_consumer.start, daemon=True)
    consumer_thread.start()
    logging.info("Kafka consumer thread started")

def cleanup_processes(active_cameras, camera_lock):
    """Clean up all camera processes on shutdown"""
    with camera_lock:
        for ip, camera_info in active_cameras.items():
            try:
                process = camera_info.get('process') if isinstance(camera_info, dict) else camera_info
                if process and process.poll() is None:
                    logging.info(f"Terminating camera process for {ip}")
                    process.terminate()
                    try:
                        process.wait(timeout=3)
                    except subprocess.TimeoutExpired:
                        process.kill()
                        process.wait()
            except Exception as e:
                logging.error(f"Error terminating process for {ip}: {e}")
        active_cameras.clear()

def cleanup_consumers(camera_consumers):
    """Clean up all Kafka consumers"""
    for ip, consumer in list(camera_consumers.items()):
        try:
            logging.info(f"Stopping consumer for camera {ip}")
            consumer.stop()
        except Exception as e:
            logging.error(f"Error stopping consumer for {ip}: {e}")
    camera_consumers.clear()
    time.sleep(1)  # Give time for consumers to fully close

def register_cleanup_handler(active_cameras, camera_lock, camera_consumers=None, video_consumer=None):
    """Register cleanup handler for atexit"""
    def cleanup_on_exit():
        """Cleanup function for atexit"""
        logging.info("Starting cleanup on exit...")
        
        # Stop all consumers first
        if camera_consumers:
            cleanup_consumers(camera_consumers)
        
        if video_consumer:
            try:
                video_consumer.stop()
            except Exception as e:
                logging.error(f"Error stopping main video consumer: {e}")
        
        # Then cleanup processes
        cleanup_processes(active_cameras, camera_lock)
        
        logging.info("Cleanup completed")
    
    atexit.register(cleanup_on_exit)
    logging.info("Cleanup handler registered")