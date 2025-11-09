import Notification from '../models/Notification.js';

export const createNotification = async (userId, title, message, type = 'general', relatedId = null) => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
      relatedId
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};