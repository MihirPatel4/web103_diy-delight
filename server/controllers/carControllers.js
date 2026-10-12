import { pool } from "../config/database.js";

const getAllCars = async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT * 
      FROM cars 
      ORDER BY id DESC
    `);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getCar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const results = await pool.query(
      `
      SELECT *
      FROM cars
      WHERE id = $1
    `,
      [id],
    );
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const createCar = async (req, res) => {
  try {
    const { exterior, roof, wheels, interior, price, name } =
      req.body;
    const results = await pool.query(
      `
      INSERT INTO cars (exterior, roof, wheels, interior, price, name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [exterior, roof, wheels, interior, price, name],
    );
    res.status(201).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const editCar = async (req, res) => {
  try {
    const { exterior, roof, wheels, interior, price, name } =
      req.body;
    const id = parseInt(req.params.id);
    const results = await pool.query(
      `
      UPDATE cars
      SET exterior = $1, roof = $2, wheels = $3, interior = $4, price = $5, name = $6
      WHERE id = $7
    `,
      [exterior, roof, wheels, interior, price, name, id],
    );
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const results = await pool.query(
      `
      DELETE FROM cars
      WHERE id = $1
    `,
      [id],
    );
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default { getAllCars, getCar, createCar, editCar, deleteCar };