import express from 'express';
import { body, validationResult } from 'express-validator';
import Request from '../models/Request.js';
import Mod from '../models/Mod.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { sendRequestNotification } from '../utils/email.js';

const router = express.Router();

// Create request
router.post('/', protect, [
  body('modId').isMongoId(),
  body('message').isLength({ min: 10, max: 500 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { modId, message } = req.body;

    const mod = await Mod.findById(modId);
    if (!mod) {
      return res.status(404).json({ message: 'Mod not found' });
    }

    if (mod.isFree) {
      return res.status(400).json({ message: 'This mod is free, no request needed' });
    }

    // Check if user already has a pending request for this mod
    const existingRequest = await Request.findOne({
      user: req.user._id,
      mod: modId,
      status: { $in: ['pending', 'in-progress'] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this mod' });
    }

    const request = await Request.create({
      user: req.user._id,
      mod: modId,
      message
    });

    await request.populate([
      { path: 'user', select: 'username email' },
      { path: 'mod', select: 'title price' }
    ]);

    // Send email notification to admin
    try {
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await sendRequestNotification(admin.email, request, mod, req.user);
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's requests
router.get('/my-requests', protect, async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user._id })
      .populate('mod', 'title price images')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all requests (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate('user', 'username email')
      .populate('mod', 'title price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Request.countDocuments(query);

    res.json({
      requests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update request status (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    ).populate([
      { path: 'user', select: 'username email' },
      { path: 'mod', select: 'title price' }
    ]);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;