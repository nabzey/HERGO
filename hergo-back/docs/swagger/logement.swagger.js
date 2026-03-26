/**
 * @swagger
 * tags:
 *   name: Logements
 *   description: Logement management endpoints
 */

/**
 * @swagger
 * /api/logements:
 *   get:
 *     summary: Récupérer tous les logements
 *     tags: [Logements]
 *     responses:
 *       200:
 *         description: Retourne la liste de tous les logements
 */

/**
 * @swagger
 * /api/logements/{id}:
 *   get:
 *     summary: Récupérer un logement par ID
 *     tags: [Logements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du logement
 *     responses:
 *       200:
 *         description: Retourne le logement correspondant à l'ID
 *       404:
 *         description: Logement non trouvé
 */

/**
 * @swagger
 * /api/logements:
 *   post:
 *     summary: Créer un logement (hôte only)
 *     tags: [Logements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *                 description: Titre du logement
 *               description:
 *                 type: string
 *                 description: Description du logement
 *               prixJour:
 *                 type: number
 *                 description: Prix par jour du logement
 *               capacite:
 *                 type: integer
 *                 description: Capacité maximale du logement
 *               adresse:
 *                 type: string
 *                 description: Adresse complète du logement
 *               ville:
 *                 type: string
 *                 description: Ville où se trouve le logement
 *               pays:
 *                 type: string
 *                 description: Pays où se trouve le logement
 *               longitude:
 *                 type: number
 *                 description: Longitude du logement
 *               latitude:
 *                 type: number
 *                 description: Latitude du logement
 *               statut:
 *                 type: string
 *                 description: Statut du logement (PUBLIE, BROUILLON, EN_ATTENTE, REJETE)
 *             required:
 *               - titre
 *               - description
 *               - prixJour
 *               - capacite
 *               - adresse
 *               - ville
 *               - pays
 *     responses:
 *       201:
 *         description: Logement créé avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul les hôtes peuvent créer des logements
 */

/**
 * @swagger
 * /api/logements/{id}:
 *   put:
 *     summary: Mettre à jour un logement
 *     tags: [Logements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du logement à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *                 description: Titre du logement
 *               description:
 *                 type: string
 *                 description: Description du logement
 *               prixJour:
 *                 type: number
 *                 description: Prix par jour du logement
 *               capacite:
 *                 type: integer
 *                 description: Capacité maximale du logement
 *               adresse:
 *                 type: string
 *                 description: Adresse complète du logement
 *               ville:
 *                 type: string
 *                 description: Ville où se trouve le logement
 *               pays:
 *                 type: string
 *                 description: Pays où se trouve le logement
 *               longitude:
 *                 type: number
 *                 description: Longitude du logement
 *               latitude:
 *                 type: number
 *                 description: Latitude du logement
 *               statut:
 *                 type: string
 *                 description: Statut du logement (PUBLIE, BROUILLON, EN_ATTENTE, REJETE)
 *     responses:
 *       200:
 *         description: Logement mis à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul le propriétaire ou un administrateur peut mettre à jour le logement
 *       404:
 *         description: Logement non trouvé
 */

/**
 * @swagger
 * /api/logements/{id}:
 *   delete:
 *     summary: Supprimer un logement
 *     tags: [Logements]
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
 *         description: Interdit, seul le propriétaire ou un administrateur peut supprimer le logement
 *       404:
 *         description: Logement non trouvé
 */

/**
 * @swagger
 * /api/logements/{id}/images:
 *   put:
 *     summary: Gérer les images d'un logement
 *     tags: [Logements]
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
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: URL de l'image
 *     responses:
 *       200:
 *         description: Images mises à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul le propriétaire ou un administrateur peut gérer les images
 *       404:
 *         description: Logement non trouvé
 */

/**
 * @swagger
 * /api/logements/{id}/equipements:
 *   put:
 *     summary: Gérer les équipements d'un logement
 *     tags: [Logements]
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
 *               equipements:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nom:
 *                       type: string
 *                       description: Nom de l'équipement
 *     responses:
 *       200:
 *         description: Équipements mis à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul le propriétaire ou un administrateur peut gérer les équipements
 *       404:
 *         description: Logement non trouvé
 */

/**
 * @swagger
 * /api/logements/{id}/espaces:
 *   put:
 *     summary: Gérer les espaces d'un logement
 *     tags: [Logements]
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
 *               espaces:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nom:
 *                       type: string
 *                       description: Nom de l'espace
 *                     description:
 *                       type: string
 *                       description: Description de l'espace
 *     responses:
 *       200:
 *         description: Espaces mis à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       403:
 *         description: Interdit, seul le propriétaire ou un administrateur peut gérer les espaces
 *       404:
 *         description: Logement non trouvé
 */