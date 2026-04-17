const { pool } = require('../config/db');
const Stripe = require('stripe');
const env = require('../config/env');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY);
const DEPOSIT_PERCENTAGE = 0.30; // 30% de acompte

const paymentService = {
  getAllPayments: async () => {
    try {
      const [payments] = await pool.execute(`
        SELECT p.*,
               r.id as reservationId, r.dateDebut, r.dateFin, r.prixTotal,
               u.id as voyageurId, u.firstName, u.lastName, u.email
        FROM Payment p
        LEFT JOIN Reservation r ON p.idReservation = r.id
        LEFT JOIN User u ON r.idVoyageur = u.id
        ORDER BY p.createdAt DESC
      `);
      return payments;
    } catch (error) {
      throw error;
    }
  },

  getPaymentById: async (id) => {
    try {
      const [payments] = await pool.execute(`
        SELECT p.*,
               r.id as reservationId, r.dateDebut, r.dateFin, r.prixTotal,
               u.id as voyageurId, u.firstName, u.lastName, u.email
        FROM Payment p
        LEFT JOIN Reservation r ON p.idReservation = r.id
        LEFT JOIN User u ON r.idVoyageur = u.id
        WHERE p.id = ?
      `, [id]);

      if (payments.length === 0) {
        throw new Error('Paiement non trouvé');
      }
      return payments[0];
    } catch (error) {
      throw error;
    }
  },

  getPaymentByReservation: async (reservationId) => {
    try {
      const [payments] = await pool.execute(`
        SELECT p.*,
               r.id as reservationId, r.dateDebut, r.dateFin, r.prixTotal,
               r.statut as reservationStatut
        FROM Payment p
        LEFT JOIN Reservation r ON p.idReservation = r.id
        WHERE p.idReservation = ?
        ORDER BY p.createdAt DESC
      `, [reservationId]);
      return payments;
    } catch (error) {
      throw error;
    }
  },

  calculatePayment: (prixTotal, paymentType) => {
    if (paymentType === 'acompte') {
      return {
        amount: prixTotal * DEPOSIT_PERCENTAGE,
        totalAmount: prixTotal,
        remainingAmount: prixTotal * (1 - DEPOSIT_PERCENTAGE),
        paymentType: 'acompte',
      };
    }
    return {
      amount: prixTotal,
      totalAmount: prixTotal,
      remainingAmount: 0,
      paymentType: 'total',
    };
  },

  createPaymentIntent: async (reservationId, paymentType = 'total') => {
    try {
      const [reservations] = await pool.execute(`
        SELECT r.*, l.titre as logementTitre
        FROM Reservation r
        LEFT JOIN Logement l ON r.idLogement = l.id
        WHERE r.id = ?
      `, [reservationId]);

      if (reservations.length === 0) {
        throw new Error('Réservation non trouvée');
      }

      const reservation = reservations[0];

      if (reservation.statut === 'CONFIRME') {
        throw new Error('Réservation déjà confirmée');
      }

      const paymentInfo = this.calculatePayment(reservation.prixTotal, paymentType);
      const amountInCents = Math.round(paymentInfo.amount * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'eur',
        metadata: {
          reservationId: reservationId.toString(),
          paymentType,
        },
      });

      await pool.execute(`
        INSERT INTO Payment (idReservation, stripePaymentId, amount, currency, status, createdAt, updatedAt)
        VALUES (?, ?, ?, 'eur', 'EN_ATTENTE', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
      `, [reservationId, paymentIntent.id, paymentInfo.amount]);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: reservationId,
        paymentInfo,
      };
    } catch (error) {
      throw error;
    }
  },

  confirmPayment: async (reservationId) => {
    try {
      await pool.execute(`
        UPDATE Payment SET status = 'COMPLETE', updatedAt = CURRENT_TIMESTAMP(3)
        WHERE idReservation = ? AND status = 'EN_ATTENTE'
      `, [reservationId]);

      await pool.execute(`
        UPDATE Reservation SET statut = 'CONFIRME', updatedAt = CURRENT_TIMESTAMP(3)
        WHERE id = ?
      `, [reservationId]);

      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = paymentService;