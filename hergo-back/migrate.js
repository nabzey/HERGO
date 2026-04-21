require('dotenv').config();
const { Pool } = require('pg');

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log('Running migration...');
    await pgPool.query('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "ville" VARCHAR(255)');
    await pgPool.query('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pays" VARCHAR(255)');
    await pgPool.query('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bio" TEXT');
    
    // UserSettings table
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS "UserSettings" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL UNIQUE,
        "emailNotifications" BOOLEAN DEFAULT true,
        "reservationNotifications" BOOLEAN DEFAULT true,
        "departureReminders" BOOLEAN DEFAULT false,
        "monthlyNewsletter" BOOLEAN DEFAULT false,
        "language" VARCHAR(10) DEFAULT 'fr',
        "currency" VARCHAR(10) DEFAULT 'FCFA',
        "theme" VARCHAR(20) DEFAULT 'auto',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
