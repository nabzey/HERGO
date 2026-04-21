const authService = require('../services/auth.service');
const { AuthenticationError } = require('../helpers/errors');

// Inscription
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      message: 'Inscription réussie',
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken,
      continuationLink: result.continuationLink,
    });
  } catch (error) {
    next(error);
  }
};

// Connexion
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      message: 'Connexion réussie',
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// Rafraîchir le token
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      throw new AuthenticationError('Refresh token requis');
    }
    const result = await authService.refreshToken(token);
    res.status(200).json({
      message: 'Token rafraîchi',
      token: result.token,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer les informations de l'utilisateur connecté
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Mot de passe oublié
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Vérifier OTP
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Réinitialiser le mot de passe
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPassword(email, otp, newPassword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  getCurrentUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
