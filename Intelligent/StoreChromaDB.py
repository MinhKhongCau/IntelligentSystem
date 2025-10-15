import os
import chromadb
import untils
import matplotlib.pyplot as plt
import tensorflow as tf
# Dataset path
INIT_DATASET_PATH = "dataset/105_classes_pins_dataset/"
MODEL_PATH = "pre_train_model/"
DATABASE_CHROMADB = "chromadb"

try:
    # Load the model
    model = tf.saved_model.load(MODEL_PATH)

    # Get the callable function from the loaded model
    infer = model.signatures['serving_default']
except AttributeError:
    print('Not found chromadb.Client`')
    exit()

_, collection = untils.load_chroma_database()

def init_dataset():

    # Traversal entire class folder (name)
    for class_name in os.listdir(INIT_DATASET_PATH):
        ids = []
        embeddings = []
        metadatas = []
        documents = []
        class_path = os.path.join(INIT_DATASET_PATH, class_name)

        print(f"Load dataset class: {class_name}")
        identity = class_name[5:]
        if not os.path.isdir(class_path):
            continue  # ignore if not a folder

        # Traversal each image in folder have name
        for i, file in enumerate(os.listdir(class_path)):
            if not (file.endswith(".jpg") or file.endswith(".png") or file.endswith(".jpeg")):
                continue

            file_path = os.path.join(class_path, file)
            print(f'load files: {file[:-4]}')
            
            # Read image
            image = plt.imread(file_path)

            # Preprocess image to normalize them into (160,160)
            preprocessed_img = untils.preprocess_img(image)


            try:
                # Get embedding from image
                vector = untils.image_to_embedding(preprocessed_img, infer)

                # Add to list
                ids.append(f"{identity}_{i}")
                embeddings.append(vector.flatten().tolist())
                metadatas.append({
                    "identity": identity,
                    "filename": file,
                })
                documents.append(f'Face indentity: {identity}')

                print(f"Embedding successfully class.{class_name[5:]}")
            except Exception as e:
                print(f"Exception when embedding image {file_path}: ")

        # Add entire embedding image to collection
        print(f"\n--- Start Add {len(ids)} into ChromaDB... ---")
        collection.add(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=documents
        )

        print(f"Add embedding image {len(ids)} from {class_name} to collection!")

if __name__ == "__main__":
    init_dataset()
    print(f"Total embeddings face in data: {collection.count()}")
