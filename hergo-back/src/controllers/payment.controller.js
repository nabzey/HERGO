const paymentService = require('../services/payment.service');

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
    const { reservationId } = req.body;
    const result = await paymentService.createPaymentIntent(reservationId);
    res.status(201).json(result);
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPaymentIntent,
};
