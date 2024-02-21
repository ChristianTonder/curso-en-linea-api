require('dotenv').config(); // Carga las variables de entorno.
const mysql = require('mysql'); // Importa el módulo MySQL para conexión a bases de datos MySQL.

// Configuración de la conexión a la base de datos.
const dbConfig = {
  connectionLimit: 10, // Número máximo de conexiones de conexión.
  host: process.env.DB_HOST, // Dirección del servidor de la base de datos.
  user: process.env.DB_USER, // Usuario de la base de datos.
  password: process.env.DB_PASSWORD, // Contraseña del usuario de la base de datos.
  database: process.env.DB_DATABASE, // Nombre de la base de datos a usar.
};

// Crea un pool de conexiones.
const pool = mysql.createPool(dbConfig);

// Intenta obtener una conexión del pool.
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error de conexión a la base de datos: ' + err.message); // Registra un error si no se puede conectar.
    return;
  }
  console.log('Conexión a la base de datos establecida'); // Confirma la conexión exitosa.
  connection.release(); // Libera la conexión al pool.
});

module.exports = pool; // Exporta el pool para ser usado en otras partes de la aplicación.
