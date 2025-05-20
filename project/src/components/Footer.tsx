import React from 'react';
import { Shield, Mail, Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const location = useLocation();
  
  // Hide footer on candidate page
  if (location.pathname === '/candidate') {
    return null;
  }

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-lg font-bold">ProctorView</span>
            </div>
            <p className="mt-2 text-sm text-gray-300">
              Ensuring academic integrity through advanced monitoring technology.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:gap-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">Terms of Service</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <a href="mailto:support@proctorview.com" className="text-gray-300 hover:text-white">
                    support@proctorview.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <a href="tel:+1-555-123-4567" className="text-gray-300 hover:text-white">
                    +1-555-123-4567
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-center text-sm text-gray-300">
            &copy; {new Date().getFullYear()} ProctorView. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};