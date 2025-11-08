import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mod',
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

export default mongoose.model('Request', requestSchema);