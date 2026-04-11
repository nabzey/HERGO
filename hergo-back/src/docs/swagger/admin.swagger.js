/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/statistics:
 *   get:
 *     summary: Récupérer les statistiques
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retourne les statistiques de l'application
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent accéder aux statistiques
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retourne la liste de tous les utilisateurs
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent accéder à la liste des utilisateurs
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Retourne l'utilisateur correspondant à l'ID
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent accéder à l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Mettre à jour le rôle ou le statut d'un utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [VOYAGEUR, HOTE, ADMIN]
 *                 description: Nouveau rôle de l'utilisateur
 *               status:
 *                 type: string
 *                 enum: [ACTIF, SUSPENDU, BANNI]
 *                 description: Nouveau statut de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent modifier un utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent supprimer un utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /api/admin/logements:
 *   get:
 *     summary: Récupérer tous les logements
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retourne la liste de tous les logements
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent accéder à la liste des logements
 */

/**
 * @swagger
 * /api/admin/logements/{id}/status:
 *   put:
 *     summary: Mettre à jour le statut d'un logement
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du logement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [PUBLIE, BROUILLON, EN_ATTENTE, REJETE]
 *                 description: Nouveau statut du logement
 *     responses:
 *       200:
 *         description: Statut du logement mis à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent modifier le statut d'un logement
 *       404:
 *         description: Logement non trouvé
 */

/**
 * @swagger
 * /api/admin/logements/{id}:
 *   delete:
 *     summary: Supprimer un logement
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du logement à supprimer
 *     responses:
 *       200:
 *         description: Logement supprimé avec succès
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent supprimer un logement
 *       404:
 *         description: Logement non trouvé
 */

/**
 * @swagger
 * /api/admin/reservations:
 *   get:
 *     summary: Récupérer toutes les réservations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retourne la liste de toutes les réservations
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent accéder à la liste des réservations
 */

/**
 * @swagger
 * /api/admin/reclamations:
 *   get:
 *     summary: Récupérer toutes les réclamations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retourne la liste de toutes les réclamations
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent accéder à la liste des réclamations
 */

/**
 * @swagger
 * /api/admin/reclamations/{id}/status:
 *   put:
 *     summary: Mettre à jour le statut d'une réclamation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réclamation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [EN_ATTENTE, EN_TRAITEMENT, RESOLU, REJETE]
 *                 description: Nouveau statut de la réclamation
 *     responses:
 *       200:
 *         description: Statut de la réclamation mis à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent modifier le statut d'une réclamation
 *       404:
 *         description: Réclamation non trouvée
 */

/**
 * @swagger
 * /api/admin/reclamations/{id}:
 *   delete:
 *     summary: Supprimer une réclamation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réclamation à supprimer
 *     responses:
 *       200:
 *         description: Réclamation supprimée avec succès
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent supprimer une réclamation
 *       404:
 *         description: Réclamation non trouvée
 */