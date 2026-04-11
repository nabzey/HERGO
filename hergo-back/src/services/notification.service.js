const { pool } = require('../config/db');

const notificationService = {
  // Récupérer toutes les notifications de l'utilisateur
  getNotifications: async (userId, filters = {}) => {
    try {
      const { lu } = filters;
      let query = 'SELECT * FROM Notification WHERE idUser = ?';
      const params = [userId];

      if (lu !== undefined) {
        query += ' AND lu = ?';
        params.push(lu === 'true');
      }

      query += ' ORDER BY createdAt DESC';

      const [notifications] = await pool.execute(query, params);
      return notifications;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer une notification par ID
  getNotificationById: async (id, userId) => {
    try {
      const [notifications] = await pool.execute('SELECT * FROM Notification WHERE id = ?', [id]);
      
      if (notifications.length === 0) {
        throw new Error('Notification non trouvée');
      }

      const notification = notifications[0];

      if (notification.idUser !== userId) {
        throw new Error('Accès refusé');
      }

      return notification;
    } catch (error) {
      throw error;
    }
  },

  // Marquer une notification comme lue
  markAsRead: async (id, userId) => {
    try {
      const [notifications] = await pool.execute('SELECT * FROM Notification WHERE id = ?', [id]);
      
      if (notifications.length === 0) {
        throw new Error('Notification non trouvée');
      }

      const notification = notifications[0];

      if (notification.idUser !== userId) {
        throw new Error('Accès refusé');
      }

      await pool.execute(`
        UPDATE Notification SET lu = ?, updatedAt = CURRENT_TIMESTAMP(3)
        WHERE id = ?
      `, [true, id]);

      const [updatedNotifications] = await pool.execute('SELECT * FROM Notification WHERE id = ?', [id]);
      return updatedNotifications[0];
    } catch (error) {
      throw error;
    }
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async (userId) => {
    try {
      await pool.execute(`
        UPDATE Notification SET lu = ?, updatedAt = CURRENT_TIMESTAMP(3)
        WHERE idUser = ? AND lu = ?
      `, [true, userId, false]);

      return true;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une notification
  deleteNotification: async (id, userId) => {
    try {
      const [notifications] = await pool.execute('SELECT * FROM Notification WHERE id = ?', [id]);
      
      if (notifications.length === 0) {
        throw new Error('Notification non trouvée');
      }

      const notification = notifications[0];

      if (notification.idUser !== userId) {
        throw new Error('Accès refusé');
      }

      await pool.execute('DELETE FROM Notification WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer toutes les notifications
  deleteAllNotifications: async (userId) => {
    try {
      await pool.execute('DELETE FROM Notification WHERE idUser = ?', [userId]);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = notificationService;