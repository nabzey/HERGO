const { pool } = require('./src/config/db');

async function migrate() {
  try {
    console.log('Adding paymentMethod column to "Payment" table...');
    // We use explicit quotes to bypass the automatic quoting if it fails
    await pool.execute('ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "paymentMethod" VARCHAR(50) DEFAULT \'STRIPE\'');
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    process.exit();
  }
}

migrate();
