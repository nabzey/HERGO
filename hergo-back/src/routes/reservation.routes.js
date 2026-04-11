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
const { validate, validateQuery } = require('../helpers/validation');

const router = express.Router();

router.get('/', authMiddleware, validateQuery('pagination'), getAllReservations);
router.get('/:id', authMiddleware, getReservationById);
router.post('/', authMiddleware, travelerMiddleware, validate('createReservation'), createReservation);
router.put('/:id/status', authMiddleware, updateReservationStatus);
router.put('/:id/cancel', authMiddleware, cancelReservation);
router.delete('/:id', authMiddleware, adminMiddleware, deleteReservation);

module.exports = router;