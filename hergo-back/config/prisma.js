const { PrismaClient } = require('@prisma/client');

// Initialiser Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

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