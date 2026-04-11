const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const env = require('./env');

const prismaConfig = {};

if (env.PRISMA_ACCELERATE_URL) {
  prismaConfig.accelerateUrl = env.PRISMA_ACCELERATE_URL;
} else {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be defined for Prisma Client');
  }
  prismaConfig.adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
  });
}

const prisma = new PrismaClient(prismaConfig);

// Test de connexion à la base de données
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Connexion à la base de données réussie');
    return true;
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
};

module.exports = { prisma, testConnection };