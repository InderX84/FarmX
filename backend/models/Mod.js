import mongoose from 'mongoose';

const modSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true
  },
  gameName: {
    type: String,
    required: true,
    trim: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  version: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  isFree: {
    type: Boolean,
    default: true
  },
  imgUrl: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  downloadLink: {
    type: String,
    trim: true
  },
  adminContact: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true
  },
  instagramLink: {
    type: String,
    trim: true
  },
  telegramLink: {
    type: String,
    trim: true
  },
  fileUrl: {
    type: String
  },
  fileSize: {
    type: Number
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

modSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Mod', modSchema);