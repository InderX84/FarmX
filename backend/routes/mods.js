import express from 'express';
import { body, validationResult } from 'express-validator';
import Mod from '../models/Mod.js';
import Game from '../models/Game.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Get all mods (public)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      gameName,
      search, 
      sort = 'createdAt',
      order = 'desc',
      type = 'all'
    } = req.query;

    const query = {};
    
    // Only show approved mods to public, allow status filtering for admins
    if (req.query.status) {
      query.status = req.query.status;
    } else {
      query.status = 'approved';
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (gameName && gameName !== 'all') {
      query.gameName = gameName;
    }
    
    if (type === 'free') {
      query.isFree = true;
    } else if (type === 'paid') {
      query.isFree = false;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sort]: sortOrder };

    const mods = await Mod.find(query)
      .populate('creator', 'username avatar')
      .populate('game', 'name imgUrl')
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Mod.countDocuments(query);

    res.json({
      mods,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single mod
router.get('/:id', async (req, res) => {
  try {
    const mod = await Mod.findById(req.params.id)
      .populate('creator', 'username avatar')
      .populate('ratings.user', 'username avatar');

    if (!mod) {
      return res.status(404).json({ message: 'Mod not found' });
    }

    res.json(mod);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create mod
router.post('/', protect, upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'modFile', maxCount: 1 }
]), [
  body('name').isLength({ min: 3 }).trim(),
  body('title').isLength({ min: 3 }).trim(),
  body('description').isLength({ min: 3 }).trim(),
  body('version').notEmpty().trim()
], async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, title, description, category, gameName, tags, version, price, isFree, imgUrl, adminContact, instagramLink, telegramLink } = req.body;
    const downloadLink = Array.isArray(req.body.downloadLink) ? req.body.downloadLink[0] : req.body.downloadLink;
    
    console.log('Processed downloadLink:', downloadLink, typeof downloadLink);

    if (!req.files?.modFile?.[0] && !downloadLink) {
      return res.status(400).json({ message: 'Either mod file or download link is required' });
    }

    // Upload mod file to Cloudinary if provided
    let modFileResult = null;
    if (req.files?.modFile?.[0]) {
      modFileResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'raw', folder: 'farmmods/files' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.files.modFile[0].buffer);
      });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files?.images) {
      for (const image of req.files.images) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'farmmods/images' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(image.buffer);
        });
        imageUrls.push(result.secure_url);
      }
    }

    // Find game by name (optional for now)
    let game = null;
    if (gameName) {
      game = await Game.findOne({ name: gameName });
      if (!game) {
        return res.status(400).json({ message: 'Invalid game selected' });
      }
    }

    const mod = await Mod.create({
      name,
      title,
      description,
      category,
      gameName: gameName || 'Unknown',
      game: game?._id || null,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      version,
      price: isFree === 'true' ? 0 : parseFloat(price) || 0,
      isFree: isFree === 'true',
      images: imgUrl ? [imgUrl, ...imageUrls] : imageUrls,
      fileUrl: modFileResult?.secure_url || null,
      downloadLink: downloadLink || null,
      adminContact: adminContact || null,
      instagramLink: instagramLink || null,
      telegramLink: telegramLink || null,
      fileSize: req.files?.modFile?.[0]?.size || 0,
      creator: req.user._id,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    await mod.populate('creator', 'username avatar');

    res.status(201).json(mod);
  } catch (error) {
    console.error('Create mod error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update mod
router.put('/:id', protect, async (req, res) => {
  try {
    const mod = await Mod.findById(req.params.id);

    if (!mod) {
      return res.status(404).json({ message: 'Mod not found' });
    }

    if (mod.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedMod = await Mod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('creator', 'username avatar');

    res.json(updatedMod);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete mod
router.delete('/:id', protect, async (req, res) => {
  try {
    const mod = await Mod.findById(req.params.id);

    if (!mod) {
      return res.status(404).json({ message: 'Mod not found' });
    }

    if (mod.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Mod.findByIdAndDelete(req.params.id);

    res.json({ message: 'Mod deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download mod
router.post('/:id/download', async (req, res) => {
  try {
    const mod = await Mod.findById(req.params.id);

    if (!mod || mod.status !== 'approved') {
      return res.status(404).json({ message: 'Mod not found' });
    }

    if (!mod.isFree) {
      return res.status(403).json({ message: 'This is a paid mod. Please contact admin.' });
    }

    // Increment download count
    mod.downloads += 1;
    await mod.save();

    res.json({ downloadUrl: mod.fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update mod status (Admin only)
router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const mod = await Mod.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('creator', 'username avatar');

    if (!mod) {
      return res.status(404).json({ message: 'Mod not found' });
    }

    res.json(mod);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add rating
router.post('/:id/rating', protect, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const mod = await Mod.findById(req.params.id);

    if (!mod) {
      return res.status(404).json({ message: 'Mod not found' });
    }

    // Check if user already rated
    const existingRating = mod.ratings.find(r => r.user.toString() === req.user._id.toString());
    
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
    } else {
      mod.ratings.push({
        user: req.user._id,
        rating,
        comment
      });
    }

    await mod.save();
    await mod.populate('ratings.user', 'username avatar');

    res.json(mod);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;