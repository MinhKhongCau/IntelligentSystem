import numpy as np
import os
import matplotlib.pyplot as plt
import untils  
import tensorflow as tf

MODEL_PATH = "pre_train_model/"
INIT_DATASET_PATH = "dataset/105_classes_pins_dataset/"
IMAGE_ADRIANA_LIMA = os.path.join(INIT_DATASET_PATH, "pins_Adriana Lima")

image_paths = untils.get_image_paths(IMAGE_ADRIANA_LIMA)

training_images = []
# Slice 10 images for training
for idx in range(0, 11):
    # Read image
    image = plt.imread(image_paths[idx])

    # Preprocess image to normalize them into (160,160)
    preprocessed_img = untils.preprocess_img(image)
    
    # Append preprocessed image
    training_images.append(preprocessed_img)

# Load the model
model = tf.saved_model.load(MODEL_PATH)

# Get the callable function from the loaded model
infer = model.signatures['serving_default'] 

# Store embeddings
embeddings = np.empty(shape=(len(training_images[:10]), 128))

# Generate embeddings
for index, training_img in enumerate(training_images[:10]):
    # Generate embeddings
    embedding = untils.image_to_embedding(training_img, infer)
    
    # Store embeddings
    embeddings[index] = embedding

# Read a test sample
test_img = plt.imread(os.path.join(IMAGE_ADRIANA_LIMA, "Adriana Lima0_0.jpg"))

# Preprocess image to normalize them into (160,160)
preprocessed_test_img = untils.preprocess_img(test_img)

# Compute average embedding
avg_embedding = np.mean(embeddings, axis=0)

# Extract face embedding
test_img_embedding = untils.image_to_embedding(preprocessed_test_img, infer)

# Calculate distance between
dist = untils.cal_embeddings_dist(avg_embedding, test_img_embedding)
print(f"Similarity Distance: {dist}")

# Plot Test Image
untils.plt_img(preprocessed_test_img)

