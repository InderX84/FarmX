import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const DashboardHome = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/users/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatsCards = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: 'blue' },
        { name: 'Total Mods', value: stats.totalMods || 0, icon: '📦', color: 'green' },
        { name: 'Pending Mods', value: stats.pendingMods || 0, icon: '⏳', color: 'yellow' },
        { name: 'Total Requests', value: stats.totalRequests || 0, icon: '📧', color: 'purple' },
      ];
    } else if (user?.role === 'creator') {
      return [
        { name: 'My Mods', value: stats.myMods || 0, icon: '📦', color: 'green' },
        { name: 'Approved Mods', value: stats.approvedMods || 0, icon: '✅', color: 'blue' },
        { name: 'Pending Mods', value: stats.pendingMods || 0, icon: '⏳', color: 'yellow' },
        { name: 'Total Downloads', value: stats.totalDownloads || 0, icon: '⬇️', color: 'purple' },
      ];
    } else {
      return [
        { name: 'My Requests', value: stats.myRequests || 0, icon: '📧', color: 'blue' },
        { name: 'Pending Requests', value: stats.pendingRequests || 0, icon: '⏳', color: 'yellow' },
      ];
    }
  };

  const statsCards = getStatsCards();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.username}! 🚀
            </h1>
            <p className="text-gray-300">
              {user?.role === 'admin' ? 'Admin Dashboard' : 'Creator Dashboard'} - Manage your farming simulator content
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((item) => (
          <div key={item.name} className="glass-card p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-1">{item.name}</p>
                <p className="text-3xl font-bold text-white">
                  {loading ? '...' : item.value}
                </p>
              </div>
              <div className="text-4xl opacity-80">{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          ⚡ Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/mods"
            className="group glass-card p-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-600/30 hover:border-green-500/50"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🚜</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                Browse Mods
              </h3>
              <p className="text-sm text-gray-400 mt-2">Explore community mods</p>
            </div>
          </Link>

          <Link
            to="/dashboard/create-mod"
            className="group glass-card p-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-600/30 hover:border-blue-500/50"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                Create Mod
              </h3>
              <p className="text-sm text-gray-400 mt-2">Upload new content</p>
            </div>
          </Link>

          <Link
            to="/dashboard/request-mods"
            className="group glass-card p-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-600/30 hover:border-purple-500/50"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                Request Mods
              </h3>
              <p className="text-sm text-gray-400 mt-2">Community requests</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;