const { z } = require('zod');

const roleSchema = z.enum(['Voyageur', 'Hôte', 'Admin', 'VOYAGEUR', 'HOTE', 'ADMIN']).optional();
const statusSchema = z.enum(['actif', 'suspendu', 'banni', 'ACTIF', 'SUSPENDU', 'BANNI']).optional();
const logementStatusSchema = z.enum(['PUBLIE', 'BROUILLON', 'EN_ATTENTE', 'REJETE', 'publié', 'brouillon', 'en attente', 'rejeté']).optional();

const normalizeRole = (role) => {
  if (!role) {
    return undefined;
  }

  const roleMap = {
    Voyageur: 'VOYAGEUR',
    Hôte: 'HOTE',
    Admin: 'ADMIN',
    VOYAGEUR: 'VOYAGEUR',
    HOTE: 'HOTE',
    ADMIN: 'ADMIN',
  };

  return roleMap[role] || role;
};

const normalizeStatus = (status) => {
  if (!status) {
    return undefined;
  }

  const statusMap = {
    actif: 'ACTIF',
    suspendu: 'SUSPENDU',
    banni: 'BANNI',
    ACTIF: 'ACTIF',
    SUSPENDU: 'SUSPENDU',
    BANNI: 'BANNI',
  };

  return statusMap[status] || status;
};

const normalizeLogementStatus = (status) => {
  if (!status) {
    return undefined;
  }

  const statusMap = {
    publié: 'PUBLIE',
    brouillon: 'BROUILLON',
    'en attente': 'EN_ATTENTE',
    rejeté: 'REJETE',
    PUBLIE: 'PUBLIE',
    BROUILLON: 'BROUILLON',
    EN_ATTENTE: 'EN_ATTENTE',
    REJETE: 'REJETE',
  };

  return statusMap[status] || status;
};

const normalizeReservationStatus = (status) => {
  if (!status) {
    return undefined;
  }

  const statusMap = {
    confirmée: 'CONFIRME',
    'en attente': 'EN_ATTENTE',
    annulée: 'ANNULE',
    terminée: 'TERMINE',
    CONFIRME: 'CONFIRME',
    EN_ATTENTE: 'EN_ATTENTE',
    ANNULE: 'ANNULE',
    TERMINE: 'TERMINE',
  };

  return statusMap[status] || status;
};

const normalizeCountryCode = (value) => {
  if (!value) {
    return undefined;
  }

  const digits = String(value).replace(/[^\d]/g, '');
  return digits ? `+${digits}` : undefined;
};

const normalizePhoneDigits = (value) => {
  if (!value) {
    return undefined;
  }

  const digits = String(value).replace(/[^\d]/g, '');
  return digits || undefined;
};

const registerSchema = z.object({
  name: z.string().min(2, 'Nom requis').optional(),
  firstName: z.string().min(1, 'Prénom requis').optional(),
  lastName: z.string().min(1, 'Nom requis').optional(),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe minimum 8 caractères'),
  role: roleSchema,
  phone: z.string().optional(),
  phoneCountryCode: z.string().optional(),
  phoneNationalNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  const hasName = Boolean(data.name && data.name.trim());
  const hasSplitName = Boolean(data.firstName && data.lastName);

  if (!hasName && !hasSplitName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Nom complet requis',
      path: ['name'],
    });
  }

  if (data.phoneCountryCode && !normalizeCountryCode(data.phoneCountryCode)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Indicatif pays invalide',
      path: ['phoneCountryCode'],
    });
  }

  if (data.phoneNationalNumber && !normalizePhoneDigits(data.phoneNationalNumber)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Numéro de téléphone invalide',
      path: ['phoneNationalNumber'],
    });
  }
}).transform((data) => ({
  name: data.name?.trim() || `${data.firstName} ${data.lastName}`.trim(),
  email: data.email.trim().toLowerCase(),
  password: data.password,
  role: normalizeRole(data.role) || 'VOYAGEUR',
  phone: data.phone?.trim(),
  phoneCountryCode: normalizeCountryCode(data.phoneCountryCode),
  phoneNationalNumber: normalizePhoneDigits(data.phoneNationalNumber),
}));

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
      req.body = result;
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
      req.query = result;
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
    email: z.string().email('Email invalide').optional(),
    phone: z.string().optional(),
    phoneCountryCode: z.string().optional(),
    phoneNationalNumber: z.string().optional(),
    avatar: z.string().optional()
  }),
  updatePassword: z.object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z.string().min(8, 'Nouveau mot de passe minimum 8 caractères')
  }),
  updateSettings: z.object({
    emailNotifications: z.boolean().optional(),
    reservationNotifications: z.boolean().optional(),
    departureReminders: z.boolean().optional(),
    monthlyNewsletter: z.boolean().optional(),
    language: z.string().min(2).max(10).optional(),
    currency: z.string().min(1).max(10).optional(),
    theme: z.enum(['light', 'dark', 'auto']).optional(),
  }),
  updateUser: z.object({
    role: roleSchema,
    status: statusSchema
  }).transform((data) => ({
    role: normalizeRole(data.role),
    status: normalizeStatus(data.status),
  })),
  createLogement: z.object({
    titre: z.string().min(1, 'Titre requis').optional(),
    name: z.string().min(1, 'Titre requis').optional(),
    description: z.string().min(1, 'Description requise'),
    prix: z.coerce.number().positive('Prix requis').optional(),
    prixJour: z.coerce.number().positive('Prix requis').optional(),
    capacite: z.coerce.number().int().positive('Capacité requise'),
    adresse: z.string().min(1, 'Adresse requise'),
    ville: z.string().min(1, 'Ville requise'),
    pays: z.string().optional(),
    longitude: z.coerce.number().optional().nullable(),
    latitude: z.coerce.number().optional().nullable(),
    statut: logementStatusSchema,
  }).superRefine((data, ctx) => {
    if (!data.titre && !data.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Titre requis',
        path: ['titre'],
      });
    }
    if (data.prix === undefined && data.prixJour === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Prix requis',
        path: ['prixJour'],
      });
    }
  }).transform((data) => ({
    titre: data.titre || data.name,
    description: data.description,
    prixJour: data.prixJour ?? data.prix,
    capacite: data.capacite,
    adresse: data.adresse,
    ville: data.ville,
    pays: data.pays || 'Sénégal',
    longitude: data.longitude ?? null,
    latitude: data.latitude ?? null,
    statut: normalizeLogementStatus(data.statut) || 'BROUILLON',
  })),
  updateLogement: z.object({
    titre: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    prix: z.coerce.number().optional(),
    prixJour: z.coerce.number().optional(),
    capacite: z.coerce.number().int().optional(),
    adresse: z.string().optional(),
    ville: z.string().optional(),
    pays: z.string().optional(),
    longitude: z.coerce.number().optional().nullable(),
    latitude: z.coerce.number().optional().nullable(),
    statut: logementStatusSchema
  }).transform((data) => ({
    titre: data.titre || data.name,
    description: data.description,
    prixJour: data.prixJour ?? data.prix,
    capacite: data.capacite,
    adresse: data.adresse,
    ville: data.ville,
    pays: data.pays,
    longitude: data.longitude,
    latitude: data.latitude,
    statut: normalizeLogementStatus(data.statut),
  })),
  createReservation: z.object({
    idLogement: z.coerce.number().int().positive().optional(),
    logementId: z.coerce.number().int().positive().optional(),
    dateArrivee: z.string().optional(),
    dateDepart: z.string().optional(),
    dateDebut: z.string().optional(),
    dateFin: z.string().optional(),
    nombrePersonnes: z.coerce.number().int().positive()
  }).superRefine((data, ctx) => {
    if (!data.idLogement && !data.logementId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Logement requis',
        path: ['idLogement'],
      });
    }
    if (!data.dateDebut && !data.dateArrivee) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date de début requise',
        path: ['dateDebut'],
      });
    }
    if (!data.dateFin && !data.dateDepart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date de fin requise',
        path: ['dateFin'],
      });
    }
  }).transform((data) => ({
    idLogement: data.idLogement ?? data.logementId,
    dateDebut: data.dateDebut ?? data.dateArrivee,
    dateFin: data.dateFin ?? data.dateDepart,
    nombrePersonnes: data.nombrePersonnes,
  })),
  updateReservation: z.object({
    statut: z.string().optional(),
    status: z.string().optional(),
  }).transform((data) => ({
    statut: normalizeReservationStatus(data.statut || data.status),
  })),
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
