const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const TIPOS_VALIDOS = ['porcentaje', 'monto_fijo', 'envio_gratis', 'producto_gratis'];
const ESTADOS_VALIDOS = ['activa', 'inactiva', 'expirada'];
const APLICA_VALIDOS = ['todos', 'categorias', 'productos'];

// GET /api/promociones - Listar todas las promociones
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id_promocion, codigo, nombre, descripcion, tipo, valor, monto_minimo,
              cantidad_maxima_uso, usos_totales, limite_usos_totales,
              fecha_inicio, fecha_fin, aplica_a, estado, created_at
       FROM promociones ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/promociones/:id - Obtener promoción por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT id_promocion, codigo, nombre, descripcion, tipo, valor, monto_minimo,
              cantidad_maxima_uso, usos_totales, limite_usos_totales,
              fecha_inicio, fecha_fin, aplica_a, estado, created_at, updated_at
       FROM promociones WHERE id_promocion = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `Promoción con ID ${id} no encontrada` });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// GET /api/promociones/codigo/:codigo - Buscar por código de cupón
router.get('/codigo/:codigo', async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.execute(
      `SELECT id_promocion, codigo, nombre, tipo, valor, monto_minimo, fecha_inicio, fecha_fin, estado
       FROM promociones WHERE codigo = ? AND estado = 'activa'`,
      [codigo]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `Código de promoción "${codigo}" no válido o expirado` });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/promociones - Crear promoción
router.post('/', async (req, res, next) => {
  try {
    const {
      codigo, nombre, descripcion, tipo, valor, monto_minimo,
      cantidad_maxima_uso, limite_usos_totales, fecha_inicio, fecha_fin, aplica_a, estado
    } = req.body;

    if (!codigo || !nombre || !tipo || valor === undefined || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Los campos codigo, nombre, tipo, valor, fecha_inicio y fecha_fin son obligatorios' });
    }

    if (!TIPOS_VALIDOS.includes(tipo)) {
      return res.status(400).json({ error: `El tipo debe ser uno de: ${TIPOS_VALIDOS.join(', ')}` });
    }

    const [result] = await pool.execute(
      `INSERT INTO promociones (codigo, nombre, descripcion, tipo, valor, monto_minimo, cantidad_maxima_uso, limite_usos_totales, fecha_inicio, fecha_fin, aplica_a, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo.toUpperCase(),
        nombre,
        descripcion || null,
        tipo,
        valor,
        monto_minimo || 0,
        cantidad_maxima_uso || 1,
        limite_usos_totales || null,
        fecha_inicio,
        fecha_fin,
        APLICA_VALIDOS.includes(aplica_a) ? aplica_a : 'todos',
        ESTADOS_VALIDOS.includes(estado) ? estado : 'activa'
      ]
    );

    res.status(201).json({
      message: 'Promoción creada exitosamente',
      promocion: {
        id_promocion: result.insertId,
        codigo: codigo.toUpperCase(),
        nombre,
        tipo,
        valor,
        fecha_inicio,
        fecha_fin,
        estado: ESTADOS_VALIDOS.includes(estado) ? estado : 'activa'
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/promociones/:id - Actualizar promoción por ID
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nombre, descripcion, tipo, valor, monto_minimo,
      cantidad_maxima_uso, limite_usos_totales, fecha_inicio, fecha_fin, aplica_a, estado
    } = req.body;

    const [existing] = await pool.execute('SELECT id_promocion FROM promociones WHERE id_promocion = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Promoción con ID ${id} no encontrada` });
    }

    if (!nombre || !tipo || valor === undefined || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Los campos nombre, tipo, valor, fecha_inicio y fecha_fin son obligatorios' });
    }

    await pool.execute(
      `UPDATE promociones SET nombre = ?, descripcion = ?, tipo = ?, valor = ?, monto_minimo = ?,
       cantidad_maxima_uso = ?, limite_usos_totales = ?, fecha_inicio = ?, fecha_fin = ?, aplica_a = ?, estado = ?
       WHERE id_promocion = ?`,
      [
        nombre,
        descripcion || null,
        TIPOS_VALIDOS.includes(tipo) ? tipo : 'porcentaje',
        valor,
        monto_minimo || 0,
        cantidad_maxima_uso || 1,
        limite_usos_totales || null,
        fecha_inicio,
        fecha_fin,
        APLICA_VALIDOS.includes(aplica_a) ? aplica_a : 'todos',
        ESTADOS_VALIDOS.includes(estado) ? estado : 'activa',
        id
      ]
    );

    res.json({
      message: 'Promoción actualizada exitosamente',
      promocion: { id_promocion: Number(id), nombre, tipo, valor, estado }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/promociones/:id - Eliminar promoción
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT nombre, codigo FROM promociones WHERE id_promocion = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Promoción con ID ${id} no encontrada` });
    }

    await pool.execute('DELETE FROM promociones WHERE id_promocion = ?', [id]);
    res.json({
      message: `Promoción "${existing[0].nombre}" (${existing[0].codigo}) eliminada exitosamente`,
      deletedId: Number(id)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
