const express = require('express');
const {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservationStatus,
  cancelReservation,
  deleteReservation,
} = require('../controllers/reservation.controller');
const { authMiddleware, adminMiddleware, travelerMiddleware } = require('../core/middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, getAllReservations);
router.get('/:id', authMiddleware, getReservationById);
router.post('/', authMiddleware, travelerMiddleware, createReservation);
router.put('/:id/status', authMiddleware, updateReservationStatus);
router.put('/:id/cancel', authMiddleware, cancelReservation);
router.delete('/:id', authMiddleware, adminMiddleware, deleteReservation);

module.exports = router;