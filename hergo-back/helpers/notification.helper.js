const { prisma } = require('../config/db');

const notificationHelper = {
  // Créer une notification pour un utilisateur
  createNotification: async (userId, message, type = 'SYSTEM') => {
    try {
      const notification = await prisma.notification.create({
        data: {
          idUser: userId,
          message,
          type,
          lu: false,
        },
      });

      return notification;
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      return null;
    }
  },

  // Créer une notification de réservation
  createReservationNotification: async (userId, reservationDetails) => {
    const message = `Nouvelle réservation pour le logement ${reservationDetails.titre} du ${new Date(reservationDetails.dateDebut).toLocaleDateString()} au ${new Date(reservationDetails.dateFin).toLocaleDateString()}`;
    return await notificationHelper.createNotification(userId, message, 'RESERVATION');
  },

  // Créer une notification de confirmation de réservation
  createReservationConfirmationNotification: async (userId, reservationDetails) => {
    const message = `Votre réservation pour le logement ${reservationDetails.titre} a été confirmée`;
    return await notificationHelper.createNotification(userId, message, 'RESERVATION');
  },

  // Créer une notification d'annulation de réservation
  createReservationCancelationNotification: async (userId, reservationDetails) => {
    const message = `Votre réservation pour le logement ${reservationDetails.titre} a été annulée`;
    return await notificationHelper.createNotification(userId, message, 'RESERVATION');
  },

  // Créer une notification de nouveau message
  createMessageNotification: async (userId, senderName) => {
    const message = `Nouveau message de ${senderName}`;
    return await notificationHelper.createNotification(userId, message, 'MESSAGE');
  },

  // Créer une notification de paiement
  createPaymentNotification: async (userId, paymentDetails) => {
    const message = `Paiement de ${paymentDetails.amount}€ pour la réservation ${paymentDetails.reservationId}`;
    return await notificationHelper.createNotification(userId, message, 'PAIEMENT');
  },
};

module.exports = notificationHelper;