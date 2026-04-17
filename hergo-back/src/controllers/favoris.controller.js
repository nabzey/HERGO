const favorisService = require('../services/favoris.service');

const getAllFavoris = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favoris = await favorisService.getAll(userId);
    res.json(favoris);
  } catch (error) {
    next(error);
  }
};

const addFavori = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { idLogement } = req.body;
    
    if (!idLogement) {
      return res.status(400).json({ message: 'ID du logement requis' });
    }
    
    const result = await favorisService.add(userId, idLogement);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const removeFavori = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { idLogement } = req.params;
    
    const result = await favorisService.remove(userId, idLogement);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const checkFavori = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { idLogement } = req.params;
    
    const isFavori = await favorisService.check(userId, idLogement);
    res.json({ isFavori });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFavoris,
  addFavori,
  removeFavori,
  checkFavori
};