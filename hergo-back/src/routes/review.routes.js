const express = require('express');
const {
  getReviewsByLogement,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controller');
const { authMiddleware, travelerMiddleware, adminMiddleware } = require('../core/middlewares/auth.middleware');
const { validate } = require('../helpers/validation');

const router = express.Router();

router.get('/logement/:idLogement', getReviewsByLogement);
router.get('/:id', authMiddleware, getReviewById);
router.post('/', authMiddleware, travelerMiddleware, validate('createReview'), createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;