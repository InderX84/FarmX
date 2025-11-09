import User from '../models/User.js';

// Clean up unverified accounts older than 24 hours
export const cleanupUnverifiedAccounts = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const result = await User.deleteMany({
      isEmailVerified: false,
      createdAt: { $lt: twentyFourHoursAgo }
    });
    
    if (result.deletedCount > 0) {
      console.log(`Cleaned up ${result.deletedCount} unverified accounts`);
    }
  } catch (error) {
    console.error('Error cleaning up unverified accounts:', error);
  }
};

// Run cleanup every hour
export const startCleanupScheduler = () => {
  setInterval(cleanupUnverifiedAccounts, 60 * 60 * 1000); // 1 hour
  console.log('Cleanup scheduler started');
};