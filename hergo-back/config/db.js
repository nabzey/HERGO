const mysql = require('mysql2/promise');
const env = require('./env');

// Configuration de la connexion MySQL direct
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'zeynab',
  password: 'Diamniadio14@',
  database: 'hebergo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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