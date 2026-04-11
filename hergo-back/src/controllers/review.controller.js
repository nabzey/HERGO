const reviewService = require('../services/review.service');

// Récupérer tous les avis d'un logement
const getReviewsByLogement = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByLogement(req.params.idLogement);
    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Récupérer un avis par ID
const getReviewById = async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    res.status(200).json({ review });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'avis:', error);
    res.status(404).json({ message: error.message });
  }
};

// Créer un avis (voyageur only)
const createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.body, req.user.id);
    res.status(201).json({
      message: 'Avis créé',
      review,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'avis:', error);
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un avis
const updateReview = async (req, res) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.body, req.user.id, req.user.role);
    res.status(200).json({
      message: 'Avis mis à jour',
      review,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'avis:', error);
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un avis
const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ message: 'Avis supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getReviewsByLogement,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};