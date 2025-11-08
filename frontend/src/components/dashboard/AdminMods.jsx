import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminMods = () => {
  const [mods, setMods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchMods();
  }, [filter]);

  const fetchMods = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/mods?status=${filter}&limit=50`);
      setMods(response.data.mods || []);
    } catch (error) {
      toast.error('Failed to fetch mods');
    } finally {
      setLoading(false);
    }
  };

  const updateModStatus = async (modId, status) => {
    try {
      await api.patch(`/mods/${modId}/status`, { status });
      toast.success(`Mod ${status} successfully`);
      fetchMods();
    } catch (error) {
      toast.error('Failed to update mod status');
    }
  };

  const deleteMod = async (modId) => {
    if (!confirm('Are you sure you want to delete this mod?')) return;
    
    try {
      await api.delete(`/mods/${modId}`);
      toast.success('Mod deleted successfully');
      fetchMods();
    } catch (error) {
      toast.error('Failed to delete mod');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Manage Mods
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and approve community mods
          </p>
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-modern"
        >
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading mods...</p>
        </div>
      ) : mods.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400">No {filter} mods found</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mod
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mods.map((mod) => (
                  <tr key={mod._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={mod.imgUrl || mod.images?.[0]}
                          alt={mod.title}
                          className="h-12 w-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {mod.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {mod.category} • v{mod.version}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-300">
                        {mod.creator?.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mod.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        mod.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {mod.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {mod.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateModStatus(mod._id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateModStatus(mod._id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteMod(mod._id)}
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
      )}
    </div>
  );
};

export default AdminMods;