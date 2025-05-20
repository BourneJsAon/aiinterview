import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Mic, AlertTriangle } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Advanced Interview Monitoring System
              </h1>
              <p className="mt-4 text-lg md:text-xl text-blue-100">
                Ensure academic integrity with our AI-powered interview monitoring platform. Real-time cheating detection, face recognition, and gaze tracking technology.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/login"
                  className="px-8 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 shadow-md transition duration-150"
                >
                  Get Started
                </Link>
                <Link
                  to="/candidate"
                  className="px-8 py-3 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 shadow-md transition duration-150"
                >
                  Join Interview
                </Link>
              </div>
            </div>
            <div className="hidden md:block w-1/3">
              <img 
                src="https://images.pexels.com/photos/7516363/pexels-photo-7516363.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Student taking online exam" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Advanced Monitoring Features</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform uses cutting-edge AI technology to ensure academic integrity during online exams and interviews.
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150">
            <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Gaze Tracking</h3>
            <p className="mt-2 text-gray-600">
              Advanced eye tracking technology detects when candidates look away from the screen.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150">
            <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Face Recognition</h3>
            <p className="mt-2 text-gray-600">
              Detects multiple faces and ensures the correct candidate is taking the exam.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150">
            <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center">
              <Mic className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Audio Monitoring</h3>
            <p className="mt-2 text-gray-600">
              Voice detection technology identifies background conversations and unauthorized assistance.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150">
            <div className="rounded-full bg-amber-100 w-12 h-12 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Real-time Alerts</h3>
            <p className="mt-2 text-gray-600">
              Immediate notifications for suspicious behavior with video evidence for review.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Ready to try ProctorView?</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Join thousands of educational institutions that trust our platform for secure online assessments.
            </p>
            <div className="mt-8">
              <Link
                to="/login"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 shadow-md transition duration-150"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};