import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, User, AlertTriangle, FileText, Clock, BarChart } from 'lucide-react';

// Mock data for active candidates
const MOCK_CANDIDATES = [
  { id: 1, name: 'Emma Wilson', email: 'emma.w@example.com', status: 'active', alerts: 0, duration: '00:25:16' },
  { id: 2, name: 'James Brown', email: 'james.b@example.com', status: 'active', alerts: 2, duration: '00:31:45' },
  { id: 3, name: 'Michael Chen', email: 'michael.c@example.com', status: 'active', alerts: 1, duration: '00:18:22' },
  { id: 4, name: 'Sarah Johnson', email: 'sarah.j@example.com', status: 'completed', alerts: 0, duration: '01:00:00' },
  { id: 5, name: 'David Lee', email: 'david.l@example.com', status: 'pending', alerts: 0, duration: '00:00:00' },
];

export const AdminPage: React.FC = () => {
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  
  // Filter candidates based on search query and status filter
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Simulate receiving real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCandidates(prev => {
        return prev.map(candidate => {
          if (candidate.status === 'active') {
            // Randomly add alerts for demonstration
            const newAlerts = Math.random() < 0.1 ? candidate.alerts + 1 : candidate.alerts;
            
            // Update duration
            const [hours, minutes, seconds] = candidate.duration.split(':').map(Number);
            let newSeconds = seconds + 1;
            let newMinutes = minutes;
            let newHours = hours;
            
            if (newSeconds >= 60) {
              newSeconds = 0;
              newMinutes += 1;
            }
            
            if (newMinutes >= 60) {
              newMinutes = 0;
              newHours += 1;
            }
            
            const newDuration = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
            
            return {
              ...candidate,
              alerts: newAlerts,
              duration: newDuration
            };
          }
          return candidate;
        });
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar - Stats */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Session Overview
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Active Sessions</span>
                    <span className="text-lg font-medium text-blue-600">3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Pending Sessions</span>
                    <span className="text-lg font-medium text-gray-600">1</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-gray-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Completed Sessions</span>
                    <span className="text-lg font-medium text-green-600">1</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Alert Rate</span>
                    <span className="text-lg font-medium text-amber-600">14%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '14%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                <BarChart className="h-5 w-5 mr-2 text-purple-600" />
                Alert Statistics
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    Gaze Violations
                  </span>
                  <span className="font-medium">62%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    Multiple Faces
                  </span>
                  <span className="font-medium">18%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                    Voice Detection
                  </span>
                  <span className="font-medium">20%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content - Candidate list */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-0">Candidate Monitoring</h1>
                
                <div className="flex space-x-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search candidates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Candidate list */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alerts
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCandidates.map((candidate) => (
                      <tr 
                        key={candidate.id} 
                        className={`hover:bg-gray-50 ${selectedCandidate === candidate.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedCandidate(candidate.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-500" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                              <div className="text-sm text-gray-500">{candidate.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            candidate.status === 'active' ? 'bg-green-100 text-green-800' :
                            candidate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {candidate.alerts > 0 ? (
                            <span className="inline-flex items-center text-red-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              {candidate.alerts}
                            </span>
                          ) : (
                            <span className="text-green-600">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {candidate.duration}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            onClick={() => setSelectedCandidate(candidate.id)}
                          >
                            View
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <FileText className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Selected candidate details */}
              {selectedCandidate && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Candidate Details</h3>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-4">
                          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-medium text-gray-900">
                              {candidates.find(c => c.id === selectedCandidate)?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {candidates.find(c => c.id === selectedCandidate)?.email}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Status</span>
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {candidates.find(c => c.id === selectedCandidate)?.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Duration</span>
                            <span className="text-sm font-medium text-gray-900">
                              {candidates.find(c => c.id === selectedCandidate)?.duration}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Total Alerts</span>
                            <span className="text-sm font-medium text-gray-900">
                              {candidates.find(c => c.id === selectedCandidate)?.alerts}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <div className="bg-gray-50 p-4 rounded-lg h-full flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-gray-500">Video feed would display here in a real implementation</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Shows real-time video with AI detection overlays
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Recent Alerts</h4>
                    
                    {candidates.find(c => c.id === selectedCandidate)?.alerts === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No alerts detected for this candidate</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Mock alert data */}
                        <div className="bg-red-50 p-3 rounded-md">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-red-800">Multiple faces detected in frame</p>
                              <p className="text-xs text-red-700 mt-0.5">
                                {new Date().toLocaleTimeString()} (2 minutes ago)
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 p-3 rounded-md">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">Gaze direction away from screen</p>
                              <p className="text-xs text-yellow-700 mt-0.5">
                                {new Date().toLocaleTimeString()} (8 minutes ago)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};