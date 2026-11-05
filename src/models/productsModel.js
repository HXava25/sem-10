const pool = require('../config/db');

const productColumns =
  'id, name, description, price, stock, created_at, updated_at';

async function findAll() {
  const [products] = await pool.execute(
    `SELECT ${productColumns} FROM products ORDER BY id`
  );
  return products;
}

async function findById(id) {
  const [products] = await pool.execute(
    `SELECT ${productColumns} FROM products WHERE id = ?`,
    [id]
  );
  return products[0] || null;
}

async function create(product) {
  const { name, description, price, stock } = product;
  const [result] = await pool.execute(
    'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
    [name, description, price, stock]
  );
  return findById(result.insertId);
}

async function update(id, product) {
  const { name, description, price, stock } = product;
  await pool.execute(
    'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
    [name, description, price, stock, id]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.execute(
    'DELETE FROM products WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };
