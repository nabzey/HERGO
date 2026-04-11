const express = require('express');
const {
  getAllPayments,
  getPaymentById,
  createPaymentIntent,
} = require('../controllers/payment.controller');
const { authMiddleware, adminMiddleware } = require('../core/middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getAllPayments);
router.get('/:id', authMiddleware, adminMiddleware, getPaymentById);
router.post('/create-intent', authMiddleware, createPaymentIntent);

module.exports = router;