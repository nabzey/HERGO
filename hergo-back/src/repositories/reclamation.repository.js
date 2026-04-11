const { prisma } = require('../config/prisma');

const ReclamationRepository = {
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
      data: {
        sujet: data.sujet,
        description: data.description,
        statut: data.statut || 'EN_ATTENTE',
        voyageurId: data.voyageurId,
        logementId: data.logementId,
      },
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
      data: {
        sujet: data.sujet,
        description: data.description,
        statut: data.statut,
      },
      include: {
        voyageur: true,
        logement: true,
      },
    });
  },

  // Supprimer une réclamation
  delete: async (id) => {
    await prisma.reclamation.delete({ where: { id: parseInt(id) } });
    return { id: parseInt(id) };
  },

  // Récupérer toutes les réclamations
  findAll: async (where = {}) => {
    return await prisma.reclamation.findMany({
      where,
      include: {
        voyageur: true,
        logement: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};

module.exports = ReclamationRepository;