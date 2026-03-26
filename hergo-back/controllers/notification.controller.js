const notificationService = require('../services/notification.service');

// Récupérer toutes les notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotifications(req.user.id, req.query);
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Récupérer une notification par ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await notificationService.getNotificationById(req.params.id, req.user.id);
    res.status(200).json({ notification });
  } catch (error) {
    console.error('Erreur lors de la récupération de la notification:', error);
    res.status(404).json({ message: error.message });
  }
};

// Marquer une notification comme lue
const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    res.status(200).json({
      message: 'Notification marquée comme lue',
      notification,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    res.status(400).json({ message: error.message });
  }
};

// Marquer toutes les notifications comme lues
const markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.status(200).json({ message: 'Toutes les notifications marqué comme lues' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notifications:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Supprimer une notification
const deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.user.id);
    res.status(200).json({ message: 'Notification supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(404).json({ message: error.message });
  }
};

// Supprimer toutes les notifications
const deleteAllNotifications = async (req, res) => {
  try {
    await notificationService.deleteAllNotifications(req.user.id);
    res.status(200).json({ message: 'Toutes les notifications supprimées' });
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};