const express = require('express');
const multer = require('multer');
const {
  getAllLogements,
  getLogementById,
  createLogement,
  updateLogement,
  deleteLogement,
  uploadLogementImage,
  manageImages,
  manageEquipements,
  manageEspaces,
} = require('../controllers/logement.controller');
const { authMiddleware, adminMiddleware, hostMiddleware } = require('../core/middlewares/auth.middleware');
const { validate, validateQuery } = require('../helpers/validation');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      cb(new Error('Seuls les fichiers image sont autorisés'));
      return;
    }

    cb(null, true);
  },
});

router.get('/', validateQuery('pagination'), getAllLogements);
router.get('/:id', getLogementById);
router.post('/', authMiddleware, hostMiddleware, validate('createLogement'), createLogement);
router.put('/:id', authMiddleware, validate('updateLogement'), updateLogement);
router.delete('/:id', authMiddleware, deleteLogement);
router.post('/:id/images/upload', authMiddleware, upload.single('image'), uploadLogementImage);
router.put('/:id/images', authMiddleware, manageImages);
router.put('/:id/equipements', authMiddleware, manageEquipements);
router.put('/:id/espaces', authMiddleware, manageEspaces);

module.exports = router;
