const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const validate = require('../middlewares/validate');
const { ubicacionSchema, updateUbicacionSchema } = require('../schemas/ubicaciones.schema');

// GET /api/ubicaciones - Listar todas las ubicaciones
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id_ubicacion, pasillo, estante, zona, ubicacion_completa FROM ubicaciones ORDER BY id_ubicacion ASC'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/ubicaciones/:id - Obtener ubicación por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT id_ubicacion, pasillo, estante, zona, ubicacion_completa FROM ubicaciones WHERE id_ubicacion = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `Ubicación con ID ${id} no encontrada` });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/ubicaciones - Crear nueva ubicación
router.post('/', validate(ubicacionSchema), async (req, res, next) => {
  try {
    const { pasillo, estante, zona, ubicacion_completa } = req.body;

    const fullLocation = ubicacion_completa ||
      [pasillo && `Pasillo ${pasillo}`, estante && `Estante ${estante}`, zona && `Zona ${zona}`].filter(Boolean).join(' - ') ||
      'Sin especificar';

    const [result] = await pool.execute(
      'INSERT INTO ubicaciones (pasillo, estante, zona, ubicacion_completa) VALUES (?, ?, ?, ?)',
      [pasillo || null, estante || null, zona || null, fullLocation]
    );

    res.status(201).json({
      message: 'Ubicación creada exitosamente',
      ubicacion: {
        id_ubicacion: result.insertId,
        pasillo: pasillo || null,
        estante: estante || null,
        zona: zona || null,
        ubicacion_completa: fullLocation
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/ubicaciones/:id - Actualizar ubicación por ID
router.put('/:id', validate(ubicacionSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pasillo, estante, zona, ubicacion_completa } = req.body;

    const [existing] = await pool.execute('SELECT id_ubicacion FROM ubicaciones WHERE id_ubicacion = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Ubicación con ID ${id} no encontrada` });
    }

    const fullLocation = ubicacion_completa ||
      [pasillo && `Pasillo ${pasillo}`, estante && `Estante ${estante}`, zona && `Zona ${zona}`].filter(Boolean).join(' - ') ||
      'Sin especificar';

    await pool.execute(
      'UPDATE ubicaciones SET pasillo = ?, estante = ?, zona = ?, ubicacion_completa = ? WHERE id_ubicacion = ?',
      [pasillo || null, estante || null, zona || null, fullLocation, id]
    );

    res.json({
      message: 'Ubicación actualizada exitosamente',
      ubicacion: {
        id_ubicacion: Number(id),
        pasillo: pasillo || null,
        estante: estante || null,
        zona: zona || null,
        ubicacion_completa: fullLocation
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/ubicaciones/:id - Eliminar ubicación
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT ubicacion_completa FROM ubicaciones WHERE id_ubicacion = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Ubicación con ID ${id} no encontrada` });
    }

    await pool.execute('DELETE FROM ubicaciones WHERE id_ubicacion = ?', [id]);
    res.json({
      message: `Ubicación "${existing[0].ubicacion_completa}" eliminada exitosamente`,
      deletedId: Number(id)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
