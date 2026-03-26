const { prisma } = require('../config/db');
const passwordHelper = require('../helpers/password.helper');
const reservationService = require('../services/reservation.service');
const reviewService = require('../services/review.service');
const notificationService = require('../services/notification.service');

// Récupérer le profil de l'utilisateur connecté
const getMyProfile = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Mettre à jour le profil de l'utilisateur connecté
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        phone,
        avatar,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: 'Profil mis à jour',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour le mot de passe de l'utilisateur connecté
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Vérifier le mot de passe actuel
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isCurrentPasswordValid = await passwordHelper.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Mot de passe actuel incorrect');
    }

    // Vérifier la force du nouveau mot de passe
    if (!passwordHelper.isPasswordStrong(newPassword)) {
      throw new Error('Mot de passe trop faible');
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await passwordHelper.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Mot de passe mis à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    res.status(400).json({ message: error.message });
  }
};

// Récupérer les réservations de l'utilisateur connecté
const getMyReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations(req.user.id, req.user.role, req.query);
    res.status(200).json({ reservations });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Récupérer les avis de l'utilisateur connecté
const getMyReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { idVoyageur: req.user.id },
      include: {
        logement: {
          select: {
            id: true,
            titre: true,
            ville: true,
            pays: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Récupérer les notifications de l'utilisateur connecté
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { idUser: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = {
  getMyProfile,
  updateUser,
  updatePassword,
  getMyReservations,
  getMyReviews,
  getMyNotifications,
};