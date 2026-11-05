const test = require('node:test');
const assert = require('node:assert/strict');
const { validateProduct } = require('../src/utils/productValidation');

test('valida un producto correcto y normaliza sus valores', () => {
  const result = validateProduct({
    name: '  Teclado  ',
    description: '  Mecánico  ',
    price: '49.90',
    stock: '3'
  });

  assert.deepEqual(result, {
    value: {
      name: 'Teclado',
      description: 'Mecánico',
      price: 49.9,
      stock: 3
    }
  });
});

test('usa valores predeterminados para descripción y stock', () => {
  const result = validateProduct({ name: 'Mouse', price: 0 });

  assert.deepEqual(result.value, {
    name: 'Mouse',
    description: null,
    price: 0,
    stock: 0
  });
});

test('rechaza campos obligatorios inválidos, cantidades negativas y campos extra', () => {
  assert.match(validateProduct({ name: ' ', price: 1 }).error, /nombre/i);
  assert.match(validateProduct({ name: 'Monitor', price: -1 }).error, /precio/i);
  assert.match(
    validateProduct({ name: 'Monitor', price: 1, stock: 1.5 }).error,
    /stock/i
  );
  assert.match(
    validateProduct({ name: 'Monitor', price: 1, admin: true }).error,
    /no está permitido/i
  );
});

test('rechaza importes con más de dos decimales y cuerpos no-objeto', () => {
  assert.match(validateProduct({ name: 'Cable', price: 1.239 }).error, /decimales/i);
  assert.match(validateProduct([]).error, /objeto JSON/i);
});

test('acepta precios decimales válidos sin depender de precisión de punto flotante', () => {
  assert.equal(validateProduct({ name: 'Cable', price: 1.15 }).value.price, 1.15);
});

test('rechaza valores numéricos fuera de los límites de MySQL', () => {
  assert.match(
    validateProduct({ name: 'Cable', price: 100000000 }).error,
    /superar/i
  );
  assert.match(
    validateProduct({ name: 'Cable', price: 1, stock: 4294967296 }).error,
    /máximo/i
  );
});
