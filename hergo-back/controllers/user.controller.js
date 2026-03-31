const { pool } = require('../config/db');
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

    await pool.execute(
      'UPDATE User SET firstName = ?, lastName = ?, phone = ?, avatar = ? WHERE id = ?',
      [firstName, lastName, phone, avatar, req.user.id]
    );

    const [users] = await pool.execute(
      'SELECT id, firstName, lastName, email, role, status, phone, avatar, createdAt, updatedAt FROM User WHERE id = ?',
      [req.user.id]
    );

    res.status(200).json({
      message: 'Profil mis à jour',
      user: users[0],
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
    const [users] = await pool.execute('SELECT * FROM User WHERE id = ?', [req.user.id]);
    const user = users[0];
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

    await pool.execute(
      'UPDATE User SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

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
    const [reviews] = await pool.execute(
      `SELECT r.*, l.id as logementId, l.titre, l.ville, l.pays
       FROM Review r
       LEFT JOIN Logement l ON r.logementId = l.id
       WHERE r.idVoyageur = ?
       ORDER BY r.createdAt DESC`,
      [req.user.id]
    );

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Récupérer les notifications de l'utilisateur connecté
const getMyNotifications = async (req, res) => {
  try {
    const [notifications] = await pool.execute(
      'SELECT * FROM Notification WHERE idUser = ? ORDER BY createdAt DESC',
      [req.user.id]
    );

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