#!/usr/bin/env python3
"""Evaluate face recognition method using MTCNN + FaceNet and data from Chroma.

Assumptions:
- Chroma is running locally and accessible via `chromadb.Client()`.
- The Chromadb collection contains metadata with a field pointing to the image file path
  (e.g., `file_path`, `path`, or `image_path`) or a `label` for the ground-truth label.
- The dataset folder contains one subfolder per identity; the folder name is the label.

Outputs a classification report with accuracy, precision, recall and support.
"""
import os
import argparse
from collections import defaultdict
import numpy as np
import cv2
from sklearn.metrics import classification_report, accuracy_score

# Use local utils wrapper to load models, chroma and helpers
from utils.utils import (
    load_model,
    load_chroma_database,
    preprocess_img,
    image_to_embedding,
    crop_face,
    cosine_similarity_numpy
)
from mtcnn import MTCNN


def load_image_cv(path):
    img = cv2.imread(path)
    if img is None:
        return None
    # convert BGR to RGB for consistency
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)


def build_gallery(dataset_dir, detector, infer, max_images_per_person=5):
    """Build gallery embeddings by averaging embeddings per person folder.

    Returns: dict label -> embedding (numpy array)
    """
    gallery = {}
    labels = sorted([d for d in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, d))])
    for label in labels:
        folder = os.path.join(dataset_dir, label)
        emb_list = []
        files = [f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        if not files:
            continue
        for fname in files[:max_images_per_person]:
            path = os.path.join(folder, fname)
            try:
                img = load_image_cv(path)
                if img is None:
                    continue
                faces = detector.detect_faces(img)
                if not faces:
                    continue
                # take largest/first face
                bbox = faces[0]['box']
                face_crop = crop_face(img, bbox)
                if face_crop is None:
                    continue
                pre = preprocess_img(face_crop)
                emb = image_to_embedding(pre, infer)
                if isinstance(emb, np.ndarray):
                    emb_list.append(emb.flatten())
            except Exception:
                continue
        if emb_list:
            gallery[label] = np.mean(np.stack(emb_list, axis=0), axis=0)
    return gallery


def load_chroma_collection(collection_name, db_path='chromadb'):
    collection, client = load_chroma_database(collection_name, DB_PATH=db_path)
    return collection


def get_queries_from_chroma(collection):
    # Get all items: metadatas and documents (avoid 'ids' in include — not allowed by chromadb)
    data = collection.get(include=['metadatas', 'documents'])
    ids = data.get('ids', [])
    metadatas = data.get('metadatas', [])
    documents = data.get('documents', [])
    queries = []
    for i, _id in enumerate(ids):
        meta = metadatas[i] if i < len(metadatas) else {}
        doc = documents[i] if i < len(documents) else None
        # try possible keys for path
        path = None
        for key in ('file_path', 'path', 'image_path', 'filepath'):
            if isinstance(meta, dict) and key in meta:
                path = meta[key]
                break
        label = None
        if isinstance(meta, dict):
            label = meta.get('label') or meta.get('name') or meta.get('identity')
        # fallback: if document is a path-like string
        if path is None and isinstance(doc, str) and os.path.exists(doc):
            path = doc
        queries.append({'id': _id, 'path': path, 'label': label, 'metadata': meta})
    return queries


def embed_image(path, detector, infer):
    img = load_image_cv(path)
    if img is None:
        return None
    faces = detector.detect_faces(img)
    if not faces:
        return None
    bbox = faces[0]['box']
    face_crop = crop_face(img, bbox)
    if face_crop is None:
        return None
    pre = preprocess_img(face_crop)
    emb = image_to_embedding(pre, infer)
    if isinstance(emb, np.ndarray):
        return emb.flatten()
    return None


def predict_label(query_emb, gallery_embeddings):
    if query_emb is None:
        return None, None
    best_label = None
    best_score = -1.0
    for label, emb in gallery_embeddings.items():
        score = cosine_similarity_numpy(query_emb, emb)
        if score > best_score:
            best_score = score
            best_label = label
    return best_label, best_score


def main():
    parser = argparse.ArgumentParser(description='Evaluate face recognition using MTCNN + FaceNet')
    parser.add_argument('--dataset', type=str, required=True, help='Path to dataset root (one folder per identity)')
    parser.add_argument('--collection', type=str, required=True, help='Chroma collection name')
    parser.add_argument('--device', type=str, default='cpu', help='torch device (cpu or cuda)')
    parser.add_argument('--max-images-per-person', type=int, default=5, help='Max images per person when building gallery')
    args = parser.parse_args()

    print('Loading FaceNet model (TF) and MTCNN detector via utils...')
    infer = load_model()
    detector = MTCNN()

    print('Building gallery from dataset:', args.dataset)
    gallery = build_gallery(args.dataset, detector, infer, max_images_per_person=args.max_images_per_person)
    if not gallery:
        print('No gallery embeddings generated. Check dataset path and that faces are detectable.')
        return
    print('Gallery identities:', len(gallery))

    print('Loading Chroma collection:', args.collection)
    collection = load_chroma_collection(args.collection)
    queries = get_queries_from_chroma(collection)
    print('Queries found in collection:', len(queries))

    y_true = []
    y_pred = []
    skipped = 0
    for q in queries:
        path = q.get('path')
        label = q.get('label')
        if path is None or not os.path.exists(path):
            skipped += 1
            continue
        emb = embed_image(path, detector, infer)
        if emb is None:
            skipped += 1
            continue
        pred_label, score = predict_label(emb, gallery)
        # if ground truth label missing, try infer from path by matching parent folder name
        if label is None:
            # try parent folder name
            label = os.path.basename(os.path.dirname(path))
        if label is None:
            skipped += 1
            continue
        y_true.append(label)
        y_pred.append(pred_label)

    if not y_true:
        print('No labeled queries were processed. Skipped:', skipped)
        return

    print('\nClassification report:')
    print(classification_report(y_true, y_pred, zero_division=0))
    acc = accuracy_score(y_true, y_pred)
    print('Accuracy: {:.4f}'.format(acc))
    print('Skipped items (no path/face/label):', skipped)


if __name__ == '__main__':
    main()
