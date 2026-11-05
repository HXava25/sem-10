const express = require('express');
const productsController = require('../controllers/productsController');

const router = express.Router();

function requireJsonContentType(req, res, next) {
  if (!req.is('application/json')) {
    res.status(415).json({ error: 'El Content-Type debe ser application/json.' });
    return;
  }
  next();
}

router.get('/', productsController.listProducts);
router.get('/:id', productsController.getProduct);
router.post('/', requireJsonContentType, productsController.createProduct);
router.put('/:id', requireJsonContentType, productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
