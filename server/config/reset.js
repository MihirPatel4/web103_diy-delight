import dotenv from "dotenv";
import { pool } from "./database.js";

dotenv.config();

const createCarsTable = async () => {
  try {
    await pool.query("DROP TABLE IF EXISTS cars")
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        exterior VARCHAR(255),
        roof VARCHAR(255),
        wheels VARCHAR(255),
        interior VARCHAR(255),
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