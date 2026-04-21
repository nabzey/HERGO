const logementService = require('../services/logement.service');

// Récupérer tous les logements
const getAllLogements = async (req, res) => {
  try {
    const logements = await logementService.getAllLogements(req.query);
    res.status(200).json({ logements });
  } catch (error) {
    console.error('Erreur lors de la récupération des logements:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Récupérer un logement par ID
const getLogementById = async (req, res) => {
  try {
    const logement = await logementService.getLogementById(req.params.id);
    res.status(200).json({ logement });
  } catch (error) {
    console.error('Erreur lors de la récupération du logement:', error);
    res.status(404).json({ message: error.message });
  }
};

// Créer un logement (hôte only)
const createLogement = async (req, res) => {
  try {
    const logement = await logementService.createLogement(req.body, req.user.id);
    res.status(201).json({
      message: 'Logement créé',
      logement,
    });
  } catch (error) {
    console.error('Erreur lors de la création du logement:', error);
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un logement
const updateLogement = async (req, res) => {
  try {
    const logement = await logementService.updateLogement(req.params.id, req.body, req.user.id, req.user.role);
    res.status(200).json({
      message: 'Logement mis à jour',
      logement,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du logement:', error);
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un logement
const deleteLogement = async (req, res) => {
  try {
    await logementService.deleteLogement(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ message: 'Logement supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du logement:', error);
    res.status(400).json({ message: error.message });
  }
};

const uploadLogementImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }

    const image = await logementService.uploadLogementImage(
      req.params.id,
      req.file,
      req.user.id,
      req.user.role
    );

    res.status(201).json({
      message: 'Image uploadée',
      image,
    });
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    res.status(400).json({ message: error.message });
  }
};

// Gérer les images d'un logement
const manageImages = async (req, res) => {
  try {
    const logement = await logementService.manageImages(req.params.id, req.body.images, req.user.id, req.user.role);
    res.status(200).json({
      message: 'Images mises à jour',
      logement,
    });
  } catch (error) {
    console.error('Erreur lors de la gestion des images:', error);
    res.status(400).json({ message: error.message });
  }
};

// Gérer les équipements d'un logement
const manageEquipements = async (req, res) => {
  try {
    const logement = await logementService.manageEquipements(req.params.id, req.body.equipements, req.user.id, req.user.role);
    res.status(200).json({
      message: 'Équipements mis à jour',
      logement,
    });
  } catch (error) {
    console.error('Erreur lors de la gestion des équipements:', error);
    res.status(400).json({ message: error.message });
  }
};

// Gérer les espaces d'un logement
const manageEspaces = async (req, res) => {
  try {
    const logement = await logementService.manageEspaces(req.params.id, req.body.espaces, req.user.id, req.user.role);
    res.status(200).json({
      message: 'Espaces mis à jour',
      logement,
    });
  } catch (error) {
    console.error('Erreur lors de la gestion des espaces:', error);
    res.status(400).json({ message: error.message });
  }
};

// Récupérer les logements de l'utilisateur connecté
const getMyLogements = async (req, res) => {
  try {
    const logements = await logementService.getMyLogements(req.user.id);
    res.status(200).json({ logements });
  } catch (error) {
    console.error('Erreur lors de la récupération de vos logements:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = {
  getAllLogements,
  getLogementById,
  createLogement,
  updateLogement,
  deleteLogement,
  uploadLogementImage,
  manageImages,
  manageEquipements,
  manageEspaces,
  getMyLogements,
};
