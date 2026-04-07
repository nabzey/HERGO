const { pool } = require('../config/db');
const notificationHelper = require('../helpers/notification.helper');
const emailHelper = require('../helpers/email.helper');
const smsHelper = require('../helpers/sms.helper');

const notifyReservationCreated = async (reservation, logement) => {
  await emailHelper.sendReservationEmail(
    reservation.email,
    reservation.firstName || 'client',
    reservation
  );
  await smsHelper.sendReservationSms(reservation.phone, reservation);

  if (logement.idProprietaire) {
    const [hosts] = await pool.execute(
      'SELECT id, firstName, lastName, email, phone FROM User WHERE id = ?',
      [logement.idProprietaire]
    );
    const host = hosts[0];

    if (host) {
      await notificationHelper.createReservationNotification(host.id, reservation);
      await emailHelper.sendHostNotificationEmail(
        host.email,
        host.firstName || 'hote',
        reservation
      );
      await smsHelper.sendReservationSms(host.phone, reservation);
    }
  }
};

const notifyReservationStatusChanged = async (reservation, statut) => {
  if (statut === 'CONFIRME') {
    await notificationHelper.createReservationConfirmationNotification(
      reservation.idVoyageur,
      reservation
    );
    await emailHelper.sendReservationEmail(
      reservation.email,
      reservation.firstName || 'client',
      reservation
    );
    await smsHelper.sendReservationSms(reservation.phone, reservation);
  }

  if (statut === 'ANNULE') {
    await notificationHelper.createReservationCancelationNotification(
      reservation.idVoyageur,
      reservation
    );
    await emailHelper.sendCancelationEmail(
      reservation.email,
      reservation.firstName || 'client',
      reservation
    );
    await smsHelper.sendCancelationSms(reservation.phone, reservation);
  }
};

const reservationService = {
  // Récupérer toutes les réservations
  getAllReservations: async (userId, userRole, filters = {}) => {
    try {
      const { statut } = filters;
      let query = '';
      const params = [];

      if (userRole === 'HOTE') {
        query = `
          SELECT r.*,
                 u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
                 l.id as logementId, l.titre, l.ville, l.pays
          FROM Reservation r
          LEFT JOIN User u ON r.idVoyageur = u.id
          LEFT JOIN Logement l ON r.idLogement = l.id
          WHERE l.idProprietaire = ?
        `;
        params.push(userId);
        
        if (statut) {
          query += ' AND r.statut = ?';
          params.push(statut);
        }
      } else if (userRole === 'VOYAGEUR') {
        query = `
          SELECT r.*,
                 u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
                 l.id as logementId, l.titre, l.ville, l.pays
          FROM Reservation r
          LEFT JOIN User u ON r.idVoyageur = u.id
          LEFT JOIN Logement l ON r.idLogement = l.id
          WHERE r.idVoyageur = ?
        `;
        params.push(userId);
        
        if (statut) {
          query += ' AND r.statut = ?';
          params.push(statut);
        }
      } else {
        query = `
          SELECT r.*,
                 u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
                 l.id as logementId, l.titre, l.ville, l.pays
          FROM Reservation r
          LEFT JOIN User u ON r.idVoyageur = u.id
          LEFT JOIN Logement l ON r.idLogement = l.id
        `;
        
        if (statut) {
          query += ' WHERE r.statut = ?';
          params.push(statut);
        }
      }

      query += ' ORDER BY r.createdAt DESC';
      
      const [reservations] = await pool.execute(query, params);
      return reservations;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer une réservation par ID
  getReservationById: async (id, userId, userRole) => {
    try {
      const [reservations] = await pool.execute(`
        SELECT r.*,
               u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
               l.id as logementId, l.titre, l.ville, l.pays
        FROM Reservation r
        LEFT JOIN User u ON r.idVoyageur = u.id
        LEFT JOIN Logement l ON r.idLogement = l.id
        WHERE r.id = ?
      `, [id]);

      if (reservations.length === 0) {
        throw new Error('Réservation non trouvée');
      }

      const reservation = reservations[0];
      const isAdmin = userRole === 'ADMIN';
      const isVoyageur = userRole === 'VOYAGEUR' && reservation.idVoyageur === userId;
      const isHote = userRole === 'HOTE' && reservation.idProprietaire === userId;

      if (!isAdmin && !isVoyageur && !isHote) {
        throw new Error('Accès refusé');
      }

      return reservation;
    } catch (error) {
      throw error;
    }
  },

  // Créer une réservation
  createReservation: async (data, userId) => {
    try {
      const { idLogement, dateDebut, dateFin, nombrePersonnes } = data;

      // Vérifier si le logement existe
      const [logements] = await pool.execute('SELECT * FROM Logement WHERE id = ? AND statut = ?', [idLogement, 'PUBLIE']);
      
      if (logements.length === 0) {
        throw new Error('Logement non disponible');
      }

      const logement = logements[0];

      // Vérifier la disponibilité du logement
      const [overlappingReservations] = await pool.execute(`
        SELECT * FROM Reservation
        WHERE idLogement = ? AND statut IN ('EN_ATTENTE', 'CONFIRME')
        AND ((dateDebut BETWEEN ? AND ?) OR (dateFin BETWEEN ? AND ?) OR (dateDebut <= ? AND dateFin >= ?))
      `, [idLogement, dateDebut, dateFin, dateDebut, dateFin, dateDebut, dateFin]);

      if (overlappingReservations.length > 0) {
        throw new Error('Logement non disponible pour ces dates');
      }

      // Calculer le prix total
      const start = new Date(dateDebut);
      const end = new Date(dateFin);
      const nbJours = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const prixTotal = nbJours * logement.prixJour;

      // Créer la réservation
      const [result] = await pool.execute(`
        INSERT INTO Reservation (idVoyageur, idLogement, dateDebut, dateFin, nombrePersonnes, prixTotal, statut, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `, [userId, idLogement, dateDebut, dateFin, nombrePersonnes, prixTotal, 'EN_ATTENTE']);

      // Récupérer la réservation créé
      const [newReservations] = await pool.execute(`
        SELECT r.*,
               u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
               l.id as logementId, l.titre, l.ville, l.pays
        FROM Reservation r
        LEFT JOIN User u ON r.idVoyageur = u.id
        LEFT JOIN Logement l ON r.idLogement = l.id
        WHERE r.id = ?
      `, [result.insertId]);

      const reservation = newReservations[0];
      await notifyReservationCreated(reservation, logement);

      return reservation;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour le statut d'une réservation
  updateReservationStatus: async (id, statut, userId, userRole) => {
    try {
      // Vérifier si la réservation existe
      const [reservations] = await pool.execute(`
        SELECT r.*, l.idProprietaire
        FROM Reservation r
        LEFT JOIN Logement l ON r.idLogement = l.id
        WHERE r.id = ?
      `, [id]);

      if (reservations.length === 0) {
        throw new Error('Réservation non trouvée');
      }

      const reservation = reservations[0];
      const isAdmin = userRole === 'ADMIN';
      const isHote = userRole === 'HOTE' && reservation.idProprietaire === userId;

      if (!isAdmin && !isHote) {
        throw new Error('Accès refusé');
      }

      // Mettre à jour le statut
      await pool.execute(`
        UPDATE Reservation SET statut = ?, updatedAt = CURRENT_TIMESTAMP(3)
        WHERE id = ?
      `, [statut, id]);

      // Récupérer la réservation mise à jour
      const [updatedReservations] = await pool.execute(`
        SELECT r.*,
               u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
               l.id as logementId, l.titre, l.ville, l.pays
        FROM Reservation r
        LEFT JOIN User u ON r.idVoyageur = u.id
        LEFT JOIN Logement l ON r.idLogement = l.id
        WHERE r.id = ?
      `, [id]);

      const updatedReservation = updatedReservations[0];
      await notifyReservationStatusChanged(updatedReservation, statut);

      return updatedReservation;
    } catch (error) {
      throw error;
    }
  },

  // Annuler une réservation
  cancelReservation: async (id, userId, userRole) => {
    try {
      // Vérifier si la réservation existe
      const [reservations] = await pool.execute(`
        SELECT r.*, l.idProprietaire
        FROM Reservation r
        LEFT JOIN Logement l ON r.idLogement = l.id
        WHERE r.id = ?
      `, [id]);

      if (reservations.length === 0) {
        throw new Error('Réservation non trouvée');
      }

      const reservation = reservations[0];
      const isAdmin = userRole === 'ADMIN';
      const isVoyageur = userRole === 'VOYAGEUR' && reservation.idVoyageur === userId;
      const isHote = userRole === 'HOTE' && reservation.idProprietaire === userId;

      if (!isAdmin && !isVoyageur && !isHote) {
        throw new Error('Accès refusé');
      }

      if (reservation.statut === 'ANNULE' || reservation.statut === 'TERMINE') {
        throw new Error('Réservation déjà annulée ou terminée');
      }

      // Mettre à jour le statut
      await pool.execute(`
        UPDATE Reservation SET statut = ?, updatedAt = CURRENT_TIMESTAMP(3)
        WHERE id = ?
      `, ['ANNULE', id]);

      // Récupérer la réservation mise à jour
      const [updatedReservations] = await pool.execute(`
        SELECT r.*,
               u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
               l.id as logementId, l.titre, l.ville, l.pays
        FROM Reservation r
        LEFT JOIN User u ON r.idVoyageur = u.id
        LEFT JOIN Logement l ON r.idLogement = l.id
        WHERE r.id = ?
      `, [id]);

      const updatedReservation = updatedReservations[0];
      await notifyReservationStatusChanged(updatedReservation, 'ANNULE');

      return updatedReservation;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une réservation
  deleteReservation: async (id) => {
    try {
      const [reservations] = await pool.execute('SELECT * FROM Reservation WHERE id = ?', [id]);
      
      if (reservations.length === 0) {
        throw new Error('Réservation non trouvée');
      }

      await pool.execute('DELETE FROM Reservation WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = reservationService;
