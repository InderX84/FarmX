import express from 'express';
import User from '../models/User.js';
import Mod from '../models/Mod.js';
import Category from '../models/Category.js';
import ModRequest from '../models/ModRequest.js';
import Game from '../models/Game.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Maintenance mode state
let maintenanceMode = false;

// Reset database (Admin only)
router.post('/reset-db', protect, admin, async (req, res) => {
  try {
    console.log('Starting database reset...');
    
    // Delete all collections except admin user
    await Mod.deleteMany({});
    console.log('Mods deleted');
    
    await Category.deleteMany({});
    console.log('Categories deleted');
    
    await ModRequest.deleteMany({});
    console.log('ModRequests deleted');
    
    await Game.deleteMany({});
    console.log('Games deleted');
    
    await User.deleteMany({ role: { $ne: 'admin' } });
    console.log('Non-admin users deleted');

    // Create default categories
    const defaultCategories = [
      { name: 'Tractors', detail: 'Farming tractors and equipment', imgUrl: 'https://via.placeholder.com/300x200?text=Tractors' },
      { name: 'Vehicles', detail: 'Cars, trucks, and other vehicles', imgUrl: 'https://via.placeholder.com/300x200?text=Vehicles' },
      { name: 'Maps', detail: 'Custom farming maps', imgUrl: 'https://via.placeholder.com/300x200?text=Maps' },
      { name: 'Tools', detail: 'Farming tools and implements', imgUrl: 'https://via.placeholder.com/300x200?text=Tools' },
      { name: 'Other', detail: 'Miscellaneous mods', imgUrl: 'https://via.placeholder.com/300x200?text=Other' }
    ];

    await Category.insertMany(defaultCategories);
    console.log('Default categories created');

    // Create default games
    const defaultGames = [
      { 
        name: 'Farming Simulator 22', 
        detail: 'Latest farming simulation game',
        imgUrl: 'https://via.placeholder.com/300x200?text=FS22'
      },
      { 
        name: 'Farming Simulator 19', 
        detail: 'Popular farming simulation game',
        imgUrl: 'https://via.placeholder.com/300x200?text=FS19'
      }
    ];

    await Game.insertMany(defaultGames);
    console.log('Default games created');

    console.log('Database reset completed successfully');
    res.json({ message: 'Database reset successfully' });
  } catch (error) {
    console.error('Database reset error:', error);
    res.status(500).json({ message: 'Failed to reset database', error: error.message });
  }
});

// Toggle maintenance mode
router.post('/maintenance', protect, admin, async (req, res) => {
  try {
    const { enabled } = req.body;
    maintenanceMode = enabled;
    res.json({ maintenanceMode, message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle maintenance mode', error: error.message });
  }
});

// Get maintenance status
router.get('/maintenance', async (req, res) => {
  res.json({ maintenanceMode });
});

export { maintenanceMode };
export default router;