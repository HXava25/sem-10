require('dotenv').config();

const app = require('./app');
const pool = require('./config/db');

const port = Number(process.env.PORT || 3000);
const server = app.listen(port, () => {
  console.log(`API disponible en http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} recibido; cerrando servidor y pool de MySQL...`);
  server.close(async (serverError) => {
    try {
      await pool.end();
    } catch (poolError) {
      console.error('No se pudo cerrar el pool de MySQL:', poolError);
      process.exitCode = 1;
    }
    if (serverError) {
      console.error('No se pudo cerrar el servidor HTTP:', serverError);
      process.exitCode = 1;
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
