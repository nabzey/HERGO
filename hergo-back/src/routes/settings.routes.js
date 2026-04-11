const express = require('express');
const {
  getSettings,
  updateSettings,
} = require('../controllers/settings.controller');
const { authMiddleware } = require('../core/middlewares/auth.middleware');
const { validate } = require('../helpers/validation');

const router = express.Router();

router.get('/', authMiddleware, getSettings);
router.put('/', authMiddleware, validate('updateSettings'), updateSettings);

module.exports = router;