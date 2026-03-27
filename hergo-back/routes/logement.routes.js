const express = require('express');
const {
  getAllLogements,
  getLogementById,
  createLogement,
  updateLogement,
  deleteLogement,
  manageImages,
  manageEquipements,
  manageEspaces,
} = require('../controllers/logement.controller');
const { authMiddleware, adminMiddleware, hostMiddleware } = require('../core/middlewares/auth.middleware');
const { validate, validateQuery } = require('../helpers/validation');

const router = express.Router();

router.get('/', validateQuery('pagination'), getAllLogements);
router.get('/:id', getLogementById);
router.post('/', authMiddleware, hostMiddleware, validate('createLogement'), createLogement);
router.put('/:id', authMiddleware, validate('updateLogement'), updateLogement);
router.delete('/:id', authMiddleware, deleteLogement);
router.put('/:id/images', authMiddleware, manageImages);
router.put('/:id/equipements', authMiddleware, manageEquipements);
router.put('/:id/espaces', authMiddleware, manageEspaces);

module.exports = router;