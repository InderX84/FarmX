import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await api.get('/admin/maintenance');
      setMaintenanceMode(response.data.maintenanceMode);
    } catch (error) {
      console.error('Failed to fetch maintenance status:', error);
    }
  };

  const toggleMaintenance = async () => {
    setMaintenanceLoading(true);
    try {
      const response = await api.post('/admin/maintenance', { enabled: !maintenanceMode });
      setMaintenanceMode(response.data.maintenanceMode);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to toggle maintenance mode');
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    setLoading(true);
    try {
      await api.post('/admin/reset-db');
      toast.success('Database reset successfully');
      setShowConfirm(false);
    } catch (error) {
      toast.error('Failed to reset database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage system settings and database
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <div className="space-y-8">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Maintenance Mode
            </h2>
            
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-white">
                  Site Maintenance
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {maintenanceMode ? 'Site is currently in maintenance mode' : 'Site is accessible to all users'}
                </p>
              </div>
              <button
                onClick={toggleMaintenance}
                disabled={maintenanceLoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  maintenanceMode ? 'bg-red-600 focus:ring-red-500' : 'bg-gray-600 focus:ring-gray-500'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Database Management
            </h2>
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Warning: Destructive Action
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    This will permanently delete all mods, categories, games, mod requests, and non-admin users. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Reset Database
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowConfirm(false)}></div>
          
          <div className="relative glass-card rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Confirm Database Reset
            </h2>
            
            <p className="text-gray-300 mb-6">
              Are you absolutely sure you want to reset the database? This will:
            </p>
            
            <ul className="text-sm text-gray-400 mb-6 space-y-1">
              <li>• Delete all mods and mod requests</li>
              <li>• Delete all categories and games</li>
              <li>• Delete all non-admin users</li>
              <li>• Create default categories and games</li>
            </ul>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDatabase}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Database'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;