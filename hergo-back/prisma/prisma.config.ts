import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';
import env from '../config/env';

// Configuration de la connexion MySQL pour Prisma
const mysqlConnection = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'zeynab',
  password: 'Diamniadio14@',
  database: 'hebergo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configuration pour Prisma Migrate
export const prismaMigrateConfig = {
  datasources: {
    db: {
      url: env.DATABASE_URL
    }
  }
};

// Configuration pour Prisma Client
const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: env.DATABASE_URL
    }
  }
});

export default prisma;