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
const { validate } = require('../helpers/validation');

const router = express.Router();

router.get('/profile', authMiddleware, getMyProfile);
router.put('/profile', authMiddleware, validate('updateProfile'), updateUser);
router.put('/password', authMiddleware, validate('updatePassword'), updatePassword);
router.get('/reservations', authMiddleware, getMyReservations);
router.get('/reviews', authMiddleware, getMyReviews);
router.get('/notifications', authMiddleware, getMyNotifications);

module.exports = router;