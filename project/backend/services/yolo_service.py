from ultralytics import YOLO

model = YOLO("yolov8n.pt")  # or yolov8m/l/x.pt for more accuracy

def detect_faces(frame):
    results = model(frame)
    face_count = len(results[0].boxes)
    return face_count
