const express = require('express');
const cors = require('cors');
const env = require('../config/env');

// Initialisation de l'application Express
const app = express();

// Middleware globaux
app.use(cors());
app.use(express.json());

// Importation des routes
const authRoutes = require('../routes/auth.routes');
const swaggerSetup = require('../swagger');
const logementRoutes = require('../routes/logement.routes');
const reservationRoutes = require('../routes/reservation.routes');
const adminRoutes = require('../routes/admin.routes');
const userRoutes = require('../routes/user.routes');
const reviewRoutes = require('../routes/review.routes');
const notificationRoutes = require('../routes/notification.routes');

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerSetup.serve, swaggerSetup.setup);
app.use('/api/logements', logementRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Hebergo fonctionne' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs internes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

module.exports = app;