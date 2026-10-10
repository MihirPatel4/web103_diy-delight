import { pool } from "./database.js";

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
    const { is_convertible, exterior, roof, wheels, interior, price, name } =
      req.body;
    const results = await pool.query(
      `
      INSERT INTO cars is_convertible, exterior, roof, wheels, interior, price, name
      VALUES ($1, $2, $3, $5, $5, $6, $7)
      RETURNING *
    `,
      [is_convertible, exterior, roof, wheels, interior, price, name],
    );
    res.status(201).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const editCar = async (req, res) => {
  try {
    const { is_convertible, exterior, roof, wheels, interior, price, name } =
      req.body;
    const id = parseInt(req.params.id);
    const results = await pool.query(
      `
      UPDATE cars
      SET is_convertible = $1, exterior = $2, roof = $3, wheels = $4, interior = $5, price = $6, name = $7
      WHERE id = $8
    `,
      [is_convertible, exterior, roof, wheels, interior, price, name, id],
    );
    res.status(200).json(results.rows);
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