import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ManageMods = () => {
  const [mods, setMods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMods();
  }, []);

  const fetchAllMods = async () => {
    try {
      const response = await api.get('/mods?status=all');
      setMods(response.data.mods || []);
    } catch (error) {
      console.error('Failed to fetch mods:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (modId, status) => {
    try {
      await api.patch(`/mods/${modId}/status`, { status });
      toast.success(`Mod ${status} successfully`);
      fetchAllMods();
    } catch (error) {
      toast.error('Failed to update mod status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Mods</h1>
      
      <div className="space-y-4">
        {mods.map((mod) => (
          <div key={mod._id} className="glass-card p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{mod.name || mod.title}</h3>
              <p className="text-sm text-gray-400">by {mod.creator?.username}</p>
              <span className={`px-2 py-1 text-xs rounded ${
                mod.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                mod.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {mod.status}
              </span>
            </div>
            
            <div className="space-x-2">
              <button
                onClick={() => updateStatus(mod._id, 'approved')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(mod._id, 'rejected')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMods;