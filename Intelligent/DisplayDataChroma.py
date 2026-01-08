# This file is use to Display Data in ChromaDB with adaptive thresholding
# Load necessary libraries and modules
# Load all data from ChromaDB collection
# Process each entry to display with its adaptive threshold
# print out the data in a readable format
import os
from utils.utils import crop_face, preprocess_img, image_to_embedding, cosine_similarity_numpy, load_model, load_chroma_database, load_chroma_database, adaptiveThreshold 
from mtcnn import MTCNN
import tensorflow as tf
import requests
import cv2
import numpy as np

API_BASE_URL = 'http://localhost:8080/'

# Load model, database and detector (global resources)
try:
    INFER = load_model()
    COLLECTION, CHROMA_CLIENT = load_chroma_database(DB_PATH='chromadb_deploy')
    DETECTOR = MTCNN()
    print("Tải mô hình và database thành công.")
except Exception as e:
    print(f"Lỗi khi tải tài nguyên chính: {e}")
    INFER = None
    COLLECTION = None
    DETECTOR = None

load_items = COLLECTION.get(include=['embeddings', 'metadatas', 'documents'])
embeddings = load_items.get('embeddings', [])
metadatas = load_items.get('metadatas', [])
documents = load_items.get('documents', []) 
print(f"Tổng số mục trong collection: {len(embeddings)}")
print("Dữ liệu trong ChromaDB với ngưỡng thích ứng:")
for i in range(len(embeddings)):
    metadata = metadatas[i]
    document = documents[i]
    embedding = np.array(embeddings[i])
    threshold = metadata.get('threshold', 0.5)
    print(f"ID: {metadata.get('id')}, Name: {metadata.get('name')}, Threshold: {threshold}, Document: {document}")
