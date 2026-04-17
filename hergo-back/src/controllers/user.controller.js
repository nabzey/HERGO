const { pool } = require('../config/db');
const passwordHelper = require('../helpers/password.helper');
const reservationService = require('../services/reservation.service');

const normalizePhone = ({ phone, phoneCountryCode, phoneNationalNumber }) => {
  if (phoneNationalNumber) {
    const countryCode = String(phoneCountryCode || '').replace(/[^\d]/g, '');
    const nationalNumber = String(phoneNationalNumber).replace(/[^\d]/g, '');

    if (!nationalNumber) {
      return null;
    }

    return `${countryCode ? `+${countryCode}` : ''}${nationalNumber}`;
  }

  if (!phone) {
    return null;
  }

  const cleaned = String(phone).replace(/[^\d+]/g, '');
  return cleaned || null;
};

const getMyProfile = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, firstName, lastName, email, role, status, phone, avatar, createdAt, updatedAt FROM User WHERE id = ?',
      [req.user.id]
    );

    res.status(200).json({ user: users[0] || req.user });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

const updateUser = async (req, res) => {
  try {
    const firstName = req.body.firstName ?? req.body.prenom;
    const lastName = req.body.lastName ?? req.body.nom;
    const email = req.body.email?.trim().toLowerCase();
    const phone = normalizePhone(req.body);
    const avatar = req.body.avatar ?? null;

    if (email) {
      const [existingEmailUsers] = await pool.execute(
        'SELECT id FROM User WHERE email = ? AND id != ?',
        [email, req.user.id]
      );

      if (existingEmailUsers.length > 0) {
        return res.status(409).json({ message: 'Email déjà utilisé' });
      }
    }

    if (phone) {
      const [existingPhoneUsers] = await pool.execute(
        'SELECT id FROM User WHERE phone = ? AND id != ?',
        [phone, req.user.id]
      );

      if (existingPhoneUsers.length > 0) {
        return res.status(409).json({ message: 'Numéro de téléphone déjà utilisé' });
      }
    }

    await pool.execute(
      'UPDATE User SET firstName = ?, lastName = ?, email = ?, phone = ?, avatar = ? WHERE id = ?',
      [
        firstName ?? req.user.firstName,
        lastName ?? req.user.lastName,
        email ?? req.user.email,
        phone ?? req.user.phone,
        avatar ?? req.user.avatar,
        req.user.id,
      ]
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

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const [users] = await pool.execute('SELECT * FROM User WHERE id = ?', [req.user.id]);
    const user = users[0];
    const isCurrentPasswordValid = await passwordHelper.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Mot de passe actuel incorrect');
    }

    if (!passwordHelper.isPasswordStrong(newPassword)) {
      throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères');
    }

    const hashedPassword = await passwordHelper.hashPassword(newPassword);

    await pool.execute('UPDATE User SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    res.status(200).json({ message: 'Mot de passe mis à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    res.status(400).json({ message: error.message });
  }
};

const getMyReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations(req.user.id, req.user.role, req.query);
    res.status(200).json({ reservations });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const [reviews] = await pool.execute(
      `SELECT r.*, l.id as logementId, l.titre, l.ville, l.pays
       FROM Review r
       LEFT JOIN Logement l ON r.idLogement = l.id
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
