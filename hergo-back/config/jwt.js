const jwt = require('jsonwebtoken');
const env = require('./env');

const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
};

const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    throw error;
  }
};

module.exports = { jwtConfig, generateToken, verifyToken };