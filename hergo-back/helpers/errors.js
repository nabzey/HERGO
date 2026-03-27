class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Non authentifié') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Non autorisé') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Ressource non trouvée') {
    super(message, 404, 'NOT_FOUND_ERROR');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflit de ressources') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.code,
      ...(err.errors && { errors: err.errors }),
    });
  }

  // Erreur non gérée
  console.error('Erreur non gérée:', err);
  res.status(500).json({
    status: 'error',
    message: 'Erreur interne du serveur',
    code: 'INTERNAL_ERROR',
  });
};

// Middleware pour les routes non trouvées
const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} non trouvée`,
    code: 'NOT_FOUND',
  });
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  errorHandler,
  notFoundHandler,
};