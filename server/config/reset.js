import { pool } from "./database.js";

const createCarsTable = async () => {
  try {
    await pool.query(`DROP TABLE IF EXISTS cars`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        is_convertible BOOLEAN NOT NULL,
        exterior VARCHAR(255) NOT NULL,
        roof VARCHAR(255) NOT NULL,
        wheels VARCHAR(255) NOT NULL,
        interior VARCHAR(255) NOT NULL,
        price NUMERIC(12, 2) NOT NULL,
        name VARCHAR(255) NOT NULL
      )
    `);
    console.log("Successfully created cars table");
  } catch (error) {
    console.error("Error creating cars table", error);
  }
};

createCarsTable();