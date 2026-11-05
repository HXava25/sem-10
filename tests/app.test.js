const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('health responde JSON y estado 200', async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('POST exige Content-Type application/json', async () => {
  const response = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    body: 'name=Producto'
  });

  assert.equal(response.status, 415);
  assert.match((await response.json()).error, /Content-Type/i);
});

test('JSON mal formado devuelve 400 en formato JSON', async () => {
  const response = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{'
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /JSON inválido/i);
});

test('los ids inválidos devuelven 400 antes de consultar la base de datos', async () => {
  const response = await fetch(`${baseUrl}/api/products/abc`);

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /entero positivo/i);
});

test('las solicitudes POST inválidas devuelven 400 sin acceder a MySQL', async () => {
  const response = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: ' ', price: 4 })
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /nombre/i);
});
