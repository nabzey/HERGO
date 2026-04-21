const { Pool } = require('pg');

const env = {
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/hergo?schema=public"
};

const pgPool = new Pool({
  connectionString: env.DATABASE_URL,
});

async function test() {
  try {
    console.log('Testing raw PG query...');
    // Trying without quotes first to see what PG says
    const result = await pgPool.query('SELECT * FROM "User" LIMIT 1');
    console.log('Success! Found user:', result.rows[0].email);
  } catch (error) {
    console.error('Error details:', error.message);
    if (error.hint) console.log('Hint:', error.hint);
  } finally {
    await pgPool.end();
    process.exit();
  }
}

test();
