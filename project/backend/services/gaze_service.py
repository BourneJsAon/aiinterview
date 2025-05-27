from gaze_tracking import GazeTracking
import cv2

gaze = GazeTracking()

def get_gaze_direction(frame):
    gaze.refresh(frame)
    if gaze.is_center():
        return "Looking center"
    elif gaze.is_left():
        return "Looking left"
    elif gaze.is_right():
        return "Looking right"
    return "Undetected"
