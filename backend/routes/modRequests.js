import express from 'express';
import ModRequest from '../models/ModRequest.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Get all mod requests
router.get('/', async (req, res) => {
  try {
    const requests = await ModRequest.find()
      .populate('requester', 'username')
      .sort({ voteCount: -1, createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create mod request
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    console.log('Mod request body:', req.body);
    console.log('Mod request file:', req.file);
    console.log('User:', req.user);
    
    const { title, description, category } = req.body;
    let imageUrl = null;

    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'mod-requests' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue without image
      }
    }
    
    const modRequest = new ModRequest({
      title,
      description,
      category,
      image: imageUrl,
      requester: req.user.id
    });

    await modRequest.save();
    await modRequest.populate('requester', 'username');
    
    res.status(201).json(modRequest);
  } catch (error) {
    console.error('Mod request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Vote for mod request
router.post('/:id/vote', protect, async (req, res) => {
  try {
    const modRequest = await ModRequest.findById(req.params.id);
    
    if (!modRequest) {
      return res.status(404).json({ message: 'Mod request not found' });
    }

    const hasVoted = modRequest.votes.some(vote => vote.user.toString() === req.user.id);
    
    if (hasVoted) {
      // Remove vote
      modRequest.votes = modRequest.votes.filter(vote => vote.user.toString() !== req.user.id);
      modRequest.voteCount = modRequest.votes.length;
    } else {
      // Add vote
      modRequest.votes.push({ user: req.user.id });
      modRequest.voteCount = modRequest.votes.length;
    }

    await modRequest.save();
    res.json(modRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update mod request status (Admin only)
router.put('/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, downloadLink } = req.body;
    const updateData = { status };
    
    if (status === 'completed' && downloadLink) {
      updateData.downloadLink = downloadLink;
    }
    
    const modRequest = await ModRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('requester', 'username');

    if (!modRequest) {
      return res.status(404).json({ message: 'Mod request not found' });
    }

    res.json(modRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;