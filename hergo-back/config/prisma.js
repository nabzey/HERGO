const { PrismaClient } = require('@prisma/client');

// Initialiser Prisma Client avec adapter (MySQL) ou accelerateUrl si disponible
const clientConfig = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
};

if (process.env.PRISMA_ACCELERATE_URL) {
  clientConfig.accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
} else if (process.env.DATABASE_URL) {
  clientConfig.datasourceUrl = process.env.DATABASE_URL;
}

const prisma = new PrismaClient(clientConfig);

// Test de connexion à la base de données
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Connexion à la base de données Prisma réussie');
    return true;
  } catch (error) {
    console.error('Erreur de connexion à la base de données Prisma:', error);
    process.exit(1);
  }
};

module.exports = { prisma, testConnection };