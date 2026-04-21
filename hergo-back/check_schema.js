const { Pool } = require('pg');

const env = {
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/hergo?schema=public"
};

const pgPool = new Pool({
  connectionString: env.DATABASE_URL,
});

async function test() {
  try {
    console.log('Checking User table columns...');
    const result = await pgPool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User'
    `);
    console.log('Columns in "User" table:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type})`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pgPool.end();
    process.exit();
  }
}

test();
