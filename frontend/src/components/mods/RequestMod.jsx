import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const RequestMod = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchCategories();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/mod-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to request mods');
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      await api.post('/mod-requests', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Mod request submitted successfully!');
      setFormData({ title: '', description: '', category: '', image: null });
      setImagePreview(null);
      setShowForm(false);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  const handleVote = async (requestId) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote');
      return;
    }

    try {
      await api.post(`/mod-requests/${requestId}/vote`);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-responsive">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              🎯 Request a Mod
            </h1>
            <p className="text-gray-400 mb-2">
              Can't find what you're looking for? Request it from our community!
            </p>
            <p className="text-sm text-blue-400">
              Need a custom mod built just for you? Contact admin for personalized development.
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              + Request Mod
            </button>
            <button
              onClick={() => setShowContactModal(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <span>Custom Mod</span>
            </button>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowContactModal(false)}></div>
            
            <div className="relative glass-card rounded-2xl p-8 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                Custom Mod Development
              </h2>
              
              <p className="text-gray-300 mb-6">
                Contact our admin or mod providers for personalized mod development with custom pricing.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin Contact */}
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-3">
                      N
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Narinder Singh</h3>
                      <p className="text-sm text-gray-400">Lead Developer</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <a href="https://instagram.com/narinder" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-pink-400 hover:text-pink-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>Instagram</span>
                    </a>
                    <a href="https://t.me/narinder" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      <span>Telegram</span>
                    </a>
                  </div>
                </div>
                
                {/* Mod Providers */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4">Mod Providers</h3>
                  
                  {[
                    { name: 'Manjot Singh', initial: 'M', color: 'bg-blue-500' },
                    { name: 'Candle', initial: 'C', color: 'bg-purple-500' },
                    { name: 'Sajanpreet Aujla', initial: 'S', color: 'bg-orange-500' }
                  ].map((provider, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 ${provider.color} rounded-full flex items-center justify-center text-white text-sm font-bold mr-3`}>
                          {provider.initial}
                        </div>
                        <span className="text-white text-sm">{provider.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        <a href={`https://instagram.com/${provider.name.toLowerCase().replace(' ', '')}`} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                        <a href={`https://t.me/${provider.name.toLowerCase().replace(' ', '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Request Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowForm(false)}></div>
            
            <div className="relative glass-card rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-6">
                Request New Mod
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mod Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="input-modern"
                    placeholder="What mod do you want?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="input-modern"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFormData({ ...formData, image: file });
                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                      } else {
                        setImagePreview(null);
                      }
                    }}
                    className="input-modern"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="input-modern resize-none"
                    placeholder="Describe the mod you want in detail..."
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Requests List */}
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No requests yet
              </h3>
              <p className="text-gray-400 mb-6">
                Be the first to request a mod!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Request First Mod
              </button>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request._id} className="glass-card rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  {request.image && (
                    <img
                      src={request.image}
                      alt={request.title}
                      className="w-20 h-20 object-cover rounded-lg mr-4"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {request.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-3">
                      {request.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {request.requester?.username}</span>
                      <span>•</span>
                      <span>{request.category}</span>
                      <span>•</span>
                      <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                    {request.status === 'completed' && request.downloadLink && (
                      <div className="mt-3">
                        <a
                          href={request.downloadLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                          </svg>
                          Download Mod
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleVote(request._id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      request.votes?.some(vote => vote.user === user?.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    <span>👍</span>
                    <span>{request.voteCount || 0}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestMod;