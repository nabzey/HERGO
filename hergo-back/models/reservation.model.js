const { prisma } = require('../config/db');

const Reservation = {
  // Récupérer une réservation par ID
  findById: async (id) => {
    return await prisma.reservation.findUnique({
      where: { id: parseInt(id) },
      include: {
        voyageur: true,
        logement: true,
      },
    });
  },

  // Créer une réservation
  create: async (data) => {
    return await prisma.reservation.create({
      data,
      include: {
        voyageur: true,
        logement: true,
      },
    });
  },

  // Mettre à jour une réservation
  update: async (id, data) => {
    return await prisma.reservation.update({
      where: { id: parseInt(id) },
      data,
      include: {
        voyageur: true,
        logement: true,
      },
    });
  },

  // Supprimer une réservation
  delete: async (id) => {
    return await prisma.reservation.delete({ where: { id: parseInt(id) } });
  },

  // Récupérer toutes les réservations
  findAll: async (where = {}, include = {}) => {
    return await prisma.reservation.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' },
    });
  },
};

module.exports = Reservation;