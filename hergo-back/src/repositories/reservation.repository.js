const { prisma } = require('../config/prisma');

const ReservationRepository = {
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
      data: {
        voyageurId: data.voyageurId,
        logementId: data.logementId,
        dateArrivee: new Date(data.dateArrivee),
        dateDepart: new Date(data.dateDepart),
        nombrePersonnes: data.nombrePersonnes,
        message: data.message,
        statut: data.statut || 'EN_ATTENTE',
      },
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
      data: {
        dateArrivee: data.dateArrivee ? new Date(data.dateArrivee) : undefined,
        dateDepart: data.dateDepart ? new Date(data.dateDepart) : undefined,
        nombrePersonnes: data.nombrePersonnes,
        message: data.message,
        statut: data.statut,
      },
      include: {
        voyageur: true,
        logement: true,
      },
    });
  },

  // Supprimer une réservation
  delete: async (id) => {
    await prisma.reservation.delete({ where: { id: parseInt(id) } });
    return { id: parseInt(id) };
  },

  // Récupérer toutes les réservations
  findAll: async (where = {}) => {
    return await prisma.reservation.findMany({
      where,
      include: {
        voyageur: true,
        logement: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};

module.exports = ReservationRepository;