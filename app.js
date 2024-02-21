require('dotenv').config(); // Carga las variables de entorno desde un archivo .env.
const express = require('express'); // Importa Express para manejar las solicitudes HTTP.
const helmet = require('helmet'); // Helmet ayuda a proteger la aplicación de algunas vulnerabilidades web conocidas configurando los encabezados HTTP de manera adecuada.
const app = express(); // Crea una instancia de Express.
const port = process.env.PORT || 3000; // Define el puerto de la aplicación basándose en las variables de entorno o usa 3000 por defecto.

// Importación de rutas
const cursosRouter = require('./routes/cursos');
const authRouter = require('./routes/auth');

// Middlewares
app.use(helmet()); // Añade Helmet como middleware para mejorar la seguridad.
app.use(express.json()); // Permite a la aplicación manejar JSON en el cuerpo de las solicitudes.

// Definición de rutas
app.use('/api/cursos', cursosRouter); // Usa cursosRouter para todas las solicitudes a /api/cursos.
app.use('/api/auth', authRouter); // Usa authRouter para todas las solicitudes a /api/auth.

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack); // Registra el error en la consola.
  res.status(500).send('Error del servidor'); // Envía una respuesta genérica de error del servidor.
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`); // Muestra un mensaje cuando el servidor comienza a escuchar.
});
