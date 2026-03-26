const { pool } = require('../config/db');

const reviewService = {
  // Récupérer tous les avis d'un logement
  getReviewsByLogement: async (idLogement) => {
    try {
      const [reviews] = await pool.execute(`
        SELECT r.*,
               u.id as voyageurId, u.firstName, u.lastName, u.avatar
        FROM Review r
        LEFT JOIN User u ON r.idVoyageur = u.id
        WHERE r.idLogement = ?
        ORDER BY r.createdAt DESC
      `, [idLogement]);

      return reviews;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un avis par ID
  getReviewById: async (id) => {
    try {
      const [reviews] = await pool.execute(`
        SELECT r.*,
               u.id as voyageurId, u.firstName, u.lastName, u.avatar,
               l.id as logementId, l.titre, l.ville, l.pays
        FROM Review r
        LEFT JOIN User u ON r.idVoyageur = u.id
        LEFT JOIN Logement l ON r.idLogement = l.id
        WHERE r.id = ?
      `, [id]);

      if (reviews.length === 0) {
        throw new Error('Avis non trouvé');
      }

      return reviews[0];
    } catch (error) {
      throw error;
    }
  },

  // Créer un avis (voyageur only)
  createReview: async (data, userId) => {
    try {
      const { idLogement, note, commentaire } = data;

      // Vérifier si le logement existe
      const [logements] = await pool.execute('SELECT * FROM Logement WHERE id = ?', [idLogement]);
      
      if (logements.length === 0) {
        throw new Error('Logement non trouvé');
      }

      // Vérifier que l'utilisateur a réservé ce logement et que la réservation est terminée
      const [reservations] = await pool.execute(`
        SELECT * FROM Reservation
        WHERE idVoyageur = ? AND idLogement = ? AND statut = ?
      `, [userId, idLogement, 'TERMINE']);

      if (reservations.length === 0) {
        throw new Error('Vous ne pouvez pas laisser un avis pour ce logement');
      }

      // Vérifier que l'utilisateur n'a pas déjà laissé un avis
      const [existingReviews] = await pool.execute(`
        SELECT * FROM Review
        WHERE idVoyageur = ? AND idLogement = ?
      `, [userId, idLogement]);

      if (existingReviews.length > 0) {
        throw new Error('Vous avez déjà laissé un avis pour ce logement');
      }

      // Créer l'avis
      const [result] = await pool.execute(`
        INSERT INTO Review (idVoyageur, idLogement, note, commentaire)
        VALUES (?, ?, ?, ?)
      `, [userId, idLogement, note, commentaire]);

      // Récupérer l'avis créé
      return await reviewService.getReviewById(result.insertId);
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un avis
  updateReview: async (id, data, userId, userRole) => {
    try {
      const { note, commentaire } = data;

      // Vérifier si l'avis existe
      const [reviews] = await pool.execute('SELECT * FROM Review WHERE id = ?', [id]);
      
      if (reviews.length === 0) {
        throw new Error('Avis non trouvé');
      }

      const review = reviews[0];

      // Vérifier les permissions
      if (userRole !== 'ADMIN' && review.idVoyageur !== userId) {
        throw new Error('Accès refusé');
      }

      // Mettre à jour l'avis
      await pool.execute(`
        UPDATE Review SET note = ?, commentaire = ?, updatedAt = CURRENT_TIMESTAMP(3)
        WHERE id = ?
      `, [note, commentaire, id]);

      // Récupérer l'avis mis à jour
      return await reviewService.getReviewById(id);
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un avis
  deleteReview: async (id, userId, userRole) => {
    try {
      // Vérifier si l'avis existe
      const [reviews] = await pool.execute('SELECT * FROM Review WHERE id = ?', [id]);
      
      if (reviews.length === 0) {
        throw new Error('Avis non trouvé');
      }

      const review = reviews[0];

      // Vérifier les permissions
      if (userRole !== 'ADMIN' && review.idVoyageur !== userId) {
        throw new Error('Accès refusé');
      }

      await pool.execute('DELETE FROM Review WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = reviewService;