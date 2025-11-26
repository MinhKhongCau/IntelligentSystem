import cv2

class DetectedFaces:
    def __init__(self, image, verified_faces, total_faces):
        self.image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        self.verified_faces = verified_faces
        self.total_faces = total_faces  
