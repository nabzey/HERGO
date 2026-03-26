const { prisma } = require('../config/db');

const User = {
  // Récupérer un utilisateur par ID
  findById: async (id) => {
    return await prisma.user.findUnique({ where: { id: parseInt(id) } });
  },

  // Récupérer un utilisateur par email
  findByEmail: async (email) => {
    return await prisma.user.findUnique({ where: { email } });
  },

  // Créer un utilisateur
  create: async (data) => {
    return await prisma.user.create({ data });
  },

  // Mettre à jour un utilisateur
  update: async (id, data) => {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });
  },

  // Supprimer un utilisateur
  delete: async (id) => {
    return await prisma.user.delete({ where: { id: parseInt(id) } });
  },

  // Récupérer tous les utilisateurs
  findAll: async () => {
    return await prisma.user.findMany();
  },
};

module.exports = User;