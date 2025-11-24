#!/usr/bin/env python3
"""
Script to search for a specific person in video files
"""

import untils
import sys
import os
import json
from datetime import datetime

def save_results_to_json(results, output_file):
    """Save detection results to JSON file"""
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    print(f"✅ Results saved to: {output_file}")

def main():
    if len(sys.argv) < 3:
        print("Usage: python search_person_in_video.py <video_path> <person_id> [threshold]")
        print("\nExamples:")
        print("  python search_person_in_video.py video/10.0.0.1.mp4 JohnDoe")
        print("  python search_person_in_video.py video/10.0.0.1.mp4 JohnDoe 0.5")
        print("  python search_person_in_video.py video/ JohnDoe 0.6  # Process all videos in directory")
        sys.exit(1)
    
    video_path = sys.argv[1]
    person_id = sys.argv[2]
    threshold = float(sys.argv[3]) if len(sys.argv) > 3 else 0.6
    
    print("🔍 Face Recognition Search")
    print("=" * 60)
    print(f"Target Person: {person_id}")
    print(f"Threshold: {threshold}")
    print(f"Source: {video_path}")
    print("=" * 60)
    
    # Check if path is directory or file
    if os.path.isdir(video_path):
        # Process all videos in directory
        output_dir = f"results/{person_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        os.makedirs(output_dir, exist_ok=True)
        
        results = untils.batch_process_videos_for_person(
            video_dir=video_path,
            target_person_id=person_id,
            threshold=threshold,
            output_dir=output_dir
        )
        
        # Save results
        results_file = os.path.join(output_dir, 'detection_results.json')
        save_results_to_json(results, results_file)
        
    elif os.path.isfile(video_path):
        # Process single video
        output_dir = f"results/{person_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        os.makedirs(output_dir, exist_ok=True)
        
        output_video = os.path.join(output_dir, f"annotated_{os.path.basename(video_path)}")
        
        detections = untils.process_video_file_for_face_recognition(
            video_path=video_path,
            target_person_id=person_id,
            threshold=threshold,
            output_path=output_video
        )
        
        if detections:
            print(f"\n✅ Found {len(detections)} occurrences of {person_id}")
            print("\nDetection Timeline:")
            for det in detections:
                print(f"  [{det['timestamp']:.2f}s] Frame {det['frame']} - Confidence: {(1-det['distance'])*100:.1f}%")
            
            # Save results
            results_file = os.path.join(output_dir, 'detection_results.json')
            save_results_to_json({'video': video_path, 'detections': detections}, results_file)
        else:
            print(f"\n❌ No occurrences of {person_id} found in video")
    else:
        print(f"❌ Error: {video_path} is not a valid file or directory")
        sys.exit(1)

if __name__ == '__main__':
    main()
