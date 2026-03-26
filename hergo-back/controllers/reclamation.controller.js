const reclamationService = require('../services/reclamation.service');

// Récupérer toutes les réclamations
const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await reclamationService.getAllReclamations(req.user.id, req.user.role, req.query);
    res.status(200).json({ reclamations });
  } catch (error) {
    console.error('Erreur lors de la récupération des réclamations:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Récupérer une réclamation par ID
const getReclamationById = async (req, res) => {
  try {
    const reclamation = await reclamationService.getReclamationById(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ reclamation });
  } catch (error) {
    console.error('Erreur lors de la récupération de la réclamation:', error);
    res.status(404).json({ message: error.message });
  }
};

// Créer une réclamation
const createReclamation = async (req, res) => {
  try {
    const reclamation = await reclamationService.createReclamation(req.body, req.user.id);
    res.status(201).json({
      message: 'Réclamation créée',
      reclamation,
    });
  } catch (error) {
    console.error('Erreur lors de la création de la réclamation:', error);
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour une réclamation
const updateReclamation = async (req, res) => {
  try {
    const reclamation = await reclamationService.updateReclamation(req.params.id, req.body, req.user.id, req.user.role);
    res.status(200).json({
      message: 'Réclamation mise à jour',
      reclamation,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réclamation:', error);
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une réclamation
const deleteReclamation = async (req, res) => {
  try {
    await reclamationService.deleteReclamation(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ message: 'Réclamation supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réclamation:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllReclamations,
  getReclamationById,
  createReclamation,
  updateReclamation,
  deleteReclamation,
};