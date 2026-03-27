const app = require('./app');
const env = require('../config/env');
const { testConnection } = require('../config/db');

const startServer = async () => {
  try {
    await testConnection();

    app.listen(env.PORT, () => {
      console.log(`\n➜  Local:   http://localhost:${env.PORT}/\n`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();