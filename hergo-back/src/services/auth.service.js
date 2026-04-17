const UserRepository = require('../repositories/user.repository');
const passwordHelper = require('../utils/password.helper');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');
const emailHelper = require('../utils/email.helper');
const smsHelper = require('../utils/sms.helper');
const env = require('../config/env');
const { AuthenticationError, ConflictError, NotFoundError } = require('../utils/errors');

const normalizeRole = (role = 'VOYAGEUR') => {
  const roleMap = {
    Voyageur: 'VOYAGEUR',
    Hôte: 'HOTE',
    Admin: 'ADMIN',
    VOYAGEUR: 'VOYAGEUR',
    HOTE: 'HOTE',
    ADMIN: 'ADMIN',
  };

  return roleMap[role] || 'VOYAGEUR';
};

const normalizePhone = ({ phone, phoneCountryCode, phoneNationalNumber }) => {
  if (phoneNationalNumber) {
    const countryCode = String(phoneCountryCode || '').replace(/[^\d]/g, '');
    const nationalNumber = String(phoneNationalNumber).replace(/[^\d]/g, '');

    if (!nationalNumber) {
      return null;
    }

    return `${countryCode ? `+${countryCode}` : ''}${nationalNumber}`;
  }

  if (!phone) {
    return null;
  }

  const cleaned = String(phone).replace(/[^\d+]/g, '');
  return cleaned || null;
};

const buildContinuationLink = (email, role) => {
  const baseUrl = env.FRONTEND_URL || 'http://localhost:5173';
  const params = new URLSearchParams({
    email,
    role,
    source: 'registration',
  });

  return `${baseUrl.replace(/\/$/, '')}/connexion?${params.toString()}`;
};

const authService = {
  // Inscription
  register: async (data) => {
    try {
      const { name, email, password, role = 'VOYAGEUR' } = data;
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      const normalizedRole = normalizeRole(role);
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhone = normalizePhone(data);

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await UserRepository.findByEmail(normalizedEmail);
      if (existingUser) {
        throw new ConflictError('Email déjà utilisé');
      }

      if (normalizedPhone) {
        const existingPhoneUser = await UserRepository.findByPhone(normalizedPhone);
        if (existingPhoneUser) {
          throw new ConflictError('Numéro de téléphone déjà utilisé');
        }
      }

      // Vérifier la force du mot de passe
      if (!passwordHelper.isPasswordStrong(password)) {
        throw new AuthenticationError('Mot de passe trop faible: minimum 8 caractères');
      }

      // Hacher le mot de passe
      const hashedPassword = await passwordHelper.hashPassword(password);

      // Créer l'utilisateur
      const user = await UserRepository.create({
        firstName,
        lastName,
        email: normalizedEmail,
        password: hashedPassword,
        role: normalizedRole,
        phone: normalizedPhone,
        status: 'ACTIF',
      });

      const continuationLink = buildContinuationLink(normalizedEmail, normalizedRole);

      // Envoyer email/SMS avec lien de poursuite
      await emailHelper.sendRegistrationEmail(normalizedEmail, firstName, continuationLink);
      await smsHelper.sendRegistrationSms(normalizedPhone, firstName, continuationLink);

      // Générer les tokens JWT
      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      const refreshToken = generateRefreshToken({ id: user.id });

      return { user, token, refreshToken, continuationLink };
    } catch (error) {
      throw error;
    }
  },

  // Connexion
  login: async (data) => {
    try {
      const { email, password } = data;

      // Vérifier si l'utilisateur existe
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new AuthenticationError('Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await passwordHelper.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Email ou mot de passe incorrect');
      }

      // Vérifier le statut de l'utilisateur
      if (user.status === 'SUSPENDU') {
        throw new AuthenticationError('Compte suspendu');
      }

      // Générer les tokens JWT
      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      const refreshToken = generateRefreshToken({ id: user.id });

      return {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          phone: user.phone,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  },

  // Rafraîchir le token
  refreshToken: async (refreshToken) => {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      
      const user = await UserRepository.findById(decoded.id);

      if (!user) {
        throw new AuthenticationError('Utilisateur non trouvé');
      }

      const newToken = generateToken({ id: user.id, email: user.email, role: user.role });
      const newRefreshToken = generateRefreshToken({ id: user.id });

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new AuthenticationError('Refresh token invalide');
    }
  },

  // Récupérer les informations de l'utilisateur connecté
  getCurrentUser: async (userId) => {
    try {
      const user = await UserRepository.findById(userId);

      if (!user) {
        throw new NotFoundError('Utilisateur non trouvé');
      }

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = authService;
