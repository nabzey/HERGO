const { verifyToken } = require('../config/jwt');
const { pool } = require('../config/db');

// Middleware pour vérifier l'authentification JWT
const authMiddleware = async (req, res, next) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Accès non autorisé : Token manquant' });
    }

    // Extraire le token
    const token = authHeader.slice(7);

    // Vérifier et décoder le token
    const decoded = verifyToken(token);

    // Récupérer l'utilisateur depuis la base de données
    const [users] = await pool.execute('SELECT id, firstName, lastName, email, role, status, avatar, createdAt, updatedAt FROM User WHERE id = ?', [decoded.id]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Accès non autorisé : Utilisateur non trouvé' });
    }

    const user = users[0];

    // Vérifier le statut de l'utilisateur
    if (user.status === 'SUSPENDU') {
      return res.status(403).json({ message: 'Compte suspendue' });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Accès non autorisé : Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Accès non autorisé : Token expiré' });
    }
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Middleware pour vérifier le rôle de l'utilisateur
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Accès refusé : Rôle non autorisé' });
    }
    next();
  };
};

// Middleware pour vérifier si l'utilisateur est admin
const adminMiddleware = roleMiddleware('ADMIN');

// Middleware pour vérifier si l'utilisateur est hôte
const hostMiddleware = roleMiddleware('HOTE');

// Middleware pour vérifier si l'utilisateur est voyageur
const travelerMiddleware = roleMiddleware('VOYAGEUR');

module.exports = {
  authMiddleware,
  roleMiddleware,
  adminMiddleware,
  hostMiddleware,
  travelerMiddleware,
};