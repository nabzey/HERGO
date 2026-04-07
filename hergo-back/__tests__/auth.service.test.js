const authService = require('../services/auth.service');
const { pool } = require('../config/db');
const passwordHelper = require('../helpers/password.helper');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');
const emailHelper = require('../helpers/email.helper');
const smsHelper = require('../helpers/sms.helper');
const { AuthenticationError, ConflictError, NotFoundError } = require('../helpers/errors');

// Mock des dépendances
jest.mock('../config/db', () => ({
  pool: {
    execute: jest.fn()
  }
}));

jest.mock('../helpers/password.helper', () => ({
  isPasswordStrong: jest.fn(),
  hashPassword: jest.fn(),
  comparePassword: jest.fn()
}));

jest.mock('../config/jwt', () => ({
  generateToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  verifyRefreshToken: jest.fn()
}));

jest.mock('../helpers/email.helper', () => ({
  sendRegistrationEmail: jest.fn()
}));

jest.mock('../helpers/sms.helper', () => ({
  sendRegistrationSms: jest.fn()
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('devrait inscrire un nouvel utilisateur avec succès', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'Voyageur'
      };

      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'VOYAGEUR',
        status: 'ACTIF',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      pool.execute
        .mockResolvedValueOnce([[]]) // Vérification email existant
        .mockResolvedValueOnce([{ insertId: 1 }]); // Insertion utilisateur

      passwordHelper.isPasswordStrong.mockReturnValue(true);
      passwordHelper.hashPassword.mockResolvedValue('hashedPassword');
      generateToken.mockReturnValue('mockToken');
      generateRefreshToken.mockReturnValue('mockRefreshToken');
      emailHelper.sendRegistrationEmail.mockResolvedValue(true);
      smsHelper.sendRegistrationSms.mockResolvedValue(true);

      const result = await authService.register(userData);

      expect(pool.execute).toHaveBeenCalledTimes(2);
      expect(passwordHelper.isPasswordStrong).toHaveBeenCalledWith('Password123!');
      expect(passwordHelper.hashPassword).toHaveBeenCalledWith('Password123!');
      expect(generateToken).toHaveBeenCalled();
      expect(generateRefreshToken).toHaveBeenCalled();
      expect(emailHelper.sendRegistrationEmail).toHaveBeenCalledWith('john@example.com', 'John');
      expect(smsHelper.sendRegistrationSms).toHaveBeenCalledWith(null, 'John');
      expect(result.user.role).toBe('VOYAGEUR');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
    });

    it('devrait rejeter un email déjà utilisé', async () => {
      const userData = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'Password123!'
      };

      pool.execute.mockResolvedValueOnce([[{ id: 1 }]]); // Email existant

      await expect(authService.register(userData)).rejects.toThrow(ConflictError);
      expect(pool.execute).toHaveBeenCalledTimes(1);
    });

    it('devrait rejeter un mot de passe trop faible', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak'
      };

      pool.execute.mockResolvedValueOnce([[]]); // Email non existant
      passwordHelper.isPasswordStrong.mockReturnValue(false);

      await expect(authService.register(userData)).rejects.toThrow(AuthenticationError);
      expect(passwordHelper.isPasswordStrong).toHaveBeenCalledWith('weak');
    });
  });

  describe('login', () => {
    it('devrait connecter un utilisateur avec succès', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'Password123!'
      };

      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'Voyageur',
        status: 'ACTIF',
        phone: null,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      pool.execute.mockResolvedValueOnce([[mockUser]]);
      passwordHelper.comparePassword.mockResolvedValue(true);
      generateToken.mockReturnValue('mockToken');
      generateRefreshToken.mockReturnValue('mockRefreshToken');

      const result = await authService.login(loginData);

      expect(pool.execute).toHaveBeenCalledTimes(1);
      expect(passwordHelper.comparePassword).toHaveBeenCalledWith('Password123!', 'hashedPassword');
      expect(generateToken).toHaveBeenCalled();
      expect(generateRefreshToken).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
    });

    it('devrait rejeter un email incorrect', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'Password123!'
      };

      pool.execute.mockResolvedValueOnce([[]]); // Utilisateur non trouvé

      await expect(authService.login(loginData)).rejects.toThrow(AuthenticationError);
    });

    it('devrait rejeter un mot de passe incorrect', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'WrongPassword'
      };

      const mockUser = {
        id: 1,
        email: 'john@example.com',
        password: 'hashedPassword',
        status: 'ACTIF'
      };

      pool.execute.mockResolvedValueOnce([[mockUser]]);
      passwordHelper.comparePassword.mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow(AuthenticationError);
    });

    it('devrait rejeter un compte suspendu', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'Password123!'
      };

      const mockUser = {
        id: 1,
        email: 'john@example.com',
        password: 'hashedPassword',
        status: 'SUSPENDU'
      };

      pool.execute.mockResolvedValueOnce([[mockUser]]);
      passwordHelper.comparePassword.mockResolvedValue(true);

      await expect(authService.login(loginData)).rejects.toThrow(AuthenticationError);
    });
  });

  describe('refreshToken', () => {
    it('devrait rafraîchir le token avec succès', async () => {
      const refreshToken = 'validRefreshToken';
      const decoded = { id: 1 };

      verifyRefreshToken.mockReturnValue(decoded);
      pool.execute.mockResolvedValueOnce([[{ id: 1, email: 'john@example.com', role: 'VOYAGEUR' }]]);
      generateToken.mockReturnValue('newToken');
      generateRefreshToken.mockReturnValue('newRefreshToken');

      const result = await authService.refreshToken(refreshToken);

      expect(verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(pool.execute).toHaveBeenCalledTimes(1);
      expect(generateToken).toHaveBeenCalled();
      expect(generateRefreshToken).toHaveBeenCalled();
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
    });

    it('devrait rejeter un refresh token invalide', async () => {
      const refreshToken = 'invalidRefreshToken';

      verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(AuthenticationError);
    });
  });

  describe('getCurrentUser', () => {
    it('devrait récupérer les informations de l\'utilisateur', async () => {
      const userId = 1;
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'Voyageur',
        status: 'ACTIF',
        phone: null,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      pool.execute.mockResolvedValueOnce([[mockUser]]);

      const result = await authService.getCurrentUser(userId);

      expect(pool.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });

    it('devrait rejeter si l\'utilisateur n\'existe pas', async () => {
      const userId = 999;

      pool.execute.mockResolvedValueOnce([[]]);

      await expect(authService.getCurrentUser(userId)).rejects.toThrow(NotFoundError);
    });
  });
});
