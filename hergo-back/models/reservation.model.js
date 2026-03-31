const { pool } = require('../config/db');

const Reservation = {
  // Récupérer une réservation par ID
  findById: async (id) => {
    const [reservations] = await pool.execute(
      `SELECT r.*, u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
              l.id as logementId, l.titre, l.ville, l.pays, l.prix
       FROM Reservation r
       LEFT JOIN User u ON r.voyageurId = u.id
       LEFT JOIN Logement l ON r.logementId = l.id
       WHERE r.id = ?`,
      [parseInt(id)]
    );
    return reservations[0] || null;
  },

  // Créer une réservation
  create: async (data) => {
    const [result] = await pool.execute(
      'INSERT INTO Reservation (voyageurId, logementId, dateArrivee, dateDepart, nombrePersonnes, message, statut, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [data.voyageurId, data.logementId, data.dateArrivee, data.dateDepart, data.nombrePersonnes, data.message, data.statut || 'EN_ATTENTE']
    );

    const [reservations] = await pool.execute(
      `SELECT r.*, u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
              l.id as logementId, l.titre, l.ville, l.pays, l.prix
       FROM Reservation r
       LEFT JOIN User u ON r.voyageurId = u.id
       LEFT JOIN Logement l ON r.logementId = l.id
       WHERE r.id = ?`,
      [result.insertId]
    );
    return reservations[0];
  },

  // Mettre à jour une réservation
  update: async (id, data) => {
    await pool.execute(
      'UPDATE Reservation SET dateArrivee = ?, dateDepart = ?, nombrePersonnes = ?, message = ?, statut = ?, updatedAt = NOW() WHERE id = ?',
      [data.dateArrivee, data.dateDepart, data.nombrePersonnes, data.message, data.statut, parseInt(id)]
    );

    const [reservations] = await pool.execute(
      `SELECT r.*, u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
              l.id as logementId, l.titre, l.ville, l.pays, l.prix
       FROM Reservation r
       LEFT JOIN User u ON r.voyageurId = u.id
       LEFT JOIN Logement l ON r.logementId = l.id
       WHERE r.id = ?`,
      [parseInt(id)]
    );
    return reservations[0];
  },

  // Supprimer une réservation
  delete: async (id) => {
    await pool.execute('DELETE FROM Reservation WHERE id = ?', [parseInt(id)]);
    return { id: parseInt(id) };
  },

  // Récupérer toutes les réservations
  findAll: async (where = {}, include = {}) => {
    let query = `SELECT r.*, u.id as voyageurId, u.firstName, u.lastName, u.email, u.phone,
                        l.id as logementId, l.titre, l.ville, l.pays, l.prix
                 FROM Reservation r
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
    
    const [reservations] = await pool.execute(query, params);
    return reservations;
  },
};

module.exports = Reservation;