const { pool } = require('./src/config/db');

async function create() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS "Favori" (
        "id" SERIAL PRIMARY KEY,
        "idVoyageur" INTEGER NOT NULL,
        "idLogement" INTEGER NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("idVoyageur") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        FOREIGN KEY ("idLogement") REFERENCES "Logement"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `);
    console.log("Table Favori created");
  } catch (err) {
    console.error("Error creating table", err);
  } finally {
    process.exit(0);
  }
}
create();
