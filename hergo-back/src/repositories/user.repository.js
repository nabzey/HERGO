const { prisma } = require('../config/prisma');

const UserRepository = {
  // Récupérer un utilisateur par ID
  findById: async (id) => {
    return await prisma.user.findUnique({ where: { id: parseInt(id) } });
  },

  // Récupérer un utilisateur par email
  findByEmail: async (email) => {
    return await prisma.user.findUnique({ where: { email } });
  },

  findByPhone: async (phone) => {
    if (!phone) {
      return null;
    }

    return await prisma.user.findFirst({ where: { phone } });
  },

  // Créer un utilisateur
  create: async (data) => {
    return await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role || 'VOYAGEUR',
        status: data.status || 'ACTIF',
        phone: data.phone,
        avatar: data.avatar,
      },
    });
  },

  // Mettre à jour un utilisateur
  update: async (id, data) => {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: { ...data },
    });
  },

  // Supprimer un utilisateur
  delete: async (id) => {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    return { id: parseInt(id) };
  },

  // Récupérer tous les utilisateurs
  findAll: async () => {
    return await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  },
};

module.exports = UserRepository;
