from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from tensorflow import keras 
import logging
import base64
import json
import time
import random
import threading
import uuid

###gpt import
import cv2
import numpy as np
from services.deepface_service import analyze_emotion
from services.gaze_service import get_gaze_direction
from services.yolo_service import detect_faces

# Initialize Flask app
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for demo
sessions = {}
candidates = {}

# Mock detection functions (in a real app, these would use the specified libraries)
def detect_face_count(image_data):
    """Mock function to detect number of faces in an image"""
    # In a real implementation, this would use YOLOv8 or DeepFace
    # Return random result for demo purposes
    return random.randint(1, 2)

def detect_gaze(image_data):
    """Mock function to detect if gaze is on screen"""
    # In a real implementation, this would use GazeTracking
    # Return random result for demo purposes
    return random.random() > 0.85  # 15% chance of looking away

def detect_voice(audio_data=None):
    """Mock function to detect background voice"""
    # In a real implementation, this would use Whisper
    # Return random result for demo purposes
    return random.random() > 0.9  # 10% chance of background voice

def process_frame(session_id, image_data):
    """Process video frame for cheating detection"""
    try:
        # Skip header of base64 data
        if session_id not in sessions:
            logger.warning(f"Session {session_id} not found")
            return
        
        # Perform detections
        face_count = detect_face_count(image_data)
        gaze_off_screen = detect_gaze(image_data)
        voice_detected = detect_voice()
        
        # Prepare results
        alerts = []
        if face_count > 1:
            alerts.append({"type": "multiple_faces", "message": "Multiple faces detected"})
        
        if gaze_off_screen:
            alerts.append({"type": "gaze", "message": "Gaze not on screen"})
            
        if voice_detected:
            alerts.append({"type": "voice", "message": "Background voice detected"})
        
        # Update session data
        if alerts:
            sessions[session_id]["alerts"] += alerts
            sessions[session_id]["alert_count"] += len(alerts)
            
            # Send alerts to client
            socketio.emit('detection_alert', {
                'session_id': session_id,
                'alerts': alerts,
                'timestamp': time.time()
            }, room=session_id)
            
        return alerts
    
    except Exception as e:
        logger.error(f"Error processing frame: {str(e)}")
        return []

## gpt nwe wisper code
@app.route("/analyze", methods=["POST"])
def analyze_frame():
    if "frame" not in request.files:
        return jsonify({"error": "No frame uploaded"}), 400

    file = request.files["frame"]
    npimg = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    emotion = analyze_emotion(frame)
    gaze = get_gaze_direction(frame)
    faces = detect_faces(frame)

    return jsonify({
        "emotion": emotion,
        "gaze": gaze,
        "face_count": faces
    })

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio uploaded"}), 400

    file = request.files["audio"]
    path = f"/tmp/audio.wav"
    file.save(path)

    from services.whisper_service import transcribe_audio
    text = transcribe_audio(path)
    return jsonify({"transcript": text})

##gpt analyse 


@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Flask is working!"})



@app.route('/api/health', methods=['GET'])
def health_check():
    """API endpoint for health check"""
    return jsonify({"status": "ok"})

@app.route('/api/session/create', methods=['POST'])
def create_session():
    """API endpoint to create a new monitoring session"""
    try:
        data = request.json
        candidate_name = data.get('name')
        candidate_email = data.get('email')
        
        if not candidate_name or not candidate_email:
            return jsonify({"error": "Name and email are required"}), 400
        
        # Create new session
        session_id = str(uuid.uuid4())
        sessions[session_id] = {
            "id": session_id,
            "candidate_name": candidate_name,
            "candidate_email": candidate_email,
            "start_time": time.time(),
            "status": "active",
            "alerts": [],
            "alert_count": 0
        }
        
        # Add to candidates lookup
        candidates[candidate_email] = session_id
        
        logger.info(f"Created session {session_id} for {candidate_name}")
        
        return jsonify({
            "session_id": session_id,
            "status": "created"
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating session: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/session/<session_id>', methods=['GET'])
def get_session(session_id):
    """API endpoint to get session information"""
    if session_id not in sessions:
        return jsonify({"error": "Session not found"}), 404
    
    return jsonify(sessions[session_id])

@app.route('/api/sessions', methods=['GET'])
def get_all_sessions():
    """API endpoint to get all active sessions"""
    active_sessions = {id: session for id, session in sessions.items() 
                      if session["status"] != "completed"}
    
    return jsonify(list(active_sessions.values()))

@app.route('/api/session/<session_id>/end', methods=['POST'])
def end_session(session_id):
    """API endpoint to end a monitoring session"""
    if session_id not in sessions:
        return jsonify({"error": "Session not found"}), 404
    
    sessions[session_id]["status"] = "completed"
    sessions[session_id]["end_time"] = time.time()
    
    return jsonify({"status": "completed"})

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logger.info(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info(f"Client disconnected: {request.sid}")

@socketio.on('join_session')
def handle_join_session(data):
    """Handle client joining a specific session room"""
    session_id = data.get('session_id')
    if not session_id or session_id not in sessions:
        emit('error', {'message': 'Invalid session ID'})
        return
    
    # Join room for this session
    socketio.server.enter_room(request.sid, session_id)
    logger.info(f"Client {request.sid} joined session {session_id}")
    
    emit('session_joined', {'session_id': session_id})

@socketio.on('frame')
def handle_frame(data):
    """Handle incoming video frame"""
    session_id = data.get('session_id')
    image_data = data.get('image')
    
    if not session_id or not image_data or session_id not in sessions:
        emit('error', {'message': 'Invalid data'})
        return
    
    # Process frame in a separate thread to avoid blocking
    threading.Thread(target=process_frame, args=(session_id, image_data)).start()

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)