"""
Backward compatibility wrapper for untils.py
This file imports all functions from the new modular structure.

Modules:
- face_utils.py: Face detection, model loading, and face recognition
- kafka_stream_utils.py: Kafka streaming and video processing
"""

# Import all face detection and recognition functions
from utils.face_utils import (
    get_image_paths,
    save_face_embeddings,
    plt_img,
    preprocess_img,
    image_to_embedding,
    cal_embeddings_dist,
    plot_image_grid,
    plt_embeddings,
    load_model,
    load_chroma_database,
    crop_face,
    search_face,
    predict_identity_from_image,
    add_person_to_chromadb,
    add_person_to_chroma,
    cosine_similarity_numpy
)

# Import all Kafka streaming and video processing functions
from utils.kafka_stream_utils import (
    process_video_stream,
    process_video_file_for_face_recognition,
    search_person_in_video_stream,
    batch_process_videos_for_person,
    search_person_by_image_in_video,
    search_all_faces_in_video
)

from utils.cosin_implimentation import (
    search_by_cosine
)

# Make all functions available when importing from untils
__all__ = [
    # Face utils
    'get_image_paths',
    'save_face_embeddings',
    'plt_img',
    'preprocess_img',
    'image_to_embedding',
    'cal_embeddings_dist',
    'plot_image_grid',
    'plt_embeddings',
    'load_model',
    'load_chroma_database',
    'crop_face',
    'search_face',
    'predict_identity_from_image',
    'add_person_to_chromadb',
    'add_person_to_chroma',
    # Kafka stream utils
    'process_video_stream',
    'process_video_file_for_face_recognition',
    'search_person_in_video_stream',
    'batch_process_videos_for_person',
    'search_person_by_image_in_video',
    'search_all_faces_in_video'
]
