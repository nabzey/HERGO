const { pool } = require('./src/config/db');

async function migrate() {
  try {
    console.log('Adding resetOtp and resetOtpExpires columns to User table...');
    
    // We use ALTER TABLE. We don't quote them here because we want to see if it works raw first, 
    // but better use the pool.execute which handles quoting if we add them to quotedIdentifiers.
    
    await pool.execute('ALTER TABLE User ADD COLUMN IF NOT EXISTS resetOtp VARCHAR(255)');
    await pool.execute('ALTER TABLE User ADD COLUMN IF NOT EXISTS resetOtpExpires TIMESTAMP');
    
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    process.exit();
  }
}

migrate();
