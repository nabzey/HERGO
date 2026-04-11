const { prisma } = require('../config/prisma');

const LogementRepository = {
  // Récupérer un logement par ID
  findById: async (id) => {
    return await prisma.logement.findUnique({
      where: { id: parseInt(id) },
      include: {
        proprietaire: true,
        images: true,
        equipements: true,
        espaces: true,
        reviews: true,
      },
    });
  },

  // Créer un logement
  create: async (data) => {
    return await prisma.logement.create({
      data: {
        titre: data.titre,
        description: data.description,
        prixJour: data.prix,
        capacite: data.capacite,
        adresse: data.adresse,
        ville: data.ville,
        pays: data.pays || 'France',
        longitude: data.longitude,
        latitude: data.latitude,
        statut: data.statut || 'PUBLIE',
        idProprietaire: data.proprietaireId,
      },
      include: {
        proprietaire: true,
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
      data: {
        titre: data.titre,
        description: data.description,
        prixJour: data.prix,
        capacite: data.capacite,
        adresse: data.adresse,
        ville: data.ville,
        pays: data.pays,
        longitude: data.longitude,
        latitude: data.latitude,
        statut: data.statut,
      },
      include: {
        proprietaire: true,
        images: true,
        equipements: true,
        espaces: true,
      },
    });
  },

  // Supprimer un logement
  delete: async (id) => {
    await prisma.logement.delete({ where: { id: parseInt(id) } });
    return { id: parseInt(id) };
  },

  // Récupérer tous les logements
  findAll: async (where = {}) => {
    return await prisma.logement.findMany({
      where,
      include: {
        proprietaire: true,
        images: true,
        equipements: true,
        espaces: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};

module.exports = LogementRepository;