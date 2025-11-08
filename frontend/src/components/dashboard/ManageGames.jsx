import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ManageGames = () => {
  const [games, setGames] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    detail: '',
    imgUrl: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await api.get('/games');
      setGames(response.data);
    } catch (error) {
      toast.error('Failed to fetch games');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingGame) {
        await api.put(`/games/${editingGame._id}`, formData);
        toast.success('Game updated successfully');
      } else {
        await api.post('/games', formData);
        toast.success('Game created successfully');
      }
      
      fetchGames();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      detail: game.detail,
      imgUrl: game.imgUrl
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      await api.delete(`/games/${id}`);
      toast.success('Game deleted successfully');
      fetchGames();
    } catch (error) {
      toast.error('Failed to delete game');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', detail: '', imgUrl: '' });
    setEditingGame(null);
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Manage Games
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add and manage supported games
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Add Game
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingGame ? 'Edit Game' : 'Add New Game'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Game Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-modern"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.detail}
                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                className="input-modern"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={formData.imgUrl}
                onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
                className="input-modern"
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingGame ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Game
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {games.map((game) => (
                <tr key={game._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={game.imgUrl}
                        alt={game.name}
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                      />
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {game.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {game.detail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(game)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(game._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageGames;