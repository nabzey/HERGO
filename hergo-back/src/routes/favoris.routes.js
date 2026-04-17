const express = require('express');
const router = express.Router();
const favorisController = require('../controllers/favoris.controller');
const { authMiddleware } = require('../core/middlewares/auth.middleware');

router.get('/', authMiddleware, favorisController.getAllFavoris);
router.post('/', authMiddleware, favorisController.addFavori);
router.delete('/:idLogement', authMiddleware, favorisController.removeFavori);
router.get('/check/:idLogement', authMiddleware, favorisController.checkFavori);

module.exports = router;