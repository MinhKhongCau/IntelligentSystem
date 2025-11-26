"""
    Feature for searching with similarity search people
    Input: 2 image face.
    Output: Distance of embedding face.
    How it work:
        Load embedding vector of 2 face
        Use feature and compare embedding with utils.cal_embeddings_dist function
        Compare distance of 2 face
"""

import sys
import os
import cv2
import matplotlib.pyplot as plt
import numpy as np
from mtcnn import MTCNN

# Add parent directory to path for importing utils
from utils import utils


def compare_two_faces(image_path_1, image_path_2, threshold=0.6):
    """
    Compare two face images and calculate similarity
    
    Args:
        image_path_1: Path to first image
        image_path_2: Path to second image
        threshold: Distance threshold for matching (default: 0.6)
    
    Returns:
        Dictionary with comparison results
    """
    # Load model and detector
    print("Loading model and detector...")
    infer = utils.load_model()
    detector = MTCNN()
    
    # Read images
    print(f"\nReading images...")
    image1 = cv2.imread(image_path_1)
    image2 = cv2.imread(image_path_2)
    
    if image1 is None:
        return {'error': f'Cannot read image: {image_path_1}'}
    if image2 is None:
        return {'error': f'Cannot read image: {image_path_2}'}
    
    # Convert BGR to RGB for display
    image1_rgb = cv2.cvtColor(image1, cv2.COLOR_BGR2RGB)
    image2_rgb = cv2.cvtColor(image2, cv2.COLOR_BGR2RGB)
    
    # Detect faces
    print("Detecting faces...")
    faces1 = detector.detect_faces(image1)
    faces2 = detector.detect_faces(image2)
    
    if not faces1:
        return {'error': f'No face detected in image 1: {image_path_1}'}
    if not faces2:
        return {'error': f'No face detected in image 2: {image_path_2}'}
    
    # Get first face from each image
    bbox1 = faces1[0]['box']
    bbox2 = faces2[0]['box']
    
    # Crop faces
    face1 = utils.crop_face(image1, bbox1)
    face2 = utils.crop_face(image2, bbox2)
    
    # Preprocess faces
    print("Preprocessing faces...")
    face1_preprocessed = utils.preprocess_img(face1)
    face2_preprocessed = utils.preprocess_img(face2)
    
    # Generate embeddings
    print("Generating embeddings...")
    embedding1 = utils.image_to_embedding(face1_preprocessed, infer)
    embedding2 = utils.image_to_embedding(face2_preprocessed, infer)
    
    # Calculate distance
    print("Calculating distance...")
    distance = utils.cosine_similarity_numpy(embedding1[0], embedding2[0])
    
    # Calculate similarity percentage
    similarity = distance * 100
    
    # Determine if match
    is_match = (1-distance) < threshold
    
    result = {
        'image1': image_path_1,
        'image2': image_path_2,
        'distance': float(1-distance),
        'similarity': float(similarity),
        'threshold': threshold,
        'is_match': is_match,
        'embedding1_shape': embedding1.shape,
        'embedding2_shape': embedding2.shape,
        'bbox1': bbox1,
        'bbox2': bbox2
    }
    
    return result


def visualize_comparison(image_path_1, image_path_2, result):
    """
    Visualize the comparison results
    
    Args:
        image_path_1: Path to first image
        image_path_2: Path to second image
        result: Comparison result dictionary
    """
    # Read images
    image1 = cv2.imread(image_path_1)
    image2 = cv2.imread(image_path_2)
    
    # Convert BGR to RGB
    image1_rgb = cv2.cvtColor(image1, cv2.COLOR_BGR2RGB)
    image2_rgb = cv2.cvtColor(image2, cv2.COLOR_BGR2RGB)
    
    # Draw bounding boxes
    bbox1 = result['bbox1']
    bbox2 = result['bbox2']
    
    x1, y1, w1, h1 = bbox1
    x2, y2, w2, h2 = bbox2
    
    color = (0, 255, 0) if result['is_match'] else (255, 0, 0)
    
    cv2.rectangle(image1_rgb, (x1, y1), (x1+w1, y1+h1), color, 2)
    cv2.rectangle(image2_rgb, (x2, y2), (x2+w2, y2+h2), color, 2)
    
    # Create figure
    fig, axes = plt.subplots(1, 2, figsize=(12, 6))
    
    # Display images
    axes[0].imshow(image1_rgb)
    axes[0].set_title(f"Image 1\n{os.path.basename(image_path_1)}")
    axes[0].axis('off')
    
    axes[1].imshow(image2_rgb)
    axes[1].set_title(f"Image 2\n{os.path.basename(image_path_2)}")
    axes[1].axis('off')
    
    # Add result text
    match_text = "✓ MATCH" if result['is_match'] else "✗ NO MATCH"
    match_color = 'green' if result['is_match'] else 'red'
    
    fig.suptitle(
        f"{match_text}\n"
        f"Distance: {result['distance']:.4f} | "
        f"Similarity: {result['similarity']:.2f}% | "
        f"Threshold: {result['threshold']:.2f}",
        fontsize=14,
        fontweight='bold',
        color=match_color
    )
    
    plt.tight_layout()
    plt.show()


def main():
    """Main function"""
    # Check arguments
    if len(sys.argv) < 3:
        print("Usage: python test_cosin_similarity.py <image1_path> <image2_path> [threshold]")
        print("\nExample:")
        print("  python test_cosin_similarity.py face1.jpg face2.jpg")
        print("  python test_cosin_similarity.py face1.jpg face2.jpg 0.5")
        sys.exit(1)
    
    image_path_1 = sys.argv[1]
    image_path_2 = sys.argv[2]
    threshold = float(sys.argv[3]) if len(sys.argv) > 3 else 0.6
    
    # Check if files exist
    if not os.path.exists(image_path_1):
        print(f"Error: Image not found: {image_path_1}")
        sys.exit(1)
    
    if not os.path.exists(image_path_2):
        print(f"Error: Image not found: {image_path_2}")
        sys.exit(1)
    
    print("="*60)
    print("Face Similarity Comparison Test")
    print("="*60)
    
    # Compare faces
    result = compare_two_faces(image_path_1, image_path_2, threshold)
    
    # Check for errors
    if 'error' in result:
        print(f"\n❌ Error: {result['error']}")
        sys.exit(1)
    
    # Print results
    print("\n" + "="*60)
    print("RESULTS")
    print("="*60)
    print(f"Image 1: {result['image1']}")
    print(f"Image 2: {result['image2']}")
    print(f"\nEmbedding 1 shape: {result['embedding1_shape']}")
    print(f"Embedding 2 shape: {result['embedding2_shape']}")
    print(f"\nDistance (L2 norm): {result['distance']:.4f}")
    print(f"Similarity: {result['similarity']:.2f}%")
    print(f"Threshold: {result['threshold']:.2f}")
    print(f"\nMatch: {'✓ YES' if result['is_match'] else '✗ NO'}")
    
    if result['is_match']:
        print(f"\n✓ The two faces are SIMILAR (distance < {threshold})")
    else:
        print(f"\n✗ The two faces are DIFFERENT (distance >= {threshold})")
    
    print("="*60)
    
    # Visualize
    print("\nDisplaying comparison visualization...")
    visualize_comparison(image_path_1, image_path_2, result)


if __name__ == '__main__':
    main()