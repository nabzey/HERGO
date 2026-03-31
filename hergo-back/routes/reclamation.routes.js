const express = require('express');
const { getAllReclamations, getReclamationById, createReclamation, updateReclamation, deleteReclamation } = require('../controllers/reclamation.controller');
const { authMiddleware } = require('../core/middlewares/auth.middleware');
const { validate } = require('../helpers/validation');

const router = express.Router();

// Récupérer les réclamations de l'utilisateur connecté
router.get('/my', authMiddleware, getAllReclamations);

// Récupérer toutes les réclamations (admin)
router.get('/', authMiddleware, getAllReclamations);

// Récupérer une réclamation par ID
router.get('/:id', authMiddleware, getReclamationById);

// Créer une réclamation
router.post('/', authMiddleware, validate('createReclamation'), createReclamation);

// Mettre à jour une réclamation
router.put('/:id', authMiddleware, validate('updateReclamation'), updateReclamation);

// Supprimer une réclamation
router.delete('/:id', authMiddleware, deleteReclamation);

module.exports = router;