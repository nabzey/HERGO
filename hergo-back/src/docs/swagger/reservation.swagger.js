/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management endpoints
 */

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Récupérer toutes les réservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retourne la liste de toutes les réservations de l'utilisateur
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 */

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Récupérer une réservation par ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Retourne la réservation correspondant à l'ID
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       404:
 *         description: Réservation non trouvée
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Créer une réservation (voyageur only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idLogement:
 *                 type: integer
 *                 description: ID du logement à réserver
 *               dateDebut:
 *                 type: string
 *                 format: date-time
 *                 description: Date de début de la réservation
 *               dateFin:
 *                 type: string
 *                 format: date-time
 *                 description: Date de fin de la réservation
 *               nombrePersonnes:
 *                 type: integer
 *                 description: Nombre de personnes pour la réservation
 *             required:
 *               - idLogement
 *               - dateDebut
 *               - dateFin
 *               - nombrePersonnes
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les voyageurs peuvent créer des réservations
 *       404:
 *         description: Logement non trouvé
 */

/**
 * @swagger
 * /api/reservations/{id}/status:
 *   put:
 *     summary: Mettre à jour le statut d'une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [EN_ATTENTE, CONFIRME, ANNULE, TERMINE]
 *                 description: Nouveau statut de la réservation
 *             required:
 *               - statut
 *     responses:
 *       200:
 *         description: Statut de la réservation mis à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       404:
 *         description: Réservation non trouvée
 */

/**
 * @swagger
 * /api/reservations/{id}/cancel:
 *   put:
 *     summary: Annuler une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réservation à annuler
 *     responses:
 *       200:
 *         description: Réservation annulée avec succès
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       404:
 *         description: Réservation non trouvée
 */

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Supprimer une réservation (admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réservation à supprimer
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les administrateurs peuvent supprimer des réservations
 *       404:
 *         description: Réservation non trouvée
 */