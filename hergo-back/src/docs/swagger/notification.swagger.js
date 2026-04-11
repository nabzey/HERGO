/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management endpoints
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Récupérer toutes les notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retourne la liste des notifications de l'utilisateur
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Récupérer une notification par ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notification
 *     responses:
 *       200:
 *         description: Retourne la notification correspondant à l'ID
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       404:
 *         description: Notification non trouvée
 */

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Marquer une notification comme lue
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notification
 *     responses:
 *       200:
 *         description: Notification marquée comme lue avec succès
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       404:
 *         description: Notification non trouvée
 */

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Marquer toutes les notifications comme lues
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Toutes les notifications ont été marquées comme lues
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Supprimer une notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notification à supprimer
 *     responses:
 *       200:
 *         description: Notification supprimée avec succès
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       404:
 *         description: Notification non trouvée
 */

/**
 * @swagger
 * /api/notifications/delete-all:
 *   delete:
 *     summary: Supprimer toutes les notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Toutes les notifications ont été supprimées
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */