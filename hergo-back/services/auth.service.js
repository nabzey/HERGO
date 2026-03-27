const { pool } = require('../config/db');
const passwordHelper = require('../helpers/password.helper');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');
const emailHelper = require('../helpers/email.helper');
const { AuthenticationError, ConflictError, NotFoundError } = require('../helpers/errors');

const authService = {
  // Inscription
  register: async (data) => {
    try {
      const { name, email, password, role = 'Voyageur' } = data;
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      // Vérifier si l'utilisateur existe déjà
      const [existingUsers] = await pool.execute('SELECT * FROM User WHERE email = ?', [email]);
      if (existingUsers.length > 0) {
        throw new ConflictError('Email déjà utilisé');
      }

      // Vérifier la force du mot de passe
      if (!passwordHelper.isPasswordStrong(password)) {
        throw new AuthenticationError('Mot de passe trop faible');
      }

      // Hacher le mot de passe
      const hashedPassword = await passwordHelper.hashPassword(password);

      // Créer l'utilisateur
      const [result] = await pool.execute(
        'INSERT INTO User (firstName, lastName, email, password, role, updatedAt) VALUES (?, ?, ?, ?, ?, NOW())',
        [firstName, lastName, email, hashedPassword, role]
      );

      const user = {
        id: result.insertId,
        firstName,
        lastName,
        email,
        role,
        status: 'ACTIF',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Envoyer email de confirmation
      await emailHelper.sendRegistrationEmail(email, firstName);

      // Générer les tokens JWT
      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      const refreshToken = generateRefreshToken({ id: user.id });

      return { user, token, refreshToken };
    } catch (error) {
      throw error;
    }
  },

  // Connexion
  login: async (data) => {
    try {
      const { email, password } = data;

      // Vérifier si l'utilisateur existe
      const [users] = await pool.execute('SELECT * FROM User WHERE email = ?', [email]);
      if (users.length === 0) {
        throw new AuthenticationError('Email ou mot de passe incorrect');
      }

      const user = users[0];

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
      
      const [users] = await pool.execute(
        'SELECT id, email, role FROM User WHERE id = ?',
        [decoded.id]
      );

      if (users.length === 0) {
        throw new AuthenticationError('Utilisateur non trouvé');
      }

      const user = users[0];
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
      const [users] = await pool.execute(
        'SELECT id, firstName, lastName, email, role, status, phone, avatar, createdAt, updatedAt FROM User WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        throw new NotFoundError('Utilisateur non trouvé');
      }

      return users[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = authService;