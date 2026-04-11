const adminService = require('../services/admin.service');
const reservationService = require('../services/reservation.service');
const reclamationService = require('../services/reclamation.service');

// Statistiques
const getStatistics = async (req, res) => {
  try {
    const statistics = await adminService.getStatistics();
    res.status(200).json({ statistics });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(404).json({ message: error.message });
  }
};

const updateUserRoleOrStatus = async (req, res) => {
  try {
    const user = await adminService.updateUserRoleOrStatus(req.params.id, req.body);
    res.status(200).json({
      message: 'Utilisateur mis à jour',
      user,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(404).json({ message: error.message });
  }
};

// Logements
const getAllLogements = async (req, res) => {
  try {
    const logements = await adminService.getAllLogements();
    res.status(200).json({ logements });
  } catch (error) {
    console.error('Erreur lors de la récupération des logements:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

const updateLogementStatus = async (req, res) => {
  try {
    const logement = await adminService.updateLogementStatus(req.params.id, req.body.statut);
    res.status(200).json({
      message: 'Statut du logement mis à jour',
      logement,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut du logement:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteLogement = async (req, res) => {
  try {
    await adminService.deleteLogement(req.params.id);
    res.status(200).json({ message: 'Logement supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du logement:', error);
    res.status(404).json({ message: error.message });
  }
};

// Réservations
const getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations(req.user.id, req.user.role, req.query);
    res.status(200).json({ reservations });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Réclamations
const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await reclamationService.getAllReclamations(req.user.id, req.user.role, req.query);
    res.status(200).json({ reclamations });
  } catch (error) {
    console.error('Erreur lors de la récupération des réclamations:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

const updateReclamationStatus = async (req, res) => {
  try {
    const reclamation = await reclamationService.updateReclamation(req.params.id, req.body, req.user.id, req.user.role);
    res.status(200).json({
      message: 'Statut de la réclamation mis à jour',
      reclamation,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réclamation:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteReclamation = async (req, res) => {
  try {
    await reclamationService.deleteReclamation(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ message: 'Réclamation supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réclamation:', error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getStatistics,
  getAllUsers,
  getUserById,
  updateUserRoleOrStatus,
  deleteUser,
  getAllLogements,
  updateLogementStatus,
  deleteLogement,
  getAllReservations,
  getAllReclamations,
  updateReclamationStatus,
  deleteReclamation,
};