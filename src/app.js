const path = require('path');
const express = require('express');
const cors = require('cors');
const productsRoutes = require('./routes/productsRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.use('/api/products', productsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
