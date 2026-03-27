const jwt = require('jsonwebtoken');
const env = require('./env');

const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN || '15m',
  refreshSecret: env.JWT_REFRESH_SECRET || env.JWT_SECRET + '_refresh',
  refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN || '7d',
};

const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    throw error;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.refreshSecret);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  jwtConfig,
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};