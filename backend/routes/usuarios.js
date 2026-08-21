const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/usuarios - Listar todos los usuarios
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id_usuario, nombre, email, telefono, avatar, estado, rol, fecha_registro, created_at
       FROM usuarios ORDER BY nombre ASC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT id_usuario, nombre, email, telefono, avatar, estado, rol, fecha_registro, ultimo_acceso, created_at, updated_at
       FROM usuarios WHERE id_usuario = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `Usuario con ID ${id} no encontrado` });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/usuarios - Crear usuario
router.post('/', async (req, res, next) => {
  try {
    const { nombre, email, telefono, contraseña, avatar, estado, rol } = req.body;

    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ error: 'Los campos nombre, email y contraseña son obligatorios' });
    }

    const validEstados = ['activo', 'inactivo', 'bloqueado'];
    const validRoles = ['cliente', 'admin', 'vendedor'];

    const [result] = await pool.execute(
      `INSERT INTO usuarios (nombre, email, telefono, contraseña, avatar, estado, rol) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        email,
        telefono || null,
        contraseña,
        avatar || null,
        validEstados.includes(estado) ? estado : 'activo',
        validRoles.includes(rol) ? rol : 'cliente'
      ]
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario: {
        id_usuario: result.insertId,
        nombre,
        email,
        telefono: telefono || null,
        estado: validEstados.includes(estado) ? estado : 'activo',
        rol: validRoles.includes(rol) ? rol : 'cliente'
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/usuarios/:id - Actualizar usuario por ID
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, avatar, estado, rol } = req.body;

    const [existing] = await pool.execute('SELECT id_usuario FROM usuarios WHERE id_usuario = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Usuario con ID ${id} no encontrado` });
    }

    if (!nombre || !email) {
      return res.status(400).json({ error: 'Los campos nombre y email son obligatorios' });
    }

    const validEstados = ['activo', 'inactivo', 'bloqueado'];
    const validRoles = ['cliente', 'admin', 'vendedor'];

    await pool.execute(
      `UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, avatar = ?, estado = ?, rol = ? WHERE id_usuario = ?`,
      [
        nombre,
        email,
        telefono || null,
        avatar || null,
        validEstados.includes(estado) ? estado : 'activo',
        validRoles.includes(rol) ? rol : 'cliente',
        id
      ]
    );

    res.json({
      message: 'Usuario actualizado exitosamente',
      usuario: {
        id_usuario: Number(id),
        nombre,
        email,
        telefono: telefono || null,
        avatar: avatar || null,
        estado: validEstados.includes(estado) ? estado : 'activo',
        rol: validRoles.includes(rol) ? rol : 'cliente'
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/usuarios/:id - Eliminar usuario
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT nombre FROM usuarios WHERE id_usuario = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Usuario con ID ${id} no encontrado` });
    }

    await pool.execute('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
    res.json({
      message: `Usuario "${existing[0].nombre}" eliminado exitosamente`,
      deletedId: Number(id)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
