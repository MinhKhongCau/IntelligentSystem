"""
Script to create sample video files for IP camera simulation
"""
import cv2
import numpy as np
import os
from datetime import datetime

def create_sample_video(filename, duration=30, fps=30):
    """Create a sample video file with moving text and timestamp"""
    
    # Video properties
    width, height = 640, 480
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    
    # Create video writer
    out = cv2.VideoWriter(filename, fourcc, fps, (width, height))
    
    total_frames = duration * fps
    
    print(f"Creating {filename} with {total_frames} frames...")
    
    for frame_num in range(total_frames):
        # Create a frame with gradient background
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Create gradient background
        for y in range(height):
            for x in range(width):
                frame[y, x] = [
                    int(255 * (x / width)),  # Red channel
                    int(255 * (y / height)), # Green channel
                    int(255 * ((x + y) / (width + height)))  # Blue channel
                ]
        
        # Add moving circle
        circle_x = int((width / 2) + 200 * np.sin(frame_num * 0.1))
        circle_y = int((height / 2) + 100 * np.cos(frame_num * 0.1))
        cv2.circle(frame, (circle_x, circle_y), 30, (255, 255, 255), -1)
        
        # Add camera info
        camera_ip = filename.replace('.mp4', '')
        cv2.putText(frame, f"Camera: {camera_ip}", (10, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Add timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cv2.putText(frame, f"Time: {timestamp}", (10, 60), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # Add frame counter
        cv2.putText(frame, f"Frame: {frame_num + 1}/{total_frames}", (10, 90), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # Add moving text
        text_x = int(50 + (width - 200) * ((frame_num % 100) / 100))
        cv2.putText(frame, "CCTV SIMULATION", (text_x, height - 50), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
        
        out.write(frame)
        
        # Progress indicator
        if frame_num % (fps * 5) == 0:  # Every 5 seconds
            print(f"Progress: {frame_num}/{total_frames} frames ({frame_num/total_frames*100:.1f}%)")
    
    out.release()
    print(f"✅ Created {filename} successfully!")

def main():
    """Create sample videos for different IP cameras"""
    
    # List of IP cameras to simulate
    ip_cameras = [
        "10.0.0.1",
        "10.0.0.2", 
        "10.0.0.3",
        "192.168.1.100",
        "192.168.1.101"
    ]
    
    print("🎥 Creating sample video files for IP camera simulation...")
    print("=" * 60)
    
    for ip in ip_cameras:
        filename = f"{ip}.mp4"
        
        # Skip if file already exists
        if os.path.exists(filename):
            print(f"⏭️  Skipping {filename} (already exists)")
            continue
        
        create_sample_video(filename, duration=60, fps=30)  # 60 seconds, 30 FPS
        print()
    
    print("=" * 60)
    print("✅ All sample videos created successfully!")
    print("\nCreated files:")
    for ip in ip_cameras:
        filename = f"{ip}.mp4"
        if os.path.exists(filename):
            size_mb = os.path.getsize(filename) / (1024 * 1024)
            print(f"  📹 {filename} ({size_mb:.1f} MB)")
    
    print("\n🚀 You can now start cameras using the API:")
    print("POST /api/camera/start")
    print('{"ip": "10.0.0.1"}')

if __name__ == "__main__":
    main()