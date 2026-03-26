const { pool } = require('../config/db');

const logementService = {
  // Récupérer tous les logements
  getAllLogements: async (filters = {}) => {
    try {
      const { ville, pays, prixMin, prixMax, capacite, statut = 'PUBLIE' } = filters;
      
      let query = 'SELECT * FROM Logement WHERE statut = ?';
      const params = [statut];

      if (ville) {
        query += ' AND ville LIKE ?';
        params.push(`%${ville}%`);
      }
      if (pays) {
        query += ' AND pays LIKE ?';
        params.push(`%${pays}%`);
      }
      if (prixMin) {
        query += ' AND prixJour >= ?';
        params.push(parseFloat(prixMin));
      }
      if (prixMax) {
        query += ' AND prixJour <= ?';
        params.push(parseFloat(prixMax));
      }
      if (capacite) {
        query += ' AND capacite >= ?';
        params.push(parseInt(capacite));
      }

      query += ' ORDER BY createdAt DESC';
      
      const [logements] = await pool.execute(query, params);
      return logements;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un logement par ID
  getLogementById: async (id) => {
    try {
      const [logements] = await pool.execute('SELECT * FROM Logement WHERE id = ?', [id]);
      
      if (logements.length === 0) {
        throw new Error('Logement non trouvé');
      }

      return logements[0];
    } catch (error) {
      throw error;
    }
  },

  // Créer un logement
  createLogement: async (data, userId) => {
    try {
      const { titre, description, prixJour, capacite, adresse, ville, pays, longitude, latitude, statut = 'BROUILLON' } = data;

      const [result] = await pool.execute(`
        INSERT INTO Logement (titre, description, prixJour, capacite, adresse, ville, pays, longitude, latitude, statut, idProprietaire)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        titre, description, parseFloat(prixJour), parseInt(capacite), adresse, ville, pays,
        longitude ? parseFloat(longitude) : null, latitude ? parseFloat(latitude) : null, statut, userId
      ]);

      const logementId = result.insertId;

      return await logementService.getLogementById(logementId);
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un logement
  updateLogement: async (id, data, userId, userRole) => {
    try {
      const { titre, description, prixJour, capacite, adresse, ville, pays, longitude, latitude, statut } = data;

      const [existingLogements] = await pool.execute('SELECT * FROM Logement WHERE id = ?', [id]);
      const existingLogement = existingLogements[0];

      if (!existingLogement) {
        throw new Error('Logement non trouvé');
      }

      if (userRole !== 'ADMIN' && existingLogement.idProprietaire !== userId) {
        throw new Error('Accès refusé');
      }

      await pool.execute(`
        UPDATE Logement SET
          titre = ?, description = ?, prixJour = ?, capacite = ?, adresse = ?,
          ville = ?, pays = ?, longitude = ?, latitude = ?, statut = ?, updatedAt = CURRENT_TIMESTAMP(3)
        WHERE id = ?
      `, [
        titre, description, parseFloat(prixJour), parseInt(capacite), adresse, ville, pays,
        longitude ? parseFloat(longitude) : null, latitude ? parseFloat(latitude) : null, statut, id
      ]);

      return await logementService.getLogementById(id);
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un logement
  deleteLogement: async (id, userId, userRole) => {
    try {
      const [existingLogements] = await pool.execute('SELECT * FROM Logement WHERE id = ?', [id]);
      const existingLogement = existingLogements[0];

      if (!existingLogement) {
        throw new Error('Logement non trouvé');
      }

      if (userRole !== 'ADMIN' && existingLogement.idProprietaire !== userId) {
        throw new Error('Accès refusé');
      }

      await pool.execute('DELETE FROM Logement WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = logementService;