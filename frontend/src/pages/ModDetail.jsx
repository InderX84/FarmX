import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ModDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchMod();
  }, [id]);

  const fetchMod = async () => {
    try {
      const response = await api.get(`/mods/${id}`);
      setMod(response.data);
    } catch (error) {
      console.error('Failed to fetch mod:', error);
      toast.error('Mod not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to download mods');
      return;
    }

    try {
      // If mod has direct download link, use it
      if (mod.downloadLink) {
        window.open(mod.downloadLink, '_blank');
        // Update download count
        await api.post(`/mods/${id}/download`);
        toast.success('Download started!');
        setMod(prev => ({ ...prev, downloads: prev.downloads + 1 }));
      } else {
        // Fallback to API generated link
        const response = await api.post(`/mods/${id}/download`);
        window.open(response.data.downloadUrl, '_blank');
        toast.success('Download started!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Download failed');
    }
  };

  const handleContactAdmin = () => {
    if (!isAuthenticated) {
      toast.error('Please login to contact admin');
      return;
    }
    console.log('Opening contact modal');
    setShowContactModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Loading mod details...</p>
        </div>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Mod not found
          </h3>
          <Link to="/mods" className="text-green-600 hover:text-green-700">
            Back to mods
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/mods" className="text-gray-500 hover:text-gray-700">Mods</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white">{mod.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-video">
                {mod.images?.[0] ? (
                  <img
                    src={mod.images[0]}
                    alt={mod.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-6xl text-gray-400">🚜</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {mod.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mod Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {mod.title}
              </h1>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {mod.category}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Version:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {mod.version}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Downloads:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {mod.downloads}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Creator:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {mod.creator?.username}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className={`font-bold text-lg ${
                    mod.isFree ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {mod.isFree ? 'Free' : `$${mod.price}`}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-3">
                {mod.isFree ? (
                  <button
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>📥</span>
                    <span>Download Free</span>
                  </button>
                ) : (
                  <button
                    onClick={handleContactAdmin}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>📧</span>
                    <span>Contact Admin - ${mod.price}</span>
                  </button>
                )}
              </div>
            </div>

            {/* File Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                File Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">File Size:</span>
                  <span className="text-gray-900 dark:text-white">
                    {mod.fileSize ? `${(mod.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Upload Date:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(mod.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Purchase {mod.name || mod.title}
              </h3>
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Price: <span className="font-bold text-blue-600">₹{mod.price}</span>
                </p>
                {mod.adminContact ? (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Contact the admin to purchase this mod:
                    </p>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        📧 {mod.adminContact}
                      </p>
                      {mod.instagramLink && (
                        <a href={mod.instagramLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-pink-600 hover:text-pink-700">
                          📷 Instagram
                        </a>
                      )}
                      {mod.telegramLink && (
                        <a href={mod.telegramLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-700">
                          ✈️ Telegram
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    Contact information not available. Please try again later.
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ModDetail;