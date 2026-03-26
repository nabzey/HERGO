/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retourne le profil de l'utilisateur connecté
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Mettre à jour le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Prénom de l'utilisateur
 *               lastName:
 *                 type: string
 *                 description: Nom de famille de l'utilisateur
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur
 *               avatar:
 *                 type: string
 *                 description: URL de l'avatar de l'utilisateur
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */

/**
 * @swagger
 * /api/users/password:
 *   put:
 *     summary: Mettre à jour le mot de passe de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Ancien mot de passe de l'utilisateur
 *               newPassword:
 *                 type: string
 *                 description: Nouveau mot de passe de l'utilisateur
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Ancien mot de passe incorrect
 */

/**
 * @swagger
 * /api/users/reservations:
 *   get:
 *     summary: Récupérer les réservations de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retourne la liste des réservations de l'utilisateur connecté
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */

/**
 * @swagger
 * /api/users/reviews:
 *   get:
 *     summary: Récupérer les avis de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retourne la liste des avis de l'utilisateur connecté
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */

/**
 * @swagger
 * /api/users/notifications:
 *   get:
 *     summary: Récupérer les notifications de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retourne la liste des notifications de l'utilisateur connecté
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */