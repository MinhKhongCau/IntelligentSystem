import os
import chromadb
from load_pre_train_model import image_to_embedding   # hàm convert ảnh -> vector

# Đường dẫn dataset gốc
INIT_DATASET_PATH = "dataset/105_classes_pins_dataset/"

# Kết nối ChromaDB
client = chromadb.Client()
collection = client.create_collection(name="image_embeddings")

def init_dataset():
    ids = []
    embeddings = []
    metadatas = []

    # Duyệt qua từng class folder
    for class_name in os.listdir(INIT_DATASET_PATH):
        class_path = os.path.join(INIT_DATASET_PATH, class_name)

        if not os.path.isdir(class_path):
            continue  # bỏ qua nếu không phải thư mục

        # Duyệt từng ảnh trong thư mục
        for i, file in enumerate(os.listdir(class_path)):
            if not (file.endswith(".jpg") or file.endswith(".png") or file.endswith(".jpeg")):
                continue

            file_path = os.path.join(class_path, file)

            try:
                # Lấy embedding từ ảnh
                vector = image_to_embedding(file_path)

                # Thêm vào list
                ids.append(f"{class_name}_{i}")
                embeddings.append(vector.tolist())
                metadatas.append({
                    "class": class_name,
                    "filename": file
                })

            except Exception as e:
                print(f"⚠️ Lỗi khi xử lý {file_path}: {e}")

    # Thêm toàn bộ vào collection
    collection.add(
        ids=ids,
        embeddings=embeddings,
        metadatas=metadatas
    )

    print(f"✅ Đã thêm {len(ids)} ảnh từ {INIT_DATASET_PATH} vào collection!")

if __name__ == "__main__":
    init_dataset()
    # load the model
    
