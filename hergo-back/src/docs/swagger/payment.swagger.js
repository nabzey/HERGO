/**
 * @swagger
 * tags:
 *   name: Paiements
 *   description: Endpoints pour la gestion des paiements
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Récupérer tous les paiements
 *     tags: [Paiements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des paiements récupérée avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès réservé à l'admin
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Récupérer un paiement par son identifiant
 *     tags: [Paiements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Identifiant du paiement
 *     responses:
 *       200:
 *         description: Paiement récupéré avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès réservé à l'admin
 *       404:
 *         description: Paiement non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Créer un Payment Intent pour une réservation
 *     tags: [Paiements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: string
 *                 description: Identifiant de la réservation pour laquelle créer un paiement
 *             required:
 *               - reservationId
 *     responses:
 *       201:
 *         description: Payment Intent créé avec succès
 *       400:
 *         description: Requête invalide ou erreur de création du paiement
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur interne du serveur
 */
