const { pool } = require('./db');

// Test de connexion à la base de données
const testConnection = async () => {
  try {
    const [rows] = await pool.execute('SELECT 1');
    console.log('Connexion à la base de données réussie');
    return true;
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
};

module.exports = { pool, testConnection };