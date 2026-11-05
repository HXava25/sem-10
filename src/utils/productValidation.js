const allowedFields = new Set(['name', 'description', 'price', 'stock']);

function validateProduct(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { error: 'El cuerpo debe ser un objeto JSON.' };
  }

  const unexpectedField = Object.keys(payload).find(
    (field) => !allowedFields.has(field)
  );
  if (unexpectedField) {
    return { error: `El campo "${unexpectedField}" no está permitido.` };
  }

  if (typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    return { error: 'El nombre es obligatorio y debe ser texto.' };
  }

  const name = payload.name.trim();
  if (name.length > 120) {
    return { error: 'El nombre no puede superar 120 caracteres.' };
  }

  const priceText =
    typeof payload.price === 'number' && Number.isFinite(payload.price)
      ? String(payload.price)
      : typeof payload.price === 'string'
        ? payload.price.trim()
        : '';
  if (!/^\d+(?:\.\d{1,2})?$/.test(priceText)) {
    if (/^\d+\.\d+$/.test(priceText)) {
      return { error: 'El precio debe tener como máximo dos decimales.' };
    }
    return { error: 'El precio es obligatorio y debe ser un número mayor o igual a 0.' };
  }

  const price = Number(priceText);
  if (price > 99999999.99) {
    return { error: 'El precio no puede superar 99999999.99.' };
  }

  let description = null;
  if (payload.description !== undefined && payload.description !== null) {
    if (typeof payload.description !== 'string') {
      return { error: 'La descripción debe ser texto o null.' };
    }
    if (payload.description.length > 5000) {
      return { error: 'La descripción no puede superar 5000 caracteres.' };
    }
    description = payload.description.trim() || null;
  }

  const stockText = payload.stock === undefined ? '0' : String(payload.stock);
  if (
    (typeof payload.stock !== 'undefined' &&
      typeof payload.stock !== 'number' &&
      typeof payload.stock !== 'string') ||
    !/^\d+$/.test(stockText)
  ) {
    return { error: 'El stock debe ser un número entero mayor o igual a 0.' };
  }
  const stock = Number(stockText);
  if (!Number.isSafeInteger(stock) || stock > 4294967295) {
    return { error: 'El stock supera el máximo permitido.' };
  }

  return {
    value: {
      name,
      description,
      price: Number(price.toFixed(2)),
      stock
    }
  };
}

module.exports = { validateProduct };
