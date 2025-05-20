import React, { useState, useEffect } from 'react';
import { VideoStream } from '../components/VideoStream';
import { AlertTriangle, CheckCircle, AlertCircle, Mic } from 'lucide-react';

// Mock function for processing frames (in a real app, this would be a WebSocket connection to the backend)
const processFrame = (imageSrc: string) => {
  // Simulate random alerts for demonstration purposes
  const alertTypes = ['none', 'none', 'none', 'none', 'gaze', 'multiple_faces', 'voice'];
  const randomIndex = Math.floor(Math.random() * alertTypes.length);
  return alertTypes[randomIndex];
};

export const CandidatePage: React.FC = () => {
  const [examStatus, setExamStatus] = useState<'waiting' | 'in_progress' | 'completed'>('waiting');
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [alerts, setAlerts] = useState<{type: string, message: string, time: Date}[]>([]);
  const [currentAlert, setCurrentAlert] = useState<string | null>(null);

  // Start exam after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setExamStatus('in_progress');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (examStatus !== 'in_progress') return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setExamStatus('completed');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [examStatus]);

  // Handle frame processing
  const handleFrame = (imageSrc: string) => {
    if (examStatus !== 'in_progress') return;
    
    const alertType = processFrame(imageSrc);
    
    if (alertType !== 'none' && alertType !== currentAlert) {
      setCurrentAlert(alertType);
      
      let message = '';
      switch (alertType) {
        case 'gaze':
          message = 'Please keep your eyes on the screen';
          break;
        case 'multiple_faces':
          message = 'Multiple faces detected in frame';
          break;
        case 'voice':
          message = 'Background conversation detected';
          break;
      }
      
      if (message) {
        const newAlert = {
          type: alertType,
          message,
          time: new Date()
        };
        
        setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
        
        // Clear current alert after 5 seconds
        setTimeout(() => {
          setCurrentAlert(null);
        }, 5000);
      }
    }
  };

  // Format time remaining (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with status and timer */}
      <header className="bg-white shadow-md py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Interview Session</h1>
            <div className="ml-4">
              {examStatus === 'waiting' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  Preparing...
                </span>
              )}
              {examStatus === 'in_progress' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  In Progress
                </span>
              )}
              {examStatus === 'completed' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Completed
                </span>
              )}
            </div>
          </div>
          
          <div className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">
            {formatTime(timeRemaining)}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Video feed and current status */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Video Monitoring</h2>
              
              {/* Video stream */}
              <div className="flex justify-center">
                <VideoStream 
                  onFrame={handleFrame} 
                  width={640}
                  height={480}
                  frameRate={5}
                />
              </div>
              
              {/* Current alert */}
              {currentAlert && (
                <div className={`mt-4 p-3 rounded-md ${
                  currentAlert === 'gaze' ? 'bg-yellow-100 text-yellow-800' :
                  currentAlert === 'multiple_faces' ? 'bg-red-100 text-red-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <p className="text-sm font-medium">
                      {currentAlert === 'gaze' && 'Please keep your eyes on the screen'}
                      {currentAlert === 'multiple_faces' && 'Multiple faces detected in frame'}
                      {currentAlert === 'voice' && 'Background conversation detected'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Instructions */}
              <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-blue-800">Important Instructions</h3>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                  <li>Keep your face centered in the camera view at all times</li>
                  <li>Maintain eye contact with your screen</li>
                  <li>Ensure you are in a quiet environment with no background noise</li>
                  <li>Do not use any additional devices or reference materials</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right column - Alerts history */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Activity Log</h2>
              
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                  <p className="mt-2">No issues detected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div key={index} className="border-l-4 pl-3 py-2 text-sm border-yellow-500">
                      <div className="flex items-start">
                        {alert.type === 'gaze' && <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 mr-1.5" />}
                        {alert.type === 'multiple_faces' && <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 mr-1.5" />}
                        {alert.type === 'voice' && <Mic className="h-4 w-4 text-orange-500 mt-0.5 mr-1.5" />}
                        <div>
                          <p className="font-medium text-gray-900">{alert.message}</p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {alert.time.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};