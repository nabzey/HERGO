/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *               firstName:
 *                 type: string
 *                 description: Prénom de l'utilisateur
 *               lastName:
 *                 type: string
 *                 description: Nom de famille de l'utilisateur
 *               role:
 *                 type: string
 *                 description: Rôle de l'utilisateur (VOYAGEUR, HOTE, ADMIN)
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation des données
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT
 *       401:
 *         description: Identifiants incorrects
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupérer l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retourne les informations de l'utilisateur connecté
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */