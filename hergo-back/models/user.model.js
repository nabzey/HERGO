const { pool } = require('../config/db');

const User = {
  // Récupérer un utilisateur par ID
  findById: async (id) => {
    const [users] = await pool.execute('SELECT * FROM User WHERE id = ?', [parseInt(id)]);
    return users[0] || null;
  },

  // Récupérer un utilisateur par email
  findByEmail: async (email) => {
    const [users] = await pool.execute('SELECT * FROM User WHERE email = ?', [email]);
    return users[0] || null;
  },

  // Créer un utilisateur
  create: async (data) => {
    const [result] = await pool.execute(
      'INSERT INTO User (firstName, lastName, email, password, role, status, phone, avatar, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [data.firstName, data.lastName, data.email, data.password, data.role || 'VOYAGEUR', data.status || 'ACTIF', data.phone, data.avatar]
    );

    const [users] = await pool.execute('SELECT * FROM User WHERE id = ?', [result.insertId]);
    return users[0];
  },

  // Mettre à jour un utilisateur
  update: async (id, data) => {
    await pool.execute(
      'UPDATE User SET firstName = ?, lastName = ?, email = ?, phone = ?, avatar = ?, updatedAt = NOW() WHERE id = ?',
      [data.firstName, data.lastName, data.email, data.phone, data.avatar, parseInt(id)]
    );

    const [users] = await pool.execute('SELECT * FROM User WHERE id = ?', [parseInt(id)]);
    return users[0];
  },

  // Supprimer un utilisateur
  delete: async (id) => {
    await pool.execute('DELETE FROM User WHERE id = ?', [parseInt(id)]);
    return { id: parseInt(id) };
  },

  // Récupérer tous les utilisateurs
  findAll: async () => {
    const [users] = await pool.execute('SELECT * FROM User ORDER BY createdAt DESC');
    return users;
  },
};

module.exports = User;