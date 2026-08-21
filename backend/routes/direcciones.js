const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/direcciones - Listar todas las direcciones
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id_direccion, id_usuario, nombre_direccion, calle, distrito, ciudad, codigo_postal, referencia, telefono, es_principal, created_at
       FROM direcciones_envio ORDER BY id_direccion ASC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/direcciones/:id - Obtener dirección por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT id_direccion, id_usuario, nombre_direccion, calle, distrito, ciudad, codigo_postal, referencia, telefono, es_principal, latitud, longitud, created_at, updated_at
       FROM direcciones_envio WHERE id_direccion = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `Dirección con ID ${id} no encontrada` });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/direcciones - Crear dirección
router.post('/', async (req, res, next) => {
  try {
    const { id_usuario, nombre_direccion, calle, distrito, ciudad, codigo_postal, referencia, telefono, es_principal, latitud, longitud } = req.body;

    if (!id_usuario || !calle || !distrito || !ciudad) {
      return res.status(400).json({ error: 'Los campos id_usuario, calle, distrito y ciudad son obligatorios' });
    }

    const [result] = await pool.execute(
      `INSERT INTO direcciones_envio (id_usuario, nombre_direccion, calle, distrito, ciudad, codigo_postal, referencia, telefono, es_principal, latitud, longitud)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_usuario,
        nombre_direccion || 'Mi dirección',
        calle,
        distrito,
        ciudad,
        codigo_postal || null,
        referencia || null,
        telefono || null,
        es_principal ? 1 : 0,
        latitud || null,
        longitud || null
      ]
    );

    res.status(201).json({
      message: 'Dirección creada exitosamente',
      direccion: {
        id_direccion: result.insertId,
        id_usuario,
        nombre_direccion: nombre_direccion || 'Mi dirección',
        calle,
        distrito,
        ciudad,
        codigo_postal: codigo_postal || null,
        referencia: referencia || null,
        telefono: telefono || null,
        es_principal: es_principal ? 1 : 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/direcciones/:id - Actualizar dirección por ID
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_direccion, calle, distrito, ciudad, codigo_postal, referencia, telefono, es_principal, latitud, longitud } = req.body;

    const [existing] = await pool.execute('SELECT id_direccion FROM direcciones_envio WHERE id_direccion = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Dirección con ID ${id} no encontrada` });
    }

    if (!calle || !distrito || !ciudad) {
      return res.status(400).json({ error: 'Los campos calle, distrito y ciudad son obligatorios' });
    }

    await pool.execute(
      `UPDATE direcciones_envio SET nombre_direccion = ?, calle = ?, distrito = ?, ciudad = ?, codigo_postal = ?, referencia = ?, telefono = ?, es_principal = ?, latitud = ?, longitud = ?
       WHERE id_direccion = ?`,
      [
        nombre_direccion || 'Mi dirección',
        calle,
        distrito,
        ciudad,
        codigo_postal || null,
        referencia || null,
        telefono || null,
        es_principal ? 1 : 0,
        latitud || null,
        longitud || null,
        id
      ]
    );

    res.json({
      message: 'Dirección actualizada exitosamente',
      direccion: {
        id_direccion: Number(id),
        nombre_direccion: nombre_direccion || 'Mi dirección',
        calle,
        distrito,
        ciudad,
        codigo_postal: codigo_postal || null,
        referencia: referencia || null,
        telefono: telefono || null,
        es_principal: es_principal ? 1 : 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/direcciones/:id - Eliminar dirección
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT calle, distrito FROM direcciones_envio WHERE id_direccion = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Dirección con ID ${id} no encontrada` });
    }

    await pool.execute('DELETE FROM direcciones_envio WHERE id_direccion = ?', [id]);
    res.json({
      message: `Dirección "${existing[0].calle}, ${existing[0].distrito}" eliminada exitosamente`,
      deletedId: Number(id)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
