const productsModel = require('../models/productsModel');
const { validateProduct } = require('../utils/productValidation');

function parseProductId(value) {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function requireValidId(req, res) {
  const id = parseProductId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'El id debe ser un entero positivo.' });
    return null;
  }
  return id;
}

async function listProducts(req, res, next) {
  try {
    const products = await productsModel.findAll();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

async function getProduct(req, res, next) {
  const id = requireValidId(req, res);
  if (id === null) return;

  try {
    const product = await productsModel.findById(id);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado.' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  const validation = validateProduct(req.body);
  if (validation.error) {
    res.status(400).json({ error: validation.error });
    return;
  }

  try {
    const product = await productsModel.create(validation.value);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  const id = requireValidId(req, res);
  if (id === null) return;

  const validation = validateProduct(req.body);
  if (validation.error) {
    res.status(400).json({ error: validation.error });
    return;
  }

  try {
    const product = await productsModel.update(id, validation.value);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado.' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  const id = requireValidId(req, res);
  if (id === null) return;

  try {
    const deleted = await productsModel.remove(id);
    if (!deleted) {
      res.status(404).json({ error: 'Producto no encontrado.' });
      return;
    }
    res.status(200).json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
