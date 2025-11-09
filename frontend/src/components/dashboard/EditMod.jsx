import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const EditMod = () => {
  const { id } = useParams();
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
    contactEmail: '',
    adminContact: '',
    instagramLink: '',
    telegramLink: ''
  });
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchMod();
    fetchGames();
  }, [id]);

  const fetchMod = async () => {
    try {
      const response = await api.get(`/mods/${id}`);
      const mod = response.data;
      setFormData({
        name: mod.name || '',
        title: mod.title || '',
        description: mod.description || '',
        category: mod.category || '',
        gameName: mod.gameName || '',
        tags: mod.tags?.join(', ') || '',
        version: mod.version || '',
        price: mod.price || '',
        isFree: mod.isFree,
        imgUrl: mod.imgUrl || mod.images?.[0] || '',
        downloadLink: mod.downloadLink || '',
        contactEmail: mod.contactEmail || '',
        adminContact: mod.adminContact || '',
        instagramLink: mod.instagramLink || '',
        telegramLink: mod.telegramLink || ''
      });
    } catch (error) {
      toast.error('Failed to load mod');
      navigate('/dashboard/my-mods');
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/mods/${id}`, formData);
      toast.success('Mod updated successfully!');
      navigate('/dashboard/my-mods');
    } catch (error) {
      toast.error('Failed to update mod');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Mod</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 glass-card p-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-modern"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-modern"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input-modern"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-modern"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Game Name</label>
          <select
            name="gameName"
            value={formData.gameName}
            onChange={handleChange}
            className="input-modern"
            required
          >
            <option value="">Select Game</option>
            {games.map(game => (
              <option key={game._id} value={game.name}>{game.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Version</label>
          <input
            type="text"
            name="version"
            value={formData.version}
            onChange={handleChange}
            className="input-modern"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input-modern"
            placeholder="comma, separated, tags"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isFree"
              checked={formData.isFree}
              onChange={handleChange}
              className="mr-2"
            />
            Free mod
          </label>
        </div>

        {!formData.isFree && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Price (INR)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input-modern"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email *</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="input-modern"
                placeholder="your@email.com"
                required={!formData.isFree}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Purchase requests will be sent to this email
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Admin Contact (Optional)</label>
              <input
                type="text"
                name="adminContact"
                value={formData.adminContact}
                onChange={handleChange}
                className="input-modern"
                placeholder="Additional contact info"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram Link</label>
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
              <label className="block text-sm font-medium mb-2">Telegram Link</label>
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

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            name="imgUrl"
            value={formData.imgUrl}
            onChange={handleChange}
            className="input-modern"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Download Link</label>
          <input
            type="url"
            name="downloadLink"
            value={formData.downloadLink}
            onChange={handleChange}
            className="input-modern"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/my-mods')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Update Mod
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMod;