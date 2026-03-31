const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const { errorHandler, notFoundHandler } = require('../helpers/errors');

// Initialisation de l'application Express
const app = express();

// Sécurité
app.use(helmet());

// Compression gzip
app.use(compression());

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par fenêtre
  message: { message: 'Trop de requêtes, réessayez plus tard' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Rate limiting pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'development' ? 50 : 10, // 50 tentatives en développement, 10 en production
  message: {
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
    retryAfter: 15 * 60 // 15 minutes en secondes
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Utiliser l'email si disponible, sinon l'IP
    return (req.body && req.body.email) ? req.body.email : req.ip;
  },
});

// Middleware globaux
const allowedOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (comme les applications mobiles ou curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Importation des routes
const authRoutes = require('../routes/auth.routes');
const swaggerSetup = require('../swagger');
const logementRoutes = require('../routes/logement.routes');
const reservationRoutes = require('../routes/reservation.routes');
const adminRoutes = require('../routes/admin.routes');
const userRoutes = require('../routes/user.routes');
const reviewRoutes = require('../routes/review.routes');
const notificationRoutes = require('../routes/notification.routes');
const calendarRoutes = require('../routes/calendar.routes');
const settingsRoutes = require('../routes/settings.routes');
const reclamationRoutes = require('../routes/reclamation.routes');

// Routes API
// Appliquer le rate limiter uniquement à la route de login
app.use('/api/auth/login', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerSetup.serve, swaggerSetup.setup);
app.use('/api/logements', logementRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reclamations', reclamationRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Hebergo fonctionne' });
});

// Gestion des erreurs 404
app.use(notFoundHandler);

// Gestion des erreurs internes
app.use(errorHandler);

module.exports = app;
