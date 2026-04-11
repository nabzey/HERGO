const reservationService = require('../services/reservation.service');

// Récupérer toutes les réservations
const getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations(req.user.id, req.user.role, req.query);
    res.status(200).json({ reservations });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Récupérer une réservation par ID
const getReservationById = async (req, res) => {
  try {
    const reservation = await reservationService.getReservationById(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ reservation });
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    res.status(404).json({ message: error.message });
  }
};

// Créer une réservation (voyageur only)
const createReservation = async (req, res) => {
  try {
    const reservation = await reservationService.createReservation(req.body, req.user.id);
    res.status(201).json({
      message: 'Réservation créée',
      reservation,
    });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour le statut d'une réservation
const updateReservationStatus = async (req, res) => {
  try {
    const reservation = await reservationService.updateReservationStatus(req.params.id, req.body.statut, req.user.id, req.user.role);
    res.status(200).json({
      message: 'Statut de la réservation mis à jour',
      reservation,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    res.status(400).json({ message: error.message });
  }
};

// Annuler une réservation
const cancelReservation = async (req, res) => {
  try {
    const reservation = await reservationService.cancelReservation(req.params.id, req.user.id, req.user.role);
    res.status(200).json({
      message: 'Réservation annulée',
      reservation,
    });
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error);
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une réservation (admin only)
const deleteReservation = async (req, res) => {
  try {
    await reservationService.deleteReservation(req.params.id);
    res.status(200).json({ message: 'Réservation supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservationStatus,
  cancelReservation,
  deleteReservation,
};