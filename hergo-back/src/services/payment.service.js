const { pool } = require('../config/db');
const Stripe = require('stripe');
const env = require('../config/env');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY);

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

  createPaymentIntent: async (reservationId) => {
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

      const amountInCents = Math.round(reservation.prixTotal * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'eur',
        metadata: {
          reservationId: reservationId.toString(),
        },
      });

      await pool.execute(`
        INSERT INTO Payment (idReservation, stripePaymentId, amount, currency, status, createdAt, updatedAt)
        VALUES (?, ?, ?, 'eur', 'EN_ATTENTE', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
      `, [reservationId, paymentIntent.id, reservation.prixTotal]);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: reservationId,
      };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = paymentService;