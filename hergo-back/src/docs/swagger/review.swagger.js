/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management endpoints
 */

/**
 * @swagger
 * /api/reviews/logement/{idLogement}:
 *   get:
 *     summary: Récupérer tous les avis d'un logement
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: idLogement
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du logement
 *     responses:
 *       200:
 *         description: Retourne la liste des avis d'un logement
 *       404:
 *         description: Logement non trouvé
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Récupérer un avis par ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'avis
 *     responses:
 *       200:
 *         description: Retourne l'avis correspondant à l'ID
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       404:
 *         description: Avis non trouvé
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Créer un avis (voyageur only)
 *     tags: [Reviews]
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
 *                 description: ID du logement concerné
 *               note:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Note de 1 à 5
 *               commentaire:
 *                 type: string
 *                 description: Commentaire de l'avis
 *             required:
 *               - idLogement
 *               - note
 *               - commentaire
 *     responses:
 *       201:
 *         description: Avis créé avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les voyageurs peuvent créer des avis
 *       404:
 *         description: Logement non trouvé
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Mettre à jour un avis
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'avis à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Note de 1 à 5
 *               commentaire:
 *                 type: string
 *                 description: Commentaire de l'avis
 *     responses:
 *       200:
 *         description: Avis mis à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul l'auteur de l'avis ou un administrateur peut le modifier
 *       404:
 *         description: Avis non trouvé
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Supprimer un avis
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'avis à supprimer
 *     responses:
 *       200:
 *         description: Avis supprimé avec succès
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul l'auteur de l'avis ou un administrateur peut le supprimer
 *       404:
 *         description: Avis non trouvé
 */