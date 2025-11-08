import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const MyMods = () => {
  const [mods, setMods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyMods();
  }, []);

  const fetchMyMods = async () => {
    try {
      const response = await api.get('/users/my-mods');
      setMods(response.data);
    } catch (error) {
      console.error('Failed to fetch mods:', error);
      toast.error('Failed to load your mods');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (modId) => {
    if (!window.confirm('Are you sure you want to delete this mod?')) return;
    
    try {
      await api.delete(`/mods/${modId}`);
      toast.success('Mod deleted successfully');
      fetchMyMods();
    } catch (error) {
      toast.error('Failed to delete mod');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600 dark:text-gray-400">Loading your mods...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Mods
        </h1>
        <Link
          to="/dashboard/create-mod"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Create New Mod
        </Link>
      </div>

      {mods.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No mods yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start by creating your first mod to share with the community.
          </p>
          <Link
            to="/dashboard/create-mod"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Create Your First Mod
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mod
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {mods.map((mod) => (
                  <tr key={mod._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {mod.imgUrl || mod.images?.[0] ? (
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={mod.imgUrl || mod.images[0]}
                              alt={mod.name || mod.title}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-gray-400">🚜</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {mod.name || mod.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            v{mod.version}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {mod.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span>{mod.rating?.average?.toFixed(1) || '0.0'}</span>
                        <span className="text-gray-500 ml-1">({mod.rating?.count || 0})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(mod.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {mod.downloads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {mod.isFree ? 'Free' : `$${mod.price}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/mods/${mod._id}`}
                        className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        to={`/dashboard/edit-mod/${mod._id}`}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(mod._id)}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
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
      )}
    </div>
  );
};

export default MyMods;