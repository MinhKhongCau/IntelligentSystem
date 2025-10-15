import tensorflow as tf
import untils
import matplotlib.pyplot as plt
import sys
import os
from mtcnn import MTCNN
import numpy as np

infer = untils.load_model()
detector = MTCNN()

# Read data
if len(sys.argv) < 2:
    print("Using file name as: python3 test_searching.py <file name>")
    sys.exit(1)
# Get second arguments
input_name = sys.argv[1]
if not input_name.lower().endswith(('.jpg', '.jpeg', '.png')):
    face_path = input_name + ".jpg" 
else:
    face_path = input_name

if not os.path.exists(face_path):
    print(f"Image not found: {face_path}")
    sys.exit(1)

# Read & preprocess image to normalize them into(160, 160)
image = plt.imread(face_path)

result = untils.predict_identity_from_image(image=image)

# faces = detector.detect_faces(image=image)

# box = faces[0]['box']
# x,y,w,h = box
# crop_face = image[y:y+h, x:x+w]
# face = untils.preprocess_img(image=crop_face)

# # Embedding image
# embedding = untils.image_to_embedding(image=face, model_infer=infer).flatten().tolist()
# if isinstance(embedding, np.ndarray):
#     embedding_to_query = embedding.flatten().tolist()
# else:
#     embedding_to_query = embedding

# query_vector = [embedding_to_query] 

# print("Embedding from image")

# collection, _ = untils.load_chroma_database()
# results = collection.query( 
#     query_embeddings=query_vector,
#     n_results=1,
#     include=['metadatas', 'distances', 'documents'],
# )

# collection, _ = untils.load_chroma_database()
# results = untils.search_face(crop_face, infer, 5, collection=collection)

# print("\n--- RESULTS FROM CHROMADB ---")

# # Print result

# if results and results.get("ids") and results["ids"][0]:
#     for idx, (id_, distance, meta, doc) in enumerate(zip(
#         results["ids"][0], 
#         results["distances"][0], 
#         results["metadatas"][0], 
#         results["documents"][0]
#     )):
#         print(f"Result #{idx+1}:")
#         # Distance 0 or approximately 0 proof that found itself
#         print(f"ID: {id_} | Distance: {distance:.6f}") 
#         print(f"Document: {doc}")
#         print(f"Metadata: {meta}")
# else:
#     print("Not found.")

# # Print result

for rel in result:
    face = rel['face']
    ids = rel['ids']
    document = rel['document']
    person_name = rel['person_name']
    # Distance 0 or approximately 0 proof that found itself
    print(f"ID: {ids}") 
    print(f"Document: {document}")
    print(f"Name: {person_name}")
    print(f"Face: {face}")
