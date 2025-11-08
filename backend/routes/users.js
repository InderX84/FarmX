import express from 'express';
import User from '../models/User.js';
import Mod from '../models/Mod.js';
import Request from '../models/Request.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get public stats (no auth required)
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMods = await Mod.countDocuments({ status: 'approved' });
    
    res.json({ totalUsers, totalMods });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, email, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, email, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's mods
router.get('/my-mods', protect, async (req, res) => {
  try {
    const mods = await Mod.find({ creator: req.user._id })
      .sort({ createdAt: -1 });

    res.json(mods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard stats
router.get('/dashboard-stats', protect, async (req, res) => {
  try {
    const stats = {};

    if (req.user.role === 'admin') {
      stats.totalUsers = await User.countDocuments();
      stats.totalMods = await Mod.countDocuments();
      stats.pendingMods = await Mod.countDocuments({ status: 'pending' });
      stats.totalRequests = await Request.countDocuments();
      stats.pendingRequests = await Request.countDocuments({ status: 'pending' });
    } else if (req.user.role === 'creator') {
      stats.myMods = await Mod.countDocuments({ creator: req.user._id });
      stats.approvedMods = await Mod.countDocuments({ creator: req.user._id, status: 'approved' });
      stats.pendingMods = await Mod.countDocuments({ creator: req.user._id, status: 'pending' });
      
      const myMods = await Mod.find({ creator: req.user._id });
      stats.totalDownloads = myMods.reduce((sum, mod) => sum + mod.downloads, 0);
    } else {
      stats.myRequests = await Request.countDocuments({ user: req.user._id });
      stats.pendingRequests = await Request.countDocuments({ user: req.user._id, status: 'pending' });
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;