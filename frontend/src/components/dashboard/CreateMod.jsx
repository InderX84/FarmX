import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Tractors', 'Implements', 'Vehicles', 'Maps', 'Tools', 'Textures', 'Other'];

const CreateMod = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    category: '',
    gameName: '',
    tags: '',
    version: '',
    price: '',
    isFree: true,
    imgUrl: '',
    downloadLink: '',
    adminContact: '',
    instagramLink: '',
    telegramLink: ''
  });
  const [categories, setCategories] = useState([]);
  const [games, setGames] = useState([]);
  const [files, setFiles] = useState({
    images: [],
    modFile: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchGames();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await api.get('/games');
      setGames(response.data);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (name === 'images') {
      setFiles(prev => ({ ...prev, images: Array.from(selectedFiles) }));
    } else if (name === 'modFile') {
      setFiles(prev => ({ ...prev, modFile: selectedFiles[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!files.modFile && !formData.downloadLink) {
      toast.error('Please provide either a download link or upload a mod file');
      return;
    }

    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      files.images.forEach(image => {
        submitData.append('images', image);
      });
      
      if (files.modFile) {
        submitData.append('modFile', files.modFile);
      }
      
      if (formData.downloadLink) {
        submitData.append('downloadLink', formData.downloadLink);
      }

      await api.post('/mods', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Mod created successfully!');
      navigate('/dashboard/my-mods');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create mod');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Mod
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your mod to share with the community
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Mod Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-modern"
              placeholder="Enter mod name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Display Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input-modern"
              placeholder="Enter display title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="input-modern resize-none"
              placeholder="Describe what makes your mod special..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
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
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Game Name *
              </label>
              <select
                name="gameName"
                value={formData.gameName}
                onChange={handleChange}
                required
                className="input-modern"
              >
                <option value="">Select Game</option>
                {games.map(game => (
                  <option key={game._id} value={game.name}>{game.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Version *
            </label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleChange}
              required
              className="input-modern"
              placeholder="e.g., 1.0.0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input-modern"
              placeholder="farming, realistic, equipment"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFree"
                checked={formData.isFree}
                onChange={handleChange}
                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                This is a free mod
              </label>
            </div>

            {!formData.isFree && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required={!formData.isFree}
                    className="input-modern"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Admin Contact (Email/Phone) *
                  </label>
                  <input
                    type="text"
                    name="adminContact"
                    value={formData.adminContact}
                    onChange={handleChange}
                    required={!formData.isFree}
                    className="input-modern"
                    placeholder="admin@example.com or +91-9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Instagram Link
                  </label>
                  <input
                    type="url"
                    name="instagramLink"
                    value={formData.instagramLink}
                    onChange={handleChange}
                    className="input-modern"
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Telegram Link
                  </label>
                  <input
                    type="url"
                    name="telegramLink"
                    value={formData.telegramLink}
                    onChange={handleChange}
                    className="input-modern"
                    placeholder="https://t.me/username"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Image URL *
            </label>
            <input
              type="url"
              name="imgUrl"
              value={formData.imgUrl}
              onChange={handleChange}
              required
              className="input-modern"
              placeholder="https://example.com/image.jpg"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Provide a direct link to mod image
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Additional Images (Optional)
            </label>
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="input-modern file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload additional screenshots (optional)
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Download Link (Optional)
              </label>
              <input
                type="url"
                name="downloadLink"
                value={formData.downloadLink}
                onChange={handleChange}
                className="input-modern"
                placeholder="https://example.com/mod-download-link"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Provide a direct download link (e.g., Google Drive, Dropbox)
              </p>
            </div>

            <div className="text-center text-gray-500 dark:text-gray-400">
              <span className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium">
                OR
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Upload Mod File (.zip, .rar, .7z)
              </label>
              <input
                type="file"
                name="modFile"
                onChange={handleFileChange}
                accept=".zip,.rar,.7z"
                className="input-modern file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Upload your mod file (max 100MB) - Required if no download link provided
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/dashboard/my-mods')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="spinner"></div>
                  <span>Creating...</span>
                </span>
              ) : (
                'Create Mod'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMod;