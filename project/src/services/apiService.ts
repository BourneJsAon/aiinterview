const API_BASE_URL = 'http://localhost:5000/api';

export interface SessionData {
  id: string;
  candidate_name: string;
  candidate_email: string;
  start_time: number;
  status: string;
  alerts: any[];
  alert_count: number;
  end_time?: number;
}

export interface CreateSessionRequest {
  name: string;
  email: string;
}

export class ApiService {
  async createSession(data: CreateSessionRequest): Promise<{ session_id: string; status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/session/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async getSession(sessionId: string): Promise<SessionData> {
    try {
      const response = await fetch(`${API_BASE_URL}/session/${sessionId}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  }

  async getAllSessions(): Promise<SessionData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting all sessions:', error);
      // Return empty array in case of error for better UX
      return [];
    }
  }

  async endSession(sessionId: string): Promise<{ status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/session/${sessionId}/end`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }
}

// Create and export default instance
const apiService = new ApiService();
export default apiService;