import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import csv
import cv2
import os
import chromadb
from mtcnn import MTCNN
from stages.FaceData import FaceData
from stages.IdentityResult import IdentityResult


def get_image_paths(directory, valid_extensions=(".jpg", ".jpeg", ".png", ".bmp", ".gif")):
    """Get all image paths from a directory"""
    image_paths = []

    # Iterate over all files in the directory
    for root, dirs, files in os.walk(directory):
        for file in files:
            # Check if file is an image based on its extension
            if file.lower().endswith(valid_extensions):
                # Append the full path of the image file to the list
                image_paths.append(os.path.join(root, file))

    return image_paths


def save_face_embeddings(embedding):
    """Save face embeddings to CSV file"""
    # Ensure the embedding is a numpy array
    embedding = np.array(embedding)

    # Save to CSV
    with open('avg_face_embeddings.csv', mode="w", newline='') as file:
        writer = csv.writer(file)
        writer.writerow(embedding)


def plt_img(image, cmap="gray"):
    """Display an image using matplotlib"""
    plt.imshow(image, cmap)
    plt.axis('on')
    plt.show()


def preprocess_img(image):
    """
    Preprocess Image:
    
    Args:
        image: np.ndarray
    
    Returns:
        4D(batch_size, height, width, channels)
    """
    # Dimensions
    IMG_W = 160
    IMG_H = 160
    
    # Resize the image
    image = cv2.resize(image, dsize = (IMG_W, IMG_H))
    
    # Convert image stype or normalize
    image = image.astype(np.float32)/255.0
    
    return image


def image_to_embedding(image: np.ndarray, model_infer):
    """Generate face embedding from an image."""
    
    # Increase image dim
    image_input = image[np.newaxis,...] # (1, 160, 160, 3)
    
    # Perform inference using the callable function
    result = model_infer(tf.convert_to_tensor(image_input, dtype=tf.float32))
    
    # Extract result from output key (1,128)
    embedding = result['Bottleneck_BatchNorm'].numpy()
    
    # Normalize bedding using L2 norm.
    embedding /= np.linalg.norm(embedding, ord=2)
    
    return embedding


def cal_embeddings_dist(embedding_1: np.ndarray, embedding_2: np.ndarray) -> float:
    """
    Compares two embeddings and returns L2 norm of the distance vector.

    Args:
    - embedding_1: A 128-dimensional embedding vector.
    - embedding_2: A 128-dimensional embedding vector.

    Returns:
    - L2 norm of the distance vector
    """

    # Calculate the distance between the embeddings
    embedding_distance = embedding_1 - embedding_2

    # Calculate the L2 norm of the distance vector
    embedding_distance_norm = np.linalg.norm(embedding_distance)
    
    return embedding_distance_norm


def plot_image_grid(images, images_per_row=5, total_images=50):
    """Plot a grid of images"""
    # Ensure we don't exceed the available images or the limit of 50
    total_images = min(total_images, len(images))
    
    # Calculate the number of rows needed
    num_rows = (total_images + images_per_row - 1) // images_per_row

    # Create a figure with a grid of subplots
    fig, axs = plt.subplots(num_rows, images_per_row, figsize=(15, 3 * num_rows))

    # Flatten the axes array in case of more than one row
    axs = axs.ravel()

    for i in range(total_images):
        # Read and display the image
        img = images[i]
        axs[i].imshow(img)
        axs[i].axis('off')  # Turn off the axis for clean presentation

    # Turn off any remaining unused subplots (if total_images < images_per_row * num_rows)
    for j in range(total_images, len(axs)):
        axs[j].axis('off')

    # Show the grid of images
    plt.tight_layout()
    plt.show()
    

def plt_embeddings(embedding):
    """Plot embeddings as a bar chart"""
    # Normalized embedding
    embedding_normalized = (embedding - np.min(embedding)) / (np.max(embedding) - np.min(embedding))
    
    # Plt barcode
    plt.figure(figsize=(12, 2))
    plt.bar(range(len(embedding_normalized)), embedding_normalized)
    plt.show()


def load_model():
    """Load the FaceNet model"""
    # Define path model & DB
    MODEL_PATH = "pre_train_model/"

    # Load model 
    model = tf.saved_model.load(MODEL_PATH)
    infer = model.signatures['serving_default']

    print(f"Signature available: {list(model.signatures.keys())}")
    print("Model load successfully as tf.Module.")
    return infer


def load_chroma_database(collection_name="image_embeddings", DB_PATH='chromadb'):
    """Load ChromaDB database"""
    try: 
        # Connect to ChromaDB saved 
        client = chromadb.PersistentClient(path=DB_PATH)
        collection = client.get_or_create_collection(name=collection_name, metadata={"hnsw:space": "cosine"})
    except ArithmeticError:
        print('Not found chromadb.Client`')
        exit()
    return collection, client


def crop_face(image, bbox):
    """Crop face from image using bounding box"""
    if image is not None and bbox is not None:
        x, y, w, h = bbox
        return image[y:y+h, x:x+w]


def search_face(face, infer, top_k=5, collection=None):
    """Search for similar faces in ChromaDB collection"""
    if (collection == None ):
        print("Import collection before predict...")
        return None
    # Load image test
    preprocessed_img = preprocess_img(face)

    # Extract embedding
    vector = image_to_embedding(preprocessed_img, infer)
    if isinstance(vector, np.ndarray):
        embedding_to_query = vector.flatten().tolist()
    else:
        embedding_to_query = vector

    query_vector = [embedding_to_query] 

    # Query in collection
    results = collection.query(
        query_embeddings=query_vector,
        n_results=top_k,
        include=['metadatas', 'distances', 'documents']
    )

    return results


def predict_identity_from_image(
        collection=None, 
        infer=None, 
        detector=None, 
        image=None, 
        top_k=1):
    """
    Predict identity from image by detecting faces and searching in database
    """
    # Load resources if not provided
    if collection is None:
        print("Loading collection...")
        collection, _ = load_chroma_database(DB_PATH='chromadb_centroid')
    
    if infer is None:
        print("Loading embedding model...")
        infer = load_model()
    
    if detector is None:
        print("Loading mtcnn detectface...")
        detector = MTCNN()
    
    # Store all of result prediction faces
    all_predictions = [] 
    try:
        print('-'*20)
        print('- Load model and database')
        
        if image is not None:
            faces = detector.detect_faces(img=image)
            print(f'- Detect {len(faces)} face in image')
            for face in faces:
                bbox = face['box']
                (x, y, w, h) = bbox
                face_croped = crop_face(image=image, bbox=bbox)

                results = search_face(face_croped, infer, top_k=top_k, collection=collection)
                print(f'- Searching {results} face in database')

                if (
                    results is not None and 
                    results['ids'] and 
                    results['distances']
                ):
                    try:
                        # Get result Top-1
                        top_k_ids = results['ids'][0]
                        top_k_distance = results['distances'][0][0]
                        top_k_metadatas = results['metadatas'][0]
                        top_k_documents = results['documents'][0]
                        
                        # Get top_k_person_names
                        top_k_person_names = [metadata.get('identity', 'UNKNOWN') for metadata in top_k_metadatas]

                        # Encapsulation data
                        face_data = FaceData(x=x, y=y, width=w, height=h, distance=top_k_distance)

                        prediction = IdentityResult(
                            face_data=face_data,
                            ids=top_k_ids,
                            person_name=top_k_person_names,
                            document=top_k_documents
                        )
                        
                        # Add predict identity face to dictionary
                        all_predictions.append(prediction.to_dict())
                    except IndexError as e:
                        print(f"ERROR: Result searching face is not available. ERROR: {e}")
            return all_predictions
    except Exception as e:
        print(f'Error when predict face of image: {e}')
        return None


def add_person_to_chromadb(collection=None, ids=None, face_image=None, identity_name='', filename='', infer=None, detector=None):
    """Add person to ChromaDB (legacy function)"""
    # Load resources if not provided
    if infer is None:
        infer = load_model()
    
    if collection is None:
        collection, _ = load_chroma_database()
    
    if detector is None:
        detector = MTCNN()
    
    # Validate resources
    if not infer:
        return {'error': 'No model infer for embedding face'}

    if not collection:
        return {'error': 'No database embedding face'}
    
    if not detector:
        return {'error': 'No detector to crop face'}

    if face_image is not None and identity_name != '' and filename is not None:
        metadatas = {
            "identity": identity_name,
            "filename": filename,
        }
        documents= {f'Face indentity: {identity_name}'}
        embedding = image_to_embedding(face_image, model_infer=infer)

        collection.add(
            ids=ids,
            embeddings=embedding,
            metadatas=metadatas,
            documents=documents
        )


def add_person_to_chroma(person_id, face_image, metadata=None, infer=None, collection=None, detector=None):
    """
    Add a person's face embedding to ChromaDB
    """
    try:
        # Load resources if not provided
        if infer is None:
            infer = load_model()
        
        if collection is None:
            collection, _ = load_chroma_database()
        
        if detector is None:
            detector = MTCNN()
        
        # Validate resources
        if not infer:
            return {'error': 'No model infer for embedding face'}

        if not collection:
            return {'error': 'No database embedding face'}
        
        if not detector:
            return {'error': 'No detector to crop face'}
        
        # Detect face in image
        faces = detector.detect_faces(face_image)
        if not faces:
            return {'error': 'No face detected in the provided image'}
        
        # Get the first face (largest face)
        bbox = faces[0]['box']
        face_cropped = crop_face(face_image, bbox)
        
        # Preprocess and generate embedding
        preprocessed_face = preprocess_img(face_cropped)
        embedding = image_to_embedding(preprocessed_face, infer)
        
        # Prepare metadata
        if metadata is None:
            metadata = {}
        
        # Ensure person_id is in metadata as 'identity'
        metadata['identity'] = metadata.get('name', str(person_id))
        metadata['person_id'] = str(person_id)
        
        # Prepare document
        document = f"Face identity: {metadata.get('name', person_id)}"
        
        # Convert embedding to list if it's numpy array
        if isinstance(embedding, np.ndarray):
            embedding_list = embedding.flatten().tolist()
        else:
            embedding_list = embedding
        
        # Add to ChromaDB
        collection.add(
            ids=[str(person_id)],
            embeddings=[embedding_list],
            metadatas=[metadata],
            documents=[document]
        )
        
        print(f"Successfully added person {person_id} to ChromaDB")
        print(f"Name: {metadata.get('name', 'N/A')}")
        print(f"Embedding dimension: {len(embedding_list)}")
        
        return {
            'success': True,
            'person_id': person_id,
            'embedding_dimension': len(embedding_list),
            'metadata': metadata
        }
        
    except Exception as e:
        error_msg = f"Error adding person to ChromaDB: {str(e)}"
        print(error_msg)
        return {'error': error_msg}


def cosine_similarity_numpy(v1, v2):
    # Verifying vector not 0 if both of vector is zero vector
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
        
    return np.dot(v1, v2) / (norm_v1 * norm_v2)
