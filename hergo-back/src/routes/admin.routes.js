const express = require('express');
const {
  getStatistics,
  getAllUsers,
  getUserById,
  updateUserRoleOrStatus,
  deleteUser,
  getAllLogements,
  updateLogementStatus,
  deleteLogement,
  getAllReservations,
  getAllReclamations,
  updateReclamationStatus,
  deleteReclamation,
} = require('../controllers/admin.controller');
const { authMiddleware, adminMiddleware } = require('../core/middlewares/auth.middleware');

const router = express.Router();

router.get('/statistics', authMiddleware, adminMiddleware, getStatistics);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, adminMiddleware, getUserById);
router.put('/users/:id', authMiddleware, adminMiddleware, updateUserRoleOrStatus);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);
router.get('/logements', authMiddleware, adminMiddleware, getAllLogements);
router.put('/logements/:id/status', authMiddleware, adminMiddleware, updateLogementStatus);
router.delete('/logements/:id', authMiddleware, adminMiddleware, deleteLogement);
router.get('/reservations', authMiddleware, adminMiddleware, getAllReservations);
router.get('/reclamations', authMiddleware, adminMiddleware, getAllReclamations);
router.put('/reclamations/:id/status', authMiddleware, adminMiddleware, updateReclamationStatus);
router.delete('/reclamations/:id', authMiddleware, adminMiddleware, deleteReclamation);

module.exports = router;