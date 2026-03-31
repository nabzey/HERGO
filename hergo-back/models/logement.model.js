const { pool } = require('../config/db');

const Logement = {
  // Récupérer un logement par ID
  findById: async (id) => {
    const [logements] = await pool.execute(
      `SELECT l.*, u.id as proprietaireId, u.firstName, u.lastName, u.email, u.phone
       FROM Logement l
       LEFT JOIN User u ON l.proprietaireId = u.id
       WHERE l.id = ?`,
      [parseInt(id)]
    );

    if (logements.length === 0) {
      return null;
    }

    const logement = logements[0];

    // Récupérer les images
    const [images] = await pool.execute('SELECT * FROM Image WHERE logementId = ?', [logement.id]);
    logement.images = images;

    // Récupérer les équipements
    const [equipements] = await pool.execute('SELECT * FROM Equipement WHERE logementId = ?', [logement.id]);
    logement.equipements = equipements;

    // Récupérer les espaces
    const [espaces] = await pool.execute('SELECT * FROM Espace WHERE logementId = ?', [logement.id]);
    logement.espaces = espaces;

    // Récupérer les reviews
    const [reviews] = await pool.execute('SELECT * FROM Review WHERE logementId = ?', [logement.id]);
    logement.reviews = reviews;

    return logement;
  },

  // Créer un logement
  create: async (data) => {
    const [result] = await pool.execute(
      'INSERT INTO Logement (titre, description, type, ville, adresse, prix, chambres, capacite, proprietaireId, statut, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [data.titre, data.description, data.type, data.ville, data.adresse, data.prix, data.chambres, data.capacite, data.proprietaireId, data.statut || 'EN_ATTENTE']
    );

    const [logements] = await pool.execute('SELECT * FROM Logement WHERE id = ?', [result.insertId]);
    const logement = logements[0];

    // Récupérer les images
    const [images] = await pool.execute('SELECT * FROM Image WHERE logementId = ?', [logement.id]);
    logement.images = images;

    // Récupérer les équipements
    const [equipements] = await pool.execute('SELECT * FROM Equipement WHERE logementId = ?', [logement.id]);
    logement.equipements = equipements;

    // Récupérer les espaces
    const [espaces] = await pool.execute('SELECT * FROM Espace WHERE logementId = ?', [logement.id]);
    logement.espaces = espaces;

    return logement;
  },

  // Mettre à jour un logement
  update: async (id, data) => {
    await pool.execute(
      'UPDATE Logement SET titre = ?, description = ?, type = ?, ville = ?, adresse = ?, prix = ?, chambres = ?, capacite = ?, statut = ?, updatedAt = NOW() WHERE id = ?',
      [data.titre, data.description, data.type, data.ville, data.adresse, data.prix, data.chambres, data.capacite, data.statut, parseInt(id)]
    );

    const [logements] = await pool.execute('SELECT * FROM Logement WHERE id = ?', [parseInt(id)]);
    const logement = logements[0];

    // Récupérer les images
    const [images] = await pool.execute('SELECT * FROM Image WHERE logementId = ?', [logement.id]);
    logement.images = images;

    // Récupérer les équipements
    const [equipements] = await pool.execute('SELECT * FROM Equipement WHERE logementId = ?', [logement.id]);
    logement.equipements = equipements;

    // Récupérer les espaces
    const [espaces] = await pool.execute('SELECT * FROM Espace WHERE logementId = ?', [logement.id]);
    logement.espaces = espaces;

    return logement;
  },

  // Supprimer un logement
  delete: async (id) => {
    await pool.execute('DELETE FROM Logement WHERE id = ?', [parseInt(id)]);
    return { id: parseInt(id) };
  },

  // Récupérer tous les logements
  findAll: async (where = {}, include = {}) => {
    let query = `SELECT l.*, u.id as proprietaireId, u.firstName, u.lastName, u.email, u.phone
                 FROM Logement l
                 LEFT JOIN User u ON l.proprietaireId = u.id`;
    
    const conditions = [];
    const params = [];
    
    if (where.proprietaireId) {
      conditions.push('l.proprietaireId = ?');
      params.push(where.proprietaireId);
    }
    
    if (where.statut) {
      conditions.push('l.statut = ?');
      params.push(where.statut);
    }
    
    if (where.ville) {
      conditions.push('l.ville = ?');
      params.push(where.ville);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY l.createdAt DESC';
    
    const [logements] = await pool.execute(query, params);
    
    // Pour chaque logement, récupérer les relations
    for (let logement of logements) {
      const [images] = await pool.execute('SELECT * FROM Image WHERE logementId = ?', [logement.id]);
      logement.images = images;

      const [equipements] = await pool.execute('SELECT * FROM Equipement WHERE logementId = ?', [logement.id]);
      logement.equipements = equipements;

      const [espaces] = await pool.execute('SELECT * FROM Espace WHERE logementId = ?', [logement.id]);
      logement.espaces = espaces;
    }
    
    return logements;
  },
};

module.exports = Logement;