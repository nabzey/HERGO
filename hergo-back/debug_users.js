const { pool } = require('./src/config/db');

async function test() {
  try {
    console.log('Testing getAllUsers query...');
    const [users] = await pool.execute(`
        SELECT id, firstName, lastName, email, role, status, phone, avatar, createdAt, updatedAt
        FROM User
      `);
    console.log('Success! Found', users.length, 'users');
  } catch (error) {
    console.error('Error details:', error);
  } finally {
    process.exit();
  }
}

test();
