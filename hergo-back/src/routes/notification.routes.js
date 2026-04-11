const express = require('express');
const {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require('../controllers/notification.controller');
const { authMiddleware } = require('../core/middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.get('/:id', authMiddleware, getNotificationById);
router.put('/:id/read', authMiddleware, markAsRead);
router.put('/read-all', authMiddleware, markAllAsRead);
router.delete('/:id', authMiddleware, deleteNotification);
router.delete('/delete-all', authMiddleware, deleteAllNotifications);

module.exports = router;