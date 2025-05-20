import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

interface VideoStreamProps {
  onFrame?: (imageSrc: string) => void;
  width?: number;
  height?: number;
  frameRate?: number;
}

export const VideoStream: React.FC<VideoStreamProps> = ({
  onFrame,
  width = 640,
  height = 480,
  frameRate = 10,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for camera permissions
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setHasPermission(true))
      .catch((err) => {
        setHasPermission(false);
        setError(`Camera permission denied: ${err.message}`);
      });
  }, []);

  useEffect(() => {
    if (!hasPermission || !onFrame) return;

    let frameInterval: number;
    
    // Capture frames at the specified rate
    if (webcamRef.current) {
      frameInterval = window.setInterval(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc && onFrame) {
          onFrame(imageSrc);
        }
      }, 1000 / frameRate);
    }

    return () => {
      if (frameInterval) {
        clearInterval(frameInterval);
      }
    };
  }, [hasPermission, onFrame, frameRate]);

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4 h-[480px]">
        <div className="text-red-500 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Camera Access Required</h3>
        <p className="mt-1 text-sm text-gray-500">{error || "Please allow camera access to continue."}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width,
          height,
          facingMode: "user"
        }}
        className="rounded-lg"
        style={{ width, height }}
      />
      {hasPermission === null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="text-white">Requesting camera access...</div>
        </div>
      )}
    </div>
  );
};