import os
import untils
import matplotlib.pyplot as plt
import tensorflow as tf
import numpy as np

# Dataset path
INIT_DATASET_PATH = "dataset/105_classes_pins_dataset/"
MODEL_PATH = "pre_train_model/"

try:
    # Load the model
    model = tf.saved_model.load(MODEL_PATH)
    infer = model.signatures['serving_default']
except AttributeError:
    print('Not found chromadb.Client`')
    exit()

collection, _ = untils.load_chroma_database(DB_PATH='chromadb')


def init_dataset():
    # Traversal entire class folder (name)
    for class_name in os.listdir(INIT_DATASET_PATH):
        class_path = os.path.join(INIT_DATASET_PATH, class_name)
        if not os.path.isdir(class_path):
            continue  # ignore if not a folder

        print(f"Load dataset class: {class_name}")
        identity = class_name[5:].replace(" ", "")
        embeddings = []

        # Traversal each image in folder have name
        for i, file in enumerate(os.listdir(class_path)):
            if not file.lower().endswith((".jpg", ".jpeg", ".png")):
                continue

            file_path = os.path.join(class_path, file)
            print(f'load files: {file[:-4]}')

            try:
                # Read image
                image = plt.imread(file_path)
                # Preprocess image to normalize them into (160,160)
                preprocessed_img = untils.preprocess_img(image)
                # Get embedding from image
                vector = untils.image_to_embedding(preprocessed_img, infer)
                embeddings.append(vector.flatten())
                print(f"Embedding successfully class.{identity}")
            except Exception:
                print(f"Exception when embedding image {file_path}")

        # Add entire embedding image to collection
        if not embeddings:
            print(f"Skip {identity}: no valid embeddings found.\n")
            continue

        print(f"\n--- Start Add {len(embeddings)} into ChromaDB... ---")
        means_embedding = np.mean(embeddings, axis=0)

        collection.add(
            ids=[identity],
            embeddings=[means_embedding.tolist()],
            metadatas=[{"identity": identity}],
            documents=[f"face identity: {identity}"]
        )

        print(f"Add means embedding image {len(embeddings)} from {identity} to collection!\n")


if __name__ == "__main__":
    init_dataset()
    print(f"Total embeddings face in data: {collection.count()}")
