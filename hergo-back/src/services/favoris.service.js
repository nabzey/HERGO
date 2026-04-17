const { pool } = require('../config/db');

const favorisService = {
  getAll: async (userId) => {
    try {
      const [favoris] = await pool.execute(`
        SELECT f.*, 
               l.id as logementId, l.titre, l.prixJour, l.ville, l.pays, l.adresse,
               (SELECT url FROM Image WHERE idLogement = l.id LIMIT 1) as imageUrl
        FROM Favori f
        LEFT JOIN Logement l ON f.idLogement = l.id
        WHERE f.idVoyageur = ?
        ORDER BY f.createdAt DESC
      `, [userId]);
      return favoris;
    } catch (error) {
      throw error;
    }
  },

  add: async (userId, idLogement) => {
    try {
      const [existing] = await pool.execute(
        'SELECT * FROM Favori WHERE idVoyageur = ? AND idLogement = ?',
        [userId, idLogement]
      );

      if (existing.length > 0) {
        return { alreadyExists: true };
      }

      await pool.execute(
        'INSERT INTO Favori (idVoyageur, idLogement, updatedAt) VALUES (?, ?, NOW())',
        [userId, idLogement]
      );

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  remove: async (userId, idLogement) => {
    try {
      await pool.execute(
        'DELETE FROM Favori WHERE idVoyageur = ? AND idLogement = ?',
        [userId, idLogement]
      );
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  check: async (userId, idLogement) => {
    try {
      const [favoris] = await pool.execute(
        'SELECT * FROM Favori WHERE idVoyageur = ? AND idLogement = ?',
        [userId, idLogement]
      );
      return favoris.length > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = favorisService;