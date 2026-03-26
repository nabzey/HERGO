const { prisma } = require('../config/db');

const Logement = {
  // Récupérer un logement par ID
  findById: async (id) => {
    return await prisma.logement.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: true,
        equipements: true,
        espaces: true,
        reviews: true,
        proprietaire: true,
      },
    });
  },

  // Créer un logement
  create: async (data) => {
    return await prisma.logement.create({
      data,
      include: {
        images: true,
        equipements: true,
        espaces: true,
      },
    });
  },

  // Mettre à jour un logement
  update: async (id, data) => {
    return await prisma.logement.update({
      where: { id: parseInt(id) },
      data,
      include: {
        images: true,
        equipements: true,
        espaces: true,
      },
    });
  },

  // Supprimer un logement
  delete: async (id) => {
    return await prisma.logement.delete({ where: { id: parseInt(id) } });
  },

  // Récupérer tous les logements
  findAll: async (where = {}, include = {}) => {
    return await prisma.logement.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' },
    });
  },
};

module.exports = Logement;