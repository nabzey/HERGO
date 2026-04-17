const bcrypt = require('bcrypt');

const passwordHelper = {
  // Hashage d'un mot de passe
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  },

  // Comparaison d'un mot de passe en clair avec un mot de passe hashé
  comparePassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },

  // Vérification de la force d'un mot de passe
  isPasswordStrong: (password) => {
    return typeof password === 'string' && password.trim().length >= 8;
  },
};

module.exports = passwordHelper;
