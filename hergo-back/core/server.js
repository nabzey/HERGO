const app = require('./app');
const env = require('../config/env');
const { testConnection } = require('../config/db');

// Démarrer le serveur
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    await testConnection();

    // Démarrer le serveur
    app.listen(env.PORT, () => {
      console.log(`Serveur démarré sur le port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();