const { prisma } = require('../config/db');

const Reclamation = {
  // Récupérer une réclamation par ID
  findById: async (id) => {
    return await prisma.reclamation.findUnique({
      where: { id: parseInt(id) },
      include: {
        voyageur: true,
        logement: true,
      },
    });
  },

  // Créer une réclamation
  create: async (data) => {
    return await prisma.reclamation.create({
      data,
      include: {
        voyageur: true,
        logement: true,
      },
    });
  },

  // Mettre à jour une réclamation
  update: async (id, data) => {
    return await prisma.reclamation.update({
      where: { id: parseInt(id) },
      data,
      include: {
        voyageur: true,
        logement: true,
      },
    });
  },

  // Supprimer une réclamation
  delete: async (id) => {
    return await prisma.reclamation.delete({ where: { id: parseInt(id) } });
  },

  // Récupérer toutes les réclamations
  findAll: async (where = {}, include = {}) => {
    return await prisma.reclamation.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' },
    });
  },
};

module.exports = Reclamation;