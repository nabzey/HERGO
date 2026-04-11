const { z } = require('zod');

const registerSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe minimum 6 caractères')
});

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
});

const validate = (type) => {
  return (req, res, next) => {
    try {
      const schema = schemas[type];
      if (!schema) {
        return next();
      }
      const result = schema.parse(req.body);
      req.validated = result;
      next();
    } catch (error) {
      const validationError = new Error(error.errors?.[0]?.message || 'Validation failed');
      validationError.name = 'ValidationError';
      validationError.statusCode = 400;
      next(validationError);
    }
  };
};

const validateQuery = (type) => {
  return (req, res, next) => {
    try {
      const schema = querySchemas[type];
      if (!schema) {
        return next();
      }
      const result = schema.parse(req.query);
      req.validatedQuery = result;
      next();
    } catch (error) {
      const validationError = new Error(error.errors?.[0]?.message || 'Validation failed');
      validationError.name = 'ValidationError';
      validationError.statusCode = 400;
      next(validationError);
    }
  };
};

const schemas = {
  register: registerSchema,
  login: loginSchema,
  updateProfile: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    avatar: z.string().optional()
  }),
  updateUser: z.object({
    role: z.enum(['VOYAGEUR', 'HOTE', 'ADMIN']).optional(),
    status: z.enum(['ACTIF', 'SUSPENDU', 'BANNI']).optional()
  }),
  createLogement: z.object({
    titre: z.string().min(1, 'Titre requis'),
    description: z.string().min(1, 'Description requise'),
    prix: z.number().positive('Prix requis'),
    capacite: z.number().int().positive('Capacité requise'),
    adresse: z.string().min(1, 'Adresse requise'),
    ville: z.string().min(1, 'Ville requise'),
    pays: z.string().optional()
  }),
  updateLogement: z.object({
    titre: z.string().optional(),
    description: z.string().optional(),
    prix: z.number().optional(),
    capacite: z.number().optional(),
    adresse: z.string().optional(),
    ville: z.string().optional(),
    pays: z.string().optional(),
    statut: z.enum(['PUBLIE', 'BROUILLON', 'EN_ATTENTE', 'REJETE']).optional()
  }),
  createReservation: z.object({
    voyageurId: z.number().int(),
    logementId: z.number().int(),
    dateArrivee: z.string(),
    dateDepart: z.string(),
    nombrePersonnes: z.number().int().positive()
  }),
  updateReservation: z.object({
    statut: z.enum(['EN_ATTENTE', 'CONFIRME', 'ANNULE', 'TERMINE'])
  }),
  createReview: z.object({
    idLogement: z.number().int(),
    note: z.number().int().min(1).max(5),
    commentaire: z.string().min(1)
  }),
  createReclamation: z.object({
    idLogement: z.number().int(),
    sujet: z.string().min(1, 'Sujet requis'),
    description: z.string().min(1, 'Description requise')
  }),
  updateReclamation: z.object({
    statut: z.enum(['EN_ATTENTE', 'EN_TRAITEMENT', 'RESOLU', 'REJETE'])
  }),
  updatePayment: z.object({
    statut: z.enum(['EN_ATTENTE', 'CONFIRME', 'ECHOUE', 'REMBOURSE'])
  })
};

const querySchemas = {
  pagination: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional()
  }),
  filter: z.object({
    statut: z.enum(['PUBLIE', 'BROUILLON', 'EN_ATTENTE', 'REJETE']).optional(),
    idProprietaire: z.coerce.number().int().optional()
  })
};

module.exports = {
  validate,
  validateQuery,
  schemas,
  querySchemas
};