class IdentityResult:
    """Chứa kết quả dự đoán định danh cho một khuôn mặt."""
    def __init__(self, face_data, ids, person_name, document):
        self.face = face_data
        self.ids = ids
        self.person_name = person_name
        self.document = document

    def to_dict(self):
        """Chuyển đổi kết quả dự đoán thành dictionary theo format mong muốn."""
        return {
            "face": self.face.to_dict(),
            "ids": self.ids[0], 
            "person_name": self.person_name[0], 
            "document": self.document[0]
        }