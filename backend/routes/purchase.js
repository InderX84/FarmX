import express from 'express';
import Mod from '../models/Mod.js';
import { protect } from '../middleware/auth.js';
import { sendPurchaseRequest } from '../utils/email.js';

const router = express.Router();

// Send purchase request email
router.post('/request/:modId', protect, async (req, res) => {
  try {
    const { message } = req.body;
    const mod = await Mod.findById(req.params.modId).populate('creator');
    
    if (!mod) {
      return res.status(404).json({ message: 'Mod not found' });
    }
    
    console.log('Mod fields:', Object.keys(mod.toObject()));
    console.log('Mod contactEmail:', mod.contactEmail);
    
    // Temporary fix: If contactEmail is missing but adminContact exists, use adminContact as email
    if (!mod.contactEmail && mod.adminContact && mod.adminContact.includes('@')) {
      console.log('Using adminContact as contactEmail:', mod.adminContact);
      // Update the mod with contactEmail
      await Mod.findByIdAndUpdate(req.params.modId, { contactEmail: mod.adminContact });
      mod.contactEmail = mod.adminContact;
    }
    
    if (mod.price === 0) {
      return res.status(400).json({ message: 'This mod is free' });
    }
    
    let recipientEmail = mod.contactEmail;
    
    // Fallback to admin email if mod doesn't have contactEmail
    if (!recipientEmail) {
      console.log('Mod missing contactEmail, using admin email:', mod._id, mod.title);
      recipientEmail = 'indermehra622@gmail.com'; // Use admin email as fallback
    }
    
    console.log('Sending email to:', recipientEmail);
    
    const buyerDetails = {
      username: req.user.username,
      email: req.user.email,
      message: message || `I would like to purchase the mod "${mod.title}" for ₹${mod.price}.`
    };
    
    const modDetails = {
      title: mod.title,
      price: mod.price,
      description: mod.description
    };
    
    await sendPurchaseRequest(modDetails, buyerDetails, recipientEmail);
    
    res.json({ message: 'Purchase request sent successfully' });
  } catch (error) {
    console.error('Purchase request error:', error);
    res.status(500).json({ message: 'Failed to send purchase request', error: error.message });
  }
});

export default router;