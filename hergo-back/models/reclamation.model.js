const { pool } = require('../config/db');

const Reclamation = {
  // Récupérer une réclamation par ID
  findById: async (id) => {
    const [reclamations] = await pool.execute(
      `SELECT r.*, u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
              l.id as logementId, l.titre, l.ville, l.pays
       FROM Reclamation r
       LEFT JOIN User u ON r.voyageurId = u.id
       LEFT JOIN Logement l ON r.logementId = l.id
       WHERE r.id = ?`,
      [parseInt(id)]
    );
    return reclamations[0] || null;
  },

  // Créer une réclamation
  create: async (data) => {
    const [result] = await pool.execute(
      'INSERT INTO Reclamation (sujet, description, voyageurId, logementId, statut, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [data.sujet, data.description, data.voyageurId, data.logementId, data.statut || 'EN_ATTENTE']
    );

    const [reclamations] = await pool.execute(
      `SELECT r.*, u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
              l.id as logementId, l.titre, l.ville, l.pays
       FROM Reclamation r
       LEFT JOIN User u ON r.voyageurId = u.id
       LEFT JOIN Logement l ON r.logementId = l.id
       WHERE r.id = ?`,
      [result.insertId]
    );
    return reclamations[0];
  },

  // Mettre à jour une réclamation
  update: async (id, data) => {
    await pool.execute(
      'UPDATE Reclamation SET sujet = ?, description = ?, statut = ?, updatedAt = NOW() WHERE id = ?',
      [data.sujet, data.description, data.statut, parseInt(id)]
    );

    const [reclamations] = await pool.execute(
      `SELECT r.*, u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
              l.id as logementId, l.titre, l.ville, l.pays
       FROM Reclamation r
       LEFT JOIN User u ON r.voyageurId = u.id
       LEFT JOIN Logement l ON r.logementId = l.id
       WHERE r.id = ?`,
      [parseInt(id)]
    );
    return reclamations[0];
  },

  // Supprimer une réclamation
  delete: async (id) => {
    await pool.execute('DELETE FROM Reclamation WHERE id = ?', [parseInt(id)]);
    return { id: parseInt(id) };
  },

  // Récupérer toutes les réclamations
  findAll: async (where = {}, include = {}) => {
    let query = `SELECT r.*, u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
                        l.id as logementId, l.titre, l.ville, l.pays
                 FROM Reclamation r
                 LEFT JOIN User u ON r.voyageurId = u.id
                 LEFT JOIN Logement l ON r.logementId = l.id`;
    
    const conditions = [];
    const params = [];
    
    if (where.voyageurId) {
      conditions.push('r.voyageurId = ?');
      params.push(where.voyageurId);
    }
    
    if (where.logementId) {
      conditions.push('r.logementId = ?');
      params.push(where.logementId);
    }
    
    if (where.statut) {
      conditions.push('r.statut = ?');
      params.push(where.statut);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY r.createdAt DESC';
    
    const [reclamations] = await pool.execute(query, params);
    return reclamations;
  },
};

module.exports = Reclamation;