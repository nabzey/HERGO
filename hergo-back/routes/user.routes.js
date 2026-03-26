const express = require('express');
const {
  updateUser,
  updatePassword,
  getMyProfile,
  getMyReservations,
  getMyReviews,
  getMyNotifications,
} = require('../controllers/user.controller');
const { authMiddleware } = require('../core/middlewares/auth.middleware');

const router = express.Router();

router.get('/profile', authMiddleware, getMyProfile);
router.put('/profile', authMiddleware, updateUser);
router.put('/password', authMiddleware, updatePassword);
router.get('/reservations', authMiddleware, getMyReservations);
router.get('/reviews', authMiddleware, getMyReviews);
router.get('/notifications', authMiddleware, getMyNotifications);

module.exports = router;