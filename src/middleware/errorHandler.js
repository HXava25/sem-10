function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Ruta no encontrada.' });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'El cuerpo de la solicitud contiene JSON inválido.' });
    return;
  }
  if (error.type === 'entity.too.large') {
    res.status(413).json({ error: 'El cuerpo de la solicitud supera el límite permitido.' });
    return;
  }

  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor.' });
}

module.exports = { notFoundHandler, errorHandler };
