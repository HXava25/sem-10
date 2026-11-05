require('dotenv').config();

const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const pool = require('../src/config/db');

let server;
let baseUrl;
let createdProductId;

before(async () => {
  const connection = await pool.getConnection();
  connection.release();

  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}/api/products`;
});

after(async () => {
  if (createdProductId) {
    await pool.execute('DELETE FROM products WHERE id = ?', [createdProductId]);
  }
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await pool.end();
});

test('el ciclo CRUD completo funciona contra MySQL', async () => {
  const productName = `Producto de integración ${Date.now()}`;
  const listResponse = await fetch(baseUrl);
  assert.equal(listResponse.status, 200);
  assert.ok(Array.isArray(await listResponse.json()));

  const createResponse = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: productName,
      description: 'Registro temporal de integración',
      price: 12.35,
      stock: 7
    })
  });
  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  createdProductId = created.id;
  assert.equal(created.price, 12.35);
  assert.equal(created.stock, 7);

  const getResponse = await fetch(`${baseUrl}/${createdProductId}`);
  assert.equal(getResponse.status, 200);
  assert.equal((await getResponse.json()).name, productName);

  const updateResponse = await fetch(`${baseUrl}/${createdProductId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Producto actualizado',
      description: 'Actualizado desde integración',
      price: 20.5,
      stock: 9
    })
  });
  assert.equal(updateResponse.status, 200);
  const updated = await updateResponse.json();
  assert.equal(updated.name, 'Producto actualizado');
  assert.equal(updated.stock, 9);

  const deleteResponse = await fetch(`${baseUrl}/${createdProductId}`, {
    method: 'DELETE'
  });
  assert.equal(deleteResponse.status, 200);
  createdProductId = undefined;

  const missingResponse = await fetch(`${baseUrl}/${created.id}`);
  assert.equal(missingResponse.status, 404);
});
