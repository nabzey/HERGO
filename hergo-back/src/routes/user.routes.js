const express = require('express');
const multer = require('multer');
const {
  updateUser,
  updatePassword,
  getMyProfile,
  getMyReservations,
  getMyReviews,
  getMyNotifications,
  uploadAvatar,
} = require('../controllers/user.controller');
const { authMiddleware } = require('../core/middlewares/auth.middleware');
const { validate } = require('../helpers/validation');

const router = express.Router();
const upload = multer();

router.get('/profile', authMiddleware, getMyProfile);
router.put('/profile', authMiddleware, validate('updateProfile'), updateUser);
router.post('/profile/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
router.put('/password', authMiddleware, validate('updatePassword'), updatePassword);
router.get('/reservations', authMiddleware, getMyReservations);
router.get('/reviews', authMiddleware, getMyReviews);
router.get('/notifications', authMiddleware, getMyNotifications);

module.exports = router;