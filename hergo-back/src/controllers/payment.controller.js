const paymentService = require('../services/payment.service');
const { pool } = require('../config/db');

const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json({ payments });
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    res.status(200).json({ payment });
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement:', error);
    res.status(404).json({ message: error.message });
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const { reservationId, paymentType = 'total' } = req.body;
    const result = await paymentService.createPaymentIntent(reservationId, paymentType);
    res.status(201).json(result);
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    res.status(400).json({ message: error.message });
  }
};

const getPaymentAmount = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const [reservations] = await pool.execute(
      'SELECT prixTotal FROM Reservation WHERE id = ?',
      [reservationId]
    );
    
    if (reservations.length === 0) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    
    const prixTotal = reservations[0].prixTotal;
    res.status(200).json({
      total: prixTotal,
      acompte: Math.round(prixTotal * 0.3),
      remainingAfterAcompte: Math.round(prixTotal * 0.7),
    });
  } catch (error) {
    console.error('Erreur lors du calcul du montant:', error);
    res.status(500).json({ message: error.message });
  }
};

const simulateMobileMoney = async (req, res) => {
  try {
    const { reservationId, amount, method, phoneNumber } = req.body;
    const result = await paymentService.simulateMobileMoney(reservationId, amount, method, phoneNumber);
    res.status(200).json(result);
  } catch (error) {
    console.error('Erreur lors de la simulation du paiement:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPaymentIntent,
  getPaymentAmount,
  simulateMobileMoney,
};
