const { z } = require('zod');

// Schémas de validation
const schemas = {
  // Auth
  register: z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    role: z.enum(['Voyageur', 'Hôte', 'Admin', 'VOYAGEUR', 'HOTE', 'ADMIN']).default('VOYAGEUR'),
    phone: z.string().optional(),
  }),

  login: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Le mot de passe est requis'),
  }),

  // User
  updateProfile: z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    telephone: z.string().optional(),
    ville: z.string().optional(),
    pays: z.string().optional(),
    bio: z.string().max(500).optional(),
  }),

  updatePassword: z.object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
  }),

  // Logement
  createLogement: z.object({
    titre: z.string().min(3, 'Le titre doit contenir au moins 3 caractères').max(200),
    ville: z.string().min(1, 'La ville est requise'),
    adresse: z.string().min(1, "L'adresse est requise"),
    description: z.string().min(10, 'La description doit contenir au moins 10 caractères').max(2000),
    prixJour: z.coerce.number().positive('Le prix doit être positif'),
    capacite: z.coerce.number().int().positive('La capacité doit être positive'),
    pays: z.string().min(1, 'Le pays est requis'),
    longitude: z.coerce.number().optional(),
    latitude: z.coerce.number().optional(),
    statut: z.enum(['PUBLIE', 'BROUILLON', 'EN_ATTENTE', 'REJETE']).optional(),
  }),

  updateLogement: z.object({
    titre: z.string().min(3).max(200).optional(),
    ville: z.string().min(1).optional(),
    adresse: z.string().optional(),
    description: z.string().min(10).max(2000).optional(),
    prixJour: z.coerce.number().positive().optional(),
    capacite: z.coerce.number().int().positive().optional(),
    pays: z.string().min(1).optional(),
    longitude: z.coerce.number().optional(),
    latitude: z.coerce.number().optional(),
    statut: z.enum(['PUBLIE', 'BROUILLON', 'EN_ATTENTE', 'REJETE']).optional(),
  }),

  // Reservation
  createReservation: z.object({
    logementId: z.number().int().positive(),
    dateArrivee: z.string().datetime(),
    dateDepart: z.string().datetime(),
    nombrePersonnes: z.number().int().positive(),
    message: z.string().max(500).optional(),
  }),

  // Review
  createReview: z.object({
    logementId: z.number().int().positive(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(10, 'Le commentaire doit contenir au moins 10 caractères').max(1000),
  }),

  // Reclamation
  createReclamation: z.object({
    sujet: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères').max(200),
    description: z.string().min(20, 'La description doit contenir au moins 20 caractères').max(2000),
  }),

  // Calendar
  createCalendarEvent: z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    date: z.string().datetime(),
    type: z.enum(['reservation', 'maintenance', 'blocked', 'other']),
    logementId: z.number().int().positive().optional(),
  }),

  // Settings
  updateSettings: z.object({
    emailNotifications: z.boolean().optional(),
    reservationNotifications: z.boolean().optional(),
    departureReminders: z.boolean().optional(),
    monthlyNewsletter: z.boolean().optional(),
    language: z.enum(['fr', 'en']).optional(),
    currency: z.enum(['FCFA', 'EUR', 'USD']).optional(),
  }),

  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
};

// Middleware de validation
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({ message: 'Schéma de validation non trouvé' });
    }

    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      return res.status(400).json({ message: 'Erreur de validation' });
    }
  };
};

// Validation des query params
const validateQuery = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({ message: 'Schéma de validation non trouvé' });
    }

    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error) {
      return res.status(400).json({ message: 'Erreur de validation' });
    }
  };
};

module.exports = {
  schemas,
  validate,
  validateQuery,
};
