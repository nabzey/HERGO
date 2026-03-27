const express = require('express');
const { register, login, getCurrentUser, refreshToken } = require('../controllers/auth.controller');
const { authMiddleware } = require('../core/middlewares/auth.middleware');
const { validate } = require('../helpers/validation');

const router = express.Router();

router.post('/register', validate('register'), register);
router.post('/login', validate('login'), login);
router.post('/refresh-token', refreshToken);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;