import { maintenanceMode } from '../routes/admin.js';

export const checkMaintenance = (req, res, next) => {
  // Skip maintenance check for admin routes and maintenance status endpoint
  if (req.path.startsWith('/api/admin') || req.path === '/api/auth/me') {
    return next();
  }

  // Skip for admin users
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  if (maintenanceMode) {
    return res.status(503).json({
      message: 'Site is currently under maintenance. Please try again later.',
      maintenanceMode: true
    });
  }

  next();
};