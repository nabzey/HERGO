const jwt = require('jsonwebtoken');
const { prisma } = require('../../config/prisma');
const { AuthenticationError } = require('../../utils/errors');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;
    if (!token) {
      return next(new AuthenticationError('Token requis'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return next(new AuthenticationError('Utilisateur non trouvé'));
    }

    if (user.status === 'BANNI') {
      return next(new AuthenticationError('Compte banni'));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Token invalide ou expiré'));
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