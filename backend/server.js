import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import modRoutes from './routes/mods.js';
import requestRoutes from './routes/requests.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import modRequestRoutes from './routes/modRequests.js';
import gameRoutes from './routes/games.js';
import adminRoutes from './routes/admin.js';
import { checkMaintenance } from './middleware/maintenance.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes (admin routes first, before maintenance check)
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Maintenance mode check (after admin and auth routes)
app.use(checkMaintenance);

// Other routes
app.use('/api/mods', modRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/mod-requests', modRequestRoutes);
app.use('/api/games', gameRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'FarmMods API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});