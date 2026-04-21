const adminService = require('./src/services/admin.service');
const { pool } = require('./src/config/db');

async function test() {
  try {
    console.log('Testing adminService.getAllUsers()...');
    const users = await adminService.getAllUsers();
    console.log('Success! Found', users.length, 'users');
  } catch (error) {
    console.error('Error in getAllUsers:', error.message);
    if (error.detail) console.error('Detail:', error.detail);
    if (error.query) console.error('Query:', error.query);
  } finally {
    process.exit();
  }
}

test();
