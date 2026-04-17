const express = require('express');
const {
  getAllPayments,
  getPaymentById,
  createPaymentIntent,
  getPaymentAmount,
} = require('../controllers/payment.controller');
const { authMiddleware, adminMiddleware } = require('../core/middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getAllPayments);
router.get('/:id', authMiddleware, adminMiddleware, getPaymentById);
router.get('/amount/:reservationId', authMiddleware, getPaymentAmount);
router.post('/create-intent', authMiddleware, createPaymentIntent);

module.exports = router;