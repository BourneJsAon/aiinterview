import { io, Socket } from 'socket.io-client';

export class SocketService {
  private socket: Socket | null = null;
  private sessionId: string | null = null;
  private onAlertCallback: ((alerts: any[]) => void) | null = null;

  constructor(private baseUrl: string = 'http://localhost:5000') {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.baseUrl, {
          transports: ['websocket'],
          autoConnect: true
        });

        this.socket.on('connect', () => {
          console.log('Socket connected');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error);
        });

        this.socket.on('detection_alert', (data) => {
          console.log('Received alert:', data);
          if (this.onAlertCallback) {
            this.onAlertCallback(data.alerts);
          }
        });

        this.socket.on('error', (error) => {
          console.error('Socket error:', error);
        });
      } catch (error) {
        console.error('Failed to connect socket:', error);
        reject(error);
      }
    });
  }

  joinSession(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.sessionId = sessionId;

      this.socket.emit('join_session', { session_id: sessionId });

      this.socket.once('session_joined', () => {
        console.log('Joined session:', sessionId);
        resolve();
      });

      this.socket.once('error', (error) => {
        console.error('Error joining session:', error);
        reject(error);
      });
    });
  }

  sendFrame(imageData: string): void {
    if (!this.socket || !this.sessionId) {
      console.error('Cannot send frame: Socket not connected or no session joined');
      return;
    }

    this.socket.emit('frame', {
      session_id: this.sessionId,
      image: imageData
    });
  }

  onAlert(callback: (alerts: any[]) => void): void {
    this.onAlertCallback = callback;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.sessionId = null;
      this.onAlertCallback = null;
    }
  }
}

// Create and export default instance
const socketService = new SocketService();
export default socketService;