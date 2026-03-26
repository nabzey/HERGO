const { pool } = require('../config/db');
const passwordHelper = require('../helpers/password.helper');
const { generateToken } = require('../config/jwt');
const emailHelper = require('../helpers/email.helper');

const authService = {
  // Inscription
  register: async (data) => {
    try {
      const { firstName, lastName, email, password, phone, role = 'VOYAGEUR' } = data;

      // Vérifier si l'utilisateur existe déjà
      const [existingUsers] = await pool.execute('SELECT * FROM User WHERE email = ?', [email]);
      if (existingUsers.length > 0) {
        throw new Error('Email déjà utilisé');
      }

      // Vérifier la force du mot de passe
      if (!passwordHelper.isPasswordStrong(password)) {
        throw new Error('Mot de passe trop faible');
      }

      // Hacher le mot de passe
      const hashedPassword = await passwordHelper.hashPassword(password);

      // Créer l'utilisateur
      const [result] = await pool.execute(
        'INSERT INTO User (firstName, lastName, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, hashedPassword, phone, role]
      );

      const user = {
        id: result.insertId,
        firstName,
        lastName,
        email,
        role,
        status: 'ACTIF',
        phone,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Envoyer email de confirmation
      await emailHelper.sendRegistrationEmail(email, firstName);

      // Générer le token JWT
      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      return { user, token };
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
        throw new Error('Email ou mot de passe incorrect');
      }

      const user = users[0];

      // Vérifier le mot de passe
      const isPasswordValid = await passwordHelper.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Vérifier le statut de l'utilisateur
      if (user.status === 'SUSPENDU') {
        throw new Error('Compte suspendue');
      }

      // Générer le token JWT
      const token = generateToken({ id: user.id, email: user.email, role: user.role });

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
      };
    } catch (error) {
      throw error;
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
        throw new Error('Utilisateur non trouvé');
      }

      return users[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = authService;