import os
import chromadb
import untils
import tensorflow as tf
import matplotlib.pyplot as plt

# Define path model & DB
MODEL_PATH = "pre_train_model/"
DB_PATH = "chromadb"

try: 
    # Connect to ChromaDB saved 
    client = chromadb.PersistentClient(path=DB_PATH)
    collection = client.get_or_create_collection(name="embedding_data")
except ArithmeticError:
    print('Not found chromadb.Client`')
    exit()

# Load model 
model = tf.saved_model.load(MODEL_PATH)
infer = model.signatures['serving_default']

print(f"Các Signature có sẵn: {list(model.signatures.keys())}")
print("Model đã được tải thành công dưới dạng tf.Module.")

if __name__ == "__main__":
    # Read data
    face_path = "face.jpg"

    # Read preprocess image to normalize them into(160, 160)
    image = plt.imread(face_path)
    image = untils.preprocess_img(image=image)
    # plt.imshow(image)
    # plt.show()

    # Embedding image
    embedding = untils.image_to_embedding(image=image, model_infer=infer)

    print("Embedding from image")
    print(embedding)

    collection.add(
        embeddings=embedding,
        documents=[f'Image face from: {face_path}'],
        metadatas=[{'source': 'test face', 'class':'person','filename':'test face'}],
        ids=['face_1']
    )

    # for idx, (id_, meta) in enumerate(zip(results["ids"][0], results["metadatas"][0])):
    #     print(f"{idx+1}. ID: {id_}, Class: {meta['class']}, Filename: {meta['filename']}")

    # collections = client.list_collections()
    # print(f"Collection{collections}")