const jwt = require('jsonwebtoken');
const { prisma } = require('../../config/prisma');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      const error = new Error('Token requis');
      error.name = 'AuthenticationError';
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.name = 'AuthenticationError';
      error.statusCode = 401;
      return next(error);
    }

    if (user.status === 'BANNI') {
      const error = new Error('Compte banni');
      error.name = 'AuthenticationError';
      error.statusCode = 403;
      return next(error);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      const authError = new Error('Token invalide ou expiré');
      authError.name = 'AuthenticationError';
      authError.statusCode = 401;
      return next(authError);
    }
    next(error);
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    const error = new Error('Accès administrateur requis');
    error.name = 'AuthenticationError';
    error.statusCode = 403;
    return next(error);
  }
  next();
};

const hostMiddleware = (req, res, next) => {
  if (req.user.role !== 'HOTE' && req.user.role !== 'ADMIN') {
    const error = new Error('Accès hôte requis');
    error.name = 'AuthenticationError';
    error.statusCode = 403;
    return next(error);
  }
  next();
};

const travelerMiddleware = (req, res, next) => {
  if (req.user.role !== 'VOYAGEUR' && req.user.role !== 'ADMIN') {
    const error = new Error('Accès voyageur requis');
    error.name = 'AuthenticationError';
    error.statusCode = 403;
    return next(error);
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  hostMiddleware,
  travelerMiddleware
};