const authService = require('../services/auth.service');

// Inscription
const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      message: 'Inscription réussie',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(400).json({ message: error.message });
  }
};

// Connexion
const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      message: 'Connexion réussie',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(400).json({ message: error.message });
  }
};

// Récupérer les informations de l'utilisateur connecté
const getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};