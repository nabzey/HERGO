const { pool } = require('../config/db');

const reclamationService = {
  // Récupérer toutes les réclamations
  getAllReclamations: async (userId, userRole, filters = {}) => {
    try {
      const { statut } = filters;
      let query = '';
      const params = [];

      if (userRole === 'VOYAGEUR') {
        query = `
          SELECT r.*,
                 u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
                 l.id as logementId, l.titre, l.ville, l.pays
          FROM Reclamation r
          LEFT JOIN User u ON r.idVoyageur = u.id
          LEFT JOIN Logement l ON r.idLogement = l.id
          WHERE r.idVoyageur = ?
        `;
        params.push(userId);
      } else if (userRole === 'HOTE') {
        query = `
          SELECT r.*,
                 u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
                 l.id as logementId, l.titre, l.ville, l.pays
          FROM Reclamation r
          LEFT JOIN User u ON r.idVoyageur = u.id
          LEFT JOIN Logement l ON r.idLogement = l.id
          WHERE l.idProprietaire = ?
        `;
        params.push(userId);
      } else {
        query = `
          SELECT r.*,
                 u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
                 l.id as logementId, l.titre, l.ville, l.pays
          FROM Reclamation r
          LEFT JOIN User u ON r.idVoyageur = u.id
          LEFT JOIN Logement l ON r.idLogement = l.id
        `;
      }

      if (statut) {
        query += (params.length > 0 ? ' AND ' : ' WHERE ') + 'r.statut = ?';
        params.push(statut);
      }

      query += ' ORDER BY r.createdAt DESC';

      const [reclamations] = await pool.execute(query, params);
      return reclamations;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer une réclamation par ID
  getReclamationById: async (id, userId, userRole) => {
    try {
      const [reclamations] = await pool.execute(`
        SELECT r.*,
               u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
               l.id as logementId, l.titre, l.ville, l.pays
        FROM Reclamation r
        LEFT JOIN User u ON r.idVoyageur = u.id
        LEFT JOIN Logement l ON r.idLogement = l.id
        WHERE r.id = ?
      `, [id]);

      if (reclamations.length === 0) {
        throw new Error('Réclamation non trouvée');
      }

      const reclamation = reclamations[0];
      const isAdmin = userRole === 'ADMIN';
      const isVoyageur = userRole === 'VOYAGEUR' && reclamation.idVoyageur === userId;
      const isHote = userRole === 'HOTE' && reclamation.idProprietaire === userId;

      if (!isAdmin && !isVoyageur && !isHote) {
        throw new Error('Accès refusé');
      }

      return reclamation;
    } catch (error) {
      throw error;
    }
  },

  // Créer une réclamation
  createReclamation: async (data, userId) => {
    try {
      const { idLogement, sujet, description } = data;

      // Vérifier si le logement existe
      const [logements] = await pool.execute('SELECT * FROM Logement WHERE id = ?', [idLogement]);
      
      if (logements.length === 0) {
        throw new Error('Logement non trouvé');
      }

      // Vérifier que l'utilisateur a réservé ce logement
      const [reservations] = await pool.execute(`
        SELECT * FROM Reservation
        WHERE idVoyageur = ? AND idLogement = ? AND statut IN ('CONFIRME', 'TERMINE')
      `, [userId, idLogement]);

      if (reservations.length === 0) {
        throw new Error('Vous ne pouvez pas créer une réclamation pour ce logement');
      }

      // Créer la réclamation
      const [result] = await pool.execute(`
        INSERT INTO Reclamation (idVoyageur, idLogement, sujet, description, statut)
        VALUES (?, ?, ?, ?, ?)
      `, [userId, idLogement, sujet, description, 'EN_ATTENTE']);

      // Récupérer la réclamation créé
      return await reclamationService.getReclamationById(result.insertId, userId, 'VOYAGEUR');
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour une réclamation
  updateReclamation: async (id, data, userId, userRole) => {
    try {
      const { sujet, description, statut } = data;

      // Vérifier si la réclamation existe
      const [reclamations] = await pool.execute('SELECT * FROM Reclamation WHERE id = ?', [id]);
      
      if (reclamations.length === 0) {
        throw new Error('Réclamation non trouvée');
      }

      const reclamation = reclamations[0];
      const isAdmin = userRole === 'ADMIN';
      const isVoyageur = userRole === 'VOYAGEUR' && reclamation.idVoyageur === userId;

      if (!isAdmin && !isVoyageur) {
        throw new Error('Accès refusé');
      }

      // Seul l'admin peut mettre à jour le statut
      if (statut && userRole !== 'ADMIN') {
        throw new Error('Seul l\'admin peut mettre à jour le statut');
      }

      // Construire la requête de mise à jour
      let query = 'UPDATE Reclamation SET updatedAt = CURRENT_TIMESTAMP(3)';
      const params = [];

      if (sujet) {
        query += ', sujet = ?';
        params.push(sujet);
      }
      if (description) {
        query += ', description = ?';
        params.push(description);
      }
      if (statut) {
        query += ', statut = ?';
        params.push(statut);
      }

      query += ' WHERE id = ?';
      params.push(id);

      await pool.execute(query, params);

      // Récupérer la réclamation mise à jour
      return await reclamationService.getReclamationById(id, userId, userRole);
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une réclamation
  deleteReclamation: async (id, userId, userRole) => {
    try {
      // Vérifier si la réclamation existe
      const [reclamations] = await pool.execute('SELECT * FROM Reclamation WHERE id = ?', [id]);
      
      if (reclamations.length === 0) {
        throw new Error('Réclamation non trouvée');
      }

      const reclamation = reclamations[0];
      const isAdmin = userRole === 'ADMIN';
      const isVoyageur = userRole === 'VOYAGEUR' && reclamation.idVoyageur === userId;

      if (!isAdmin && !isVoyageur) {
        throw new Error('Accès refusé');
      }

      await pool.execute('DELETE FROM Reclamation WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = reclamationService;