class FaceData:
    def __init__(self, x, y, width, height, distance):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.distance = distance

    def to_dict(self):
        """Chuyển đổi dữ liệu khuôn mặt thành dictionary."""
        return {
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
            "distance": self.distance
        }