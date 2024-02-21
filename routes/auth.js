// Importa los módulos necesarios para el router, encriptación de contraseñas, generación de tokens JWT y la conexión a la base de datos
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db');

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  try {
    // Extrae el email y la contraseña enviados en el cuerpo de la petición
    const { email, password } = req.body;

    // Valida que el email y la contraseña hayan sido proporcionados
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Busca al usuario por su email
    const user = await getUserByEmail(email);

    // Si no se encuentra el usuario, devuelve un error
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Comprueba que la contraseña proporcionada sea correcta
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Genera un token JWT para el usuario
    const token = generateToken(user.id, user.email);

    // Devuelve el token y los datos del usuario, excluyendo la contraseña
    res.json({ token, user: {...user, password: undefined} });
  } catch (error) {
    // Maneja cualquier error que ocurra durante el proceso
    console.error('Error en la autenticación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para registrar un nuevo usuario
router.post('/registro', async (req, res) => {
  try {
    // Extrae el nombre, email y contraseña del cuerpo de la petición
    let { nombre, email, password } = req.body;

    // Valida que todos los campos requeridos hayan sido proporcionados
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verifica si ya existe un usuario con el mismo email
    let user = await getUserByEmail(email);
    if (user) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Hashea la contraseña antes de guardarla en la base de datos
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);

    // Crea el nuevo usuario en la base de datos
    await crearUsuario(nombre, email, password);
    user = await getUserByEmail(email);

    // Devuelve los datos del nuevo usuario, excluyendo la contraseña
    res.status(201).json({
      id: user.id,
      nombre,
      email
    });
  } catch (error) {
    // Maneja cualquier error que ocurra durante el proceso
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Función para crear un usuario en la base de datos
async function crearUsuario(nombre, email, password) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?);', [nombre, email, password], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.insertId);
      }
    });
  });
}

// Función para obtener un usuario por su email de la base de datos
async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}

// Función para generar un token JWT
function generateToken(userId, userEmail) {
  const secret = process.env.JWT_SECRET; // Usa una variable de entorno para la clave secreta
  return jwt.sign({ id: userId, email: userEmail }, secret, { expiresIn: '1h' }); // El token expira en 1 hora
}

module.exports = router; // Exporta el router para su uso en otras partes de la aplicación
