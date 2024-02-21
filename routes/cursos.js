// Importaciones necesarias para el router y la conexión a la base de datos
const express = require('express');
const router = express.Router(); // Crear un router para manejar las rutas específicas de cursos
const connection = require('../db'); // Importar la configuración de conexión a la base de datos

// Obtener todos los cursos
router.get('/', (req, res) => {
  try {
    // Ejecutar consulta SQL para obtener todos los cursos
    connection.query('SELECT * FROM cursos', (error, results) => {
      if (error) {
        // Manejar el error si ocurre uno durante la consulta
        console.error('Error al obtener los cursos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener los cursos' });
        return;
      }
      // Enviar los resultados de la consulta como respuesta JSON
      res.json(results);
    });
  } catch (error) {
    // Capturar y manejar cualquier error inesperado en el proceso de solicitud
    console.error('Error en la solicitud:', error);
    res.status(500).json({ error: 'Error en la solicitud' });
  }
});

// Obtener un curso específico por ID
router.get('/:id', (req, res) => {
  try {
    const courseId = req.params.id; // Obtener el ID del curso desde el parámetro de la URL

    // Ejecutar consulta SQL para obtener el curso con el ID específico
    connection.query('SELECT * FROM cursos WHERE id = ?', [courseId], (error, results) => {
      if (error) {
        // Manejar el error si ocurre uno durante la consulta
        console.error('Error al obtener el curso por ID:', error);
        res.status(500).json({ error: 'Error del servidor al obtener el curso por ID' });
        return;
      }

      if (results.length === 0) {
        // Si no se encuentra el curso, enviar un error 404
        res.status(404).json({ error: 'Curso no encontrado' });
        return;
      }

      // Enviar el curso encontrado como respuesta JSON
      res.json(results[0]);
    });
  } catch (error) {
    // Capturar y manejar cualquier error inesperado en el proceso de solicitud
    console.error('Error en la solicitud:', error);
    res.status(500).json({ error: 'Error en la solicitud' });
  }
});

// Crear un nuevo curso
router.post('/', (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { nombre, descripcion, instructor, precio } = req.body;

    // Ejecutar consulta SQL para insertar el nuevo curso con los datos proporcionados
    connection.query(
      'INSERT INTO cursos (nombre, descripcion, instructor, precio) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, instructor, precio],
      (error, results) => {
        if (error) {
          // Manejar el error si ocurre uno durante la inserción
          console.error('Error al crear el nuevo curso:', error);
          res.status(500).json({ error: 'Error del servidor al crear el nuevo curso' });
          return;
        }

        // Enviar una respuesta JSON confirmando la creación del curso
        res.json({ id: results.insertId, mensaje: 'Curso creado exitosamente' });
      }
    );
  } catch (error) {
    // Capturar y manejar cualquier error inesperado en el proceso de solicitud
    console.error('Error en la solicitud:', error);
    res.status(500).json({ error: 'Error en la solicitud' });
  }
});

// Actualizar un curso existente
router.put('/:id', (req, res) => {
  try {
    const courseId = req.params.id; // Obtener el ID del curso desde el parámetro de la URL
    // Extraer los datos actualizados del cuerpo de la solicitud
    const { nombre, descripcion, instructor, precio } = req.body;

    // Ejecutar consulta SQL para actualizar el curso con el ID específico con los nuevos datos
    connection.query(
      'UPDATE cursos SET nombre = ?, descripcion = ?, instructor = ?, precio = ? WHERE id = ?',
      [nombre, descripcion, instructor, precio, courseId],
      (error) => {
        if (error) {
          // Manejar el error si ocurre uno durante la actualización
          console.error('Error al actualizar el curso por ID:', error);
          res.status(500).json({ error: 'Error del servidor al actualizar el curso por ID' });
          return;
        }

        // Enviar una respuesta JSON confirmando la actualización del curso
        res.json({ mensaje: 'Curso actualizado exitosamente' });
      }
    );
  } catch (error) {
    // Capturar y manejar cualquier error inesperado en el proceso de solicitud
    console.error('Error en la solicitud:', error);
    res.status(500).json({ error: 'Error en la solicitud' });
  }
});

// Eliminar un curso
router.delete('/:id', (req, res) => {
  try {
    const courseId = req.params.id; // Obtener el ID del curso desde el parámetro de la URL

    // Ejecutar consulta SQL para eliminar el curso con el ID específico
    connection.query('DELETE FROM cursos WHERE id = ?', [courseId], (error) => {
      if (error) {
        // Manejar el error si ocurre uno durante la eliminación
        console.error('Error al eliminar el curso por ID:', error);
        res.status(500).json({ error: 'Error del servidor al eliminar el curso por ID' });
        return;
      }

      // Enviar una respuesta JSON confirmando la eliminación del curso
      res.json({ mensaje: 'Curso eliminado exitosamente' });
    });
  } catch (error) {
    // Capturar y manejar cualquier error inesperado en el proceso de solicitud
    console.error('Error en la solicitud:', error);
    res.status(500).json({ error: 'Error en la solicitud' });
  }
});

// Exportar el router para ser utilizado en el archivo principal de la aplicación (app.js)
module.exports = router;
