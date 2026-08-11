const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const validate = require('../middlewares/validate');
const { marcaSchema, updateMarcaSchema } = require('../schemas/marcas.schema');

// GET /api/marcas - Listar todas las marcas
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT id_marca, nombre_marca FROM marcas ORDER BY nombre_marca ASC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/marcas/:id - Obtener marca por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT id_marca, nombre_marca FROM marcas WHERE id_marca = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: `Marca con ID ${id} no encontrada` });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/marcas - Crear nueva marca
router.post('/', validate(marcaSchema), async (req, res, next) => {
  try {
    const { nombre_marca } = req.body;
    const [result] = await pool.execute('INSERT INTO marcas (nombre_marca) VALUES (?)', [nombre_marca]);
    res.status(201).json({
      message: 'Marca creada exitosamente',
      marca: { id_marca: result.insertId, nombre_marca }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/marcas/:id - Actualizar marca por ID
router.put('/:id', validate(marcaSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_marca } = req.body;

    const [existing] = await pool.execute('SELECT id_marca FROM marcas WHERE id_marca = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Marca con ID ${id} no encontrada` });
    }

    await pool.execute('UPDATE marcas SET nombre_marca = ? WHERE id_marca = ?', [nombre_marca, id]);
    res.json({
      message: 'Marca actualizada exitosamente',
      marca: { id_marca: Number(id), nombre_marca }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/marcas/:id - Eliminar marca
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT nombre_marca FROM marcas WHERE id_marca = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Marca con ID ${id} no encontrada` });
    }

    await pool.execute('DELETE FROM marcas WHERE id_marca = ?', [id]);
    res.json({
      message: `Marca "${existing[0].nombre_marca}" eliminada exitosamente`,
      deletedId: Number(id)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
