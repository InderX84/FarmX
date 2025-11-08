import express from 'express';
import Game from '../models/Game.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ name: 1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create game (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, detail, imgUrl } = req.body;
    
    const existingGame = await Game.findOne({ name });
    if (existingGame) {
      return res.status(400).json({ message: 'Game already exists' });
    }

    const game = new Game({ name, detail, imgUrl });
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update game (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete game (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;