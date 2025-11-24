from threading import Thread, Lock
import logging
import subprocess
import atexit

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

def register_cleanup_handler(active_cameras, camera_lock):
    """Register cleanup handler for atexit"""
    def cleanup_on_exit():
        """Cleanup function for atexit"""
        cleanup_processes(active_cameras, camera_lock)
    
    atexit.register(cleanup_on_exit)
    logging.info("Cleanup handler registered")