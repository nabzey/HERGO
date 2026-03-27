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
  max: 5, // 5 tentatives de connexion
  message: { message: 'Trop de tentatives de connexion, réessayez plus tard' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware globaux
app.use(cors({
  origin: env.CORS_ORIGIN || 'http://localhost:3000',
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

// Routes API
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api-docs', swaggerSetup.serve, swaggerSetup.setup);
app.use('/api/logements', logementRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/settings', settingsRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Hebergo fonctionne' });
});

// Gestion des erreurs 404
app.use(notFoundHandler);

// Gestion des erreurs internes
app.use(errorHandler);

module.exports = app;
