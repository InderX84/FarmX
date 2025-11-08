import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/mod-requests');
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, status, link = null) => {
    try {
      const data = { status };
      if (status === 'completed' && link) {
        data.downloadLink = link;
      }
      
      await api.put(`/mod-requests/${requestId}/status`, data);
      toast.success(`Request ${status} successfully`);
      fetchRequests();
      setSelectedRequest(null);
      setDownloadLink('');
    } catch (error) {
      toast.error('Failed to update request status');
    }
  };

  const handleComplete = (request) => {
    setSelectedRequest(request);
  };

  const confirmComplete = () => {
    if (selectedRequest) {
      updateRequestStatus(selectedRequest._id, 'completed', downloadLink);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Manage Mod Requests
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and manage community mod requests
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading requests...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div key={request._id} className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {request.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.replace('-', ' ')}
                    </span>
                    <span className="flex items-center text-sm text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                      </svg>
                      {request.voteCount || 0}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-3">{request.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By {request.requester?.username}</span>
                    <span>•</span>
                    <span>{request.category}</span>
                    <span>•</span>
                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>

                  {request.downloadLink && (
                    <div className="mt-3">
                      <a
                        href={request.downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 text-sm"
                      >
                        Download Link: {request.downloadLink}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateRequestStatus(request._id, 'in-progress')}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                      >
                        Start Progress
                      </button>
                      <button
                        onClick={() => handleComplete(request)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => updateRequestStatus(request._id, 'rejected')}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {request.status === 'in-progress' && (
                    <>
                      <button
                        onClick={() => handleComplete(request)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => updateRequestStatus(request._id, 'rejected')}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSelectedRequest(null)}></div>
          
          <div className="relative glass-card rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Complete Request: {selectedRequest.title}
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Download Link (Required)
              </label>
              <input
                type="url"
                value={downloadLink}
                onChange={(e) => setDownloadLink(e.target.value)}
                placeholder="https://example.com/mod-download"
                className="input-modern"
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmComplete}
                disabled={!downloadLink}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                Complete Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;