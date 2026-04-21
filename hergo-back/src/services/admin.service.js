const { pool } = require('../config/db');

const adminService = {
  // Récupérer les statistiques de la plateforme
  getStatistics: async () => {
    try {
      const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM User');
      const [logementCount] = await pool.execute('SELECT COUNT(*) as count FROM Logement');
      const [reservationCount] = await pool.execute('SELECT COUNT(*) as count FROM Reservation');
      const [pendingLogementCount] = await pool.execute('SELECT COUNT(*) as count FROM Logement WHERE statut = ?', ['EN_ATTENTE']);

      // Récupérer les réservations par mois
      const [monthlyReservations] = await pool.execute(`
        SELECT DATE_FORMAT(dateDebut, '%Y-%m') as month, COUNT(*) as count
        FROM Reservation
        GROUP BY DATE_FORMAT(dateDebut, '%Y-%m')
        ORDER BY month DESC
        LIMIT 6
      `);

      // Récupérer les revenus mensuels
      const [monthlyRevenues] = await pool.execute(`
        SELECT DATE_FORMAT(dateDebut, '%Y-%m') as month, SUM(prixTotal) as total
        FROM Reservation
        WHERE statut = 'CONFIRME'
        GROUP BY DATE_FORMAT(dateDebut, '%Y-%m')
        ORDER BY month DESC
        LIMIT 6
      `);

      // Récupérer la répartition des utilisateurs par rôle
      const [userByRole] = await pool.execute(`
        SELECT role, COUNT(*) as count
        FROM User
        GROUP BY role
      `);

      return {
        userCount: Number(userCount[0].count),
        logementCount: Number(logementCount[0].count),
        reservationCount: Number(reservationCount[0].count),
        pendingLogementCount: Number(pendingLogementCount[0].count),
        monthlyReservations: monthlyReservations.map(r => ({ ...r, count: Number(r.count) })),
        monthlyRevenues: monthlyRevenues.map(r => ({ ...r, total: Number(r.total) })),
        userByRole: userByRole.map(r => ({ ...r, count: Number(r.count) }))
      };
    } catch (error) {
      throw error;
    }
  },

  // Récupérer tous les utilisateurs
  getAllUsers: async () => {
    try {
      const [users] = await pool.execute(`
        SELECT id, firstName, lastName, email, role, status, phone, avatar, createdAt, updatedAt
        FROM User
      `);

      return users;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id) => {
    try {
      const [users] = await pool.execute(`
        SELECT id, firstName, lastName, email, role, status, phone, avatar, createdAt, updatedAt
        FROM User
        WHERE id = ?
      `, [id]);

      if (users.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }

      return users[0];
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour le rôle ou le statut d'un utilisateur
  updateUserRoleOrStatus: async (id, data) => {
    try {
      const { role, status } = data;

      // Vérifier si l'utilisateur existe
      const [users] = await pool.execute('SELECT * FROM User WHERE id = ?', [id]);
      
      if (users.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }

      // Construire la requête de mise à jour
      let query = 'UPDATE User SET updatedAt = CURRENT_TIMESTAMP(3)';
      const params = [];

      if (role) {
        query += ', role = ?';
        params.push(role);
      }
      if (status) {
        query += ', status = ?';
        params.push(status);
      }

      query += ' WHERE id = ?';
      params.push(id);

      await pool.execute(query, params);

      // Récupérer l'utilisateur mis à jour
      return await adminService.getUserById(id);
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (id) => {
    try {
      const [users] = await pool.execute('SELECT * FROM User WHERE id = ?', [id]);
      
      if (users.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }

      await pool.execute('DELETE FROM User WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer tous les logements
  getAllLogements: async () => {
    try {
      const [logements] = await pool.execute(`
        SELECT l.*,
               u.id as proprietaireId, u.firstName, u.lastName, u.avatar
        FROM Logement l
        LEFT JOIN User u ON l.idProprietaire = u.id
        ORDER BY l.createdAt DESC
      `);

      return logements;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour le statut d'un logement
  updateLogementStatus: async (id, statut) => {
    try {
      const [logements] = await pool.execute('SELECT * FROM Logement WHERE id = ?', [id]);
      
      if (logements.length === 0) {
        throw new Error('Logement non trouvé');
      }

      await pool.execute(`
        UPDATE Logement SET statut = ?, updatedAt = CURRENT_TIMESTAMP(3)
        WHERE id = ?
      `, [statut, id]);

      // Récupérer le logement mis à jour
      const [updatedLogements] = await pool.execute(`
        SELECT l.*,
               u.id as proprietaireId, u.firstName, u.lastName, u.avatar
        FROM Logement l
        LEFT JOIN User u ON l.idProprietaire = u.id
        WHERE l.id = ?
      `, [id]);

      return updatedLogements[0];
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un logement
  deleteLogement: async (id) => {
    try {
      const [logements] = await pool.execute('SELECT * FROM Logement WHERE id = ?', [id]);
      
      if (logements.length === 0) {
        throw new Error('Logement non trouvé');
      }

      await pool.execute('DELETE FROM Logement WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = adminService;