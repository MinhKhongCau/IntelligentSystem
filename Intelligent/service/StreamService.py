from threading import Thread, Lock
import logging
import subprocess

def start_consumer_thread(video_consumer):
    """Start Kafka consumer in background thread"""
    consumer_thread = Thread(target=video_consumer.start, daemon=True)
    consumer_thread.start()
    logging.info("Kafka consumer thread started")

def cleanup_processes(active_cameras, camera_lock):
    """Clean up all camera processes on shutdown"""
    with camera_lock:
        for ip, process in active_cameras.items():
            try:
                if process.poll() is None:
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