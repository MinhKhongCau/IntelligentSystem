# This is a script to initialize the deployment database for face recognition.
# It loads from data_json, processes them to extract face embeddings,
# First, it loads necessary libraries and utility functions for face detection,
# Second, requests image from data_json.content.facePictureUrl and get it by cv2,
# Then, it detects face by MTCNN, crops, preprocesses, extracts embeddings,
# Them it builds a gallery of embeddings for each person in the dataset,
# and finally, it stores the embeddings in a ChromaDB collection.
# when each item in data_json store in ChomaDB collection add with threshold field which caculate new field embedding with each old embedding by adaptiveThreshold(oldEmbedding, newEmbedding, oldThreshold).
# image preprocessing, and embedding extraction. Then, it iterates through the
# and stores the averaged embeddings in a ChromaDB collection.


import os
from utils.utils import crop_face, preprocess_img, image_to_embedding, cosine_similarity_numpy, load_model, load_chroma_database, load_chroma_database, adaptiveThreshold 
from mtcnn import MTCNN
import tensorflow as tf
import requests
import cv2
import numpy as np

API_BASE_URL = 'http://localhost:8080/'

data_json = {
	"content": [
		{
			"id": 2,
			"name": "Ngo Quang Minh",
			"birthday": "2004-05-09",
			"gender": "false",
			"identityCardNumber": "123456789",
			"height": "60",
			"weight": "60",
			"identifyingCharacteristic": "Tall",
			"lastKnownOutfit": "Black T-shirt",
			"medicalConditions": "Normal",
			"facePictureUrl": "/uploads/573097595_122195731076445586_47710161077783135.jpg",
			"missingTime": "0202-02-01T05:05:00",
			"reportDate": "2025-10-29T21:34:17.54",
			"reporterRelationship": "Brother",
			"missingArea": {
				"id": 2,
				"commune": "",
				"district": "Tan Binh",
				"province": "Ho Chi Minh City",
				"country": "Viet Nam",
				"latitude": 10.769302,
				"longitude": 106.658267
			},
			"reporterId": 5,
			"caseStatus": "Missing"
		},
		{
			"id": 3,
			"name": "Cristiano Reynoldo",
			"birthday": "1985-05-05",
			"gender": "false",
			"identityCardNumber": "112345678902",
			"height": "185",
			"weight": "85",
			"identifyingCharacteristic": "MU costume",
			"lastKnownOutfit": "Black suit",
			"medicalConditions": "Normal",
			"facePictureUrl": "/uploads/missing_88cbf845-5965-4a05-9f34-4cbfab7d52b1.jpg",
			"missingTime": "2025-05-05T05:05:00",
			"reportDate": "2025-11-29T14:17:44.377",
			"reporterRelationship": "Fancy",
			"missingArea": {
				"id": 3,
				"commune": "Phường Tân Sơn Hòa",
				"district": "Sobreira Formosa e Alvito da Beira",
				"province": "Phòng công chứng số 4 Thành phố Hồ Chí Minh",
				"country": "Portugal",
				"latitude": 39.823742,
				"longitude": -7.800953
			},
			"reporterId": 5,
			"caseStatus": "Missing"
		},
		{
			"id": 1003,
			"name": "Donald J. Trummond",
			"birthday": "1946-06-14",
			"gender": "false",
			"identityCardNumber": "235436455598",
			"height": "186",
			"weight": "90",
			"identifyingCharacteristic": "Distinct blonde hairstyle",
			"lastKnownOutfit": "Dark suit, red tie",
			"medicalConditions": "None ",
			"facePictureUrl": "/uploads/missing_ae463fae-8f97-4eda-87f7-67ea05be11fb.jpg",
			"missingTime": "2025-07-14T08:08:00",
			"reportDate": "2025-11-30T08:34:33.503",
			"reporterRelationship": "Assistant",
			"missingArea": {
				"id": 1003,
				"commune": "Исаковка",
				"district": "Одинцовский городской округ",
				"province": "Moscow Oblast",
				"country": "Russia",
				"latitude": 56.372917,
				"longitude": 41.902143
			},
			"reporterId": 1,
			"caseStatus": "Missing"
		},
		{
			"id": 1004,
			"name": "Elen Muskard",
			"birthday": "1971-06-28",
			"gender": "false",
			"identityCardNumber": "879654123089",
			"height": "188",
			"weight": "84",
			"identifyingCharacteristic": "Sharp jawline, deep-set eyes",
			"lastKnownOutfit": "Black t-shirt, jeans",
			"medicalConditions": "Insomnia history",
			"facePictureUrl": "/uploads/missing_7c005f37-6268-4c38-aa27-feb466fa704f.jpg",
			"missingTime": "2025-07-10T09:25:00",
			"reportDate": "2025-11-30T08:38:16.98",
			"reporterRelationship": "Business partner",
			"missingArea": {
				"id": 1004,
				"commune": "Torriana",
				"district": "Rimini",
				"province": "Emilia-Romagna",
				"country": "Italy",
				"latitude": 43.980021,
				"longitude": 12.367541
			},
			"reporterId": 1,
			"caseStatus": "Rejected"
		},
		{
			"id": 1005,
			"name": "Barack O'Mara",
			"birthday": "1961-08-04",
			"gender": "false",
			"identityCardNumber": "657849123567",
			"height": "185",
			"weight": "79",
			"identifyingCharacteristic": "Calm voice, mole on cheek",
			"lastKnownOutfit": "Blue shirt, khaki pants",
			"medicalConditions": "None",
			"facePictureUrl": "/uploads/missing_4c63aa0f-fbb2-49c0-b2ba-41330a1066df.jpg",
			"missingTime": "2025-07-11T16:40:00",
			"reportDate": "2025-11-30T08:40:27.31",
			"reporterRelationship": "Friend",
			"missingArea": {
				"id": 1005,
				"commune": "Cát Tường Suburb",
				"district": "Ba Dinh Ward",
				"province": "Bắc Ninh Province",
				"country": "Vietnam",
				"latitude": 21.031247,
				"longitude": 105.841843
			},
			"reporterId": 1,
			"caseStatus": "Missing"
		},
		{
			"id": 3003,
			"name": "Kylian Mbappo",
			"birthday": "1998-12-20",
			"gender": "false",
			"identityCardNumber": "998877662345",
			"height": "178",
			"weight": "73",
			"identifyingCharacteristic": "Short athletic haircut, small scar above right eyebrow.",
			"lastKnownOutfit": "Black sports jacket, white T-shirt, gray jogger pants.",
			"medicalConditions": " None known.",
			"facePictureUrl": "/uploads/missing_ee57291e-d768-4901-bf41-06c84dd472f7.jpg",
			"missingTime": "2025-07-14T06:06:00",
			"reportDate": "2025-11-30T14:04:41.883",
			"reporterRelationship": "Friend",
			"missingArea": {
				"id": 3003,
				"commune": "",
				"district": "Essonne",
				"province": "Ile-de-France",
				"country": "France",
				"latitude": 48.407141,
				"longitude": 2.312675
			},
			"reporterId": 5,
			"caseStatus": "Missing"
		},
		{
			"id": 3006,
			"name": "Leonel Messa",
			"birthday": "1987-06-24",
			"gender": "true",
			"identityCardNumber": "934567821345",
			"height": "180",
			"weight": "72",
			"identifyingCharacteristic": " Short beards",
			"lastKnownOutfit": "Sports jersey, shorts",
			"medicalConditions": "Mild ankle injury history",
			"facePictureUrl": "/uploads/missing_4fa2ebed-0405-40f4-be3d-0b9bdc6c4907.jpg",
			"missingTime": "2025-07-13T22:20:00",
			"reportDate": "2025-11-30T14:29:52.523",
			"reporterRelationship": "Coach",
			"missingArea": {
				"id": 3009,
				"commune": "",
				"district": "Berguedà",
				"province": "Catalonia",
				"country": "Spain",
				"latitude": 42.042274,
				"longitude": 1.740104
			},
			"reporterId": 5,
			"caseStatus": "Missing"
		}
	]
}
print(data_json)

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

def init_dataset():
    if INFER is None or COLLECTION is None or DETECTOR is None:
        print("Tài nguyên chính chưa được tải.")
        return

    for person in data_json['content']:
        try:
            # --- Bước 1: Trích xuất Embedding ---
            img_url = API_BASE_URL.rstrip('/') + person['facePictureUrl']
            response = requests.get(img_url)
            img_array = np.frombuffer(response.content, np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

            faces = DETECTOR.detect_faces(img)
            if not faces:
                print(f"Không phát detect khuôn mặt ID {person['id']}.")
                continue

            bbox = faces[0]['box']
            face_crop = crop_face(img, bbox)
            preprocessed_face = preprocess_img(face_crop)
            
            # Đảm bảo embedding là mảng 1D
            embedding = image_to_embedding(preprocessed_face, INFER)[0]
            if isinstance(embedding, np.ndarray) and embedding.ndim > 1:
                embedding = embedding.flatten()

            # --- Bước 2: Lấy dữ liệu cũ để tính Adaptive Threshold ---
            existing_items = COLLECTION.get(include=['embeddings', 'metadatas'])
            existing_ids = existing_items.get('ids', [])
            existing_embs = existing_items.get('embeddings', [])
            existing_metas = existing_items.get('metadatas', [])

            old_list = []
            for i in range(len(existing_embs)):
                old_list.append({
                    'oldEmbedding': existing_embs[i],
                    'oldThreshold': existing_metas[i].get('threshold', 0.5)
                })

            # --- Bước 3: Tính toán Threshold ---
            if len(old_list) > 0:
                # updated_vals là list các float mới cho các record cũ
                updated_vals, new_threshold = adaptiveThreshold(old_list, embedding)
                
                # Cập nhật metadata cho các ID cũ
                for i in range(len(existing_metas)):
                    existing_metas[i]['threshold'] = float(updated_vals[i])
                
                # Update lại database cho các người dùng cũ
                COLLECTION.update(
                    ids=existing_ids,
                    metadatas=existing_metas
                )
            else:
                new_threshold = 0.5

            # --- Bước 4: Lưu người dùng mới ---
            metadata = {
                'id': person['id'],
                'name': person['name'],
                'threshold': float(new_threshold),
                'file_path': img_url
            }
            identity = f"{person['id']}_{person['name']}".replace(" ", "")

            COLLECTION.add(
                ids=[identity],
                embeddings=[embedding.tolist()],
                metadatas=[metadata],
                documents=[img_url]
            )
            print(f"✅ Đã xử lý ID {person['id']}: Threshold {new_threshold:.4f}")

        except Exception as e:
            print(f"❌ Lỗi khi xử lý ID {person['id']}: {e}")

if __name__ == "__main__":
    init_dataset()
    print("Khởi tạo database hoàn tất.")
    print(f"Total embeddings face in data: {COLLECTION.count()}")
    print("Bạn có thể sử dụng DisplayDataChroma.py để hiển thị dữ liệu trong ChromaDB.")
