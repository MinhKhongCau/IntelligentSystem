import tensorflow as tf
import untils
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import sys
import os

# --- Init data ---

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

# Read image
image = plt.imread(face_path)

# --- Predict ---

# Calling predict funtion
collection, _ = untils.load_chroma_database(DB_PATH='chromadb')
infer = untils.load_model()
result = untils.predict_identity_from_image(collection=collection, infer=infer, image=image)
print(result)
# --- Evaluating result and draw retacgle ---

# 1. Init and Axes 
# fig: object entry graphic window, ax: object for coodinate axis
fig, ax = plt.subplots(1)
# Show origin image
ax.imshow(image)

# Check result for draw
if result is None or not result:
    print("No faces detected or prediction failed.")
    plt.show()
    sys.exit(0)

print(f"--- Found {len(result)} faces ---")

# Loop entry faces
for rel in result:
    # 2. Access data Dictionary Result data
    print("-" * 20)
    print(f'Searching result: {rel}')
    
    # Get coodinate bounding box [x, y, w, h]
    face = rel.get('face')
    ids = rel.get('ids', 'N/A')
    person_name = rel.get('person_name', 'Unknown')

    if face is None:
        print("Bounding box data is missing or incomplete. Skipping this face.")
        continue

    distance = face['distance']

    # 3. Print result using console
    print(f"ID: {ids}")
    print(f"Face: {face}")
    print(f"Name: {person_name}")
    # print(f"Distance (Cosine): {distance}") 
    print(f"BBox: (x:{face['x']}, y:{face['y']}, w:{face['width']}, h:{face['height']})")

    # 4. Create and draw retacgle
    # Make retacgle (x, y is left/ right coner of BBox)
    rect = patches.Rectangle((face['x'], face['y']), face['width'], face['height'], 
                             linewidth=2, 
                             edgecolor='r',       # Red
                             facecolor='none',    # None fill color inside
                             alpha=1)
    
    # Put retacgle into Axes
    ax.add_patch(rect)

    # 5. Put text
    ax.text(face['x'], face['y'] - 10, 
            f"{person_name} (D:{distance:.2f})", 
            color='red', 
            fontsize=12, 
            weight='bold',
            bbox=dict(facecolor='white', alpha=0.7, edgecolor='none', pad=2))

# 6. Show image
plt.title(f"Face Recognition Result for {os.path.basename(face_path)}")
plt.axis('off') # hide axis
plt.show()