const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const TIPOS_VALIDOS = ['porcentaje', 'monto_fijo'];
const ESTADOS_VALIDOS = ['activo', 'inactivo'];
const APLICA_VALIDOS = ['todos', 'categorias', 'productos'];

// GET /api/descuentos - Listar todos los descuentos por volumen
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id_descuento_volumen, nombre, descripcion, cantidad_minima, cantidad_maxima,
              tipo, valor, aplica_a, estado, created_at
       FROM descuentos_volumen ORDER BY cantidad_minima ASC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/descuentos/:id - Obtener descuento por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT d.id_descuento_volumen, d.nombre, d.descripcion, d.cantidad_minima, d.cantidad_maxima,
              d.tipo, d.valor, d.aplica_a, d.estado, d.created_at, d.updated_at
       FROM descuentos_volumen d
       WHERE d.id_descuento_volumen = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `Descuento con ID ${id} no encontrado` });
    }

    // Obtener productos o categorías asociadas
    const [productos] = await pool.execute(
      `SELECT dvp.id_producto, p.nombre_producto
       FROM descuentos_volumen_productos dvp
       LEFT JOIN productos p ON dvp.id_producto = p.id_producto
       WHERE dvp.id_descuento_volumen = ?`,
      [id]
    );

    const [categorias] = await pool.execute(
      `SELECT dvc.id_categoria, c.nombre_categoria
       FROM descuentos_volumen_categorias dvc
       LEFT JOIN categorias c ON dvc.id_categoria = c.id_categoria
       WHERE dvc.id_descuento_volumen = ?`,
      [id]
    );

    res.json({ ...rows[0], productos_asociados: productos, categorias_asociadas: categorias });
  } catch (error) {
    next(error);
  }
});

// POST /api/descuentos - Crear descuento por volumen
router.post('/', async (req, res, next) => {
  try {
    const { nombre, descripcion, cantidad_minima, cantidad_maxima, tipo, valor, aplica_a, estado } = req.body;

    if (!nombre || cantidad_minima === undefined || !tipo || valor === undefined) {
      return res.status(400).json({ error: 'Los campos nombre, cantidad_minima, tipo y valor son obligatorios' });
    }

    if (!TIPOS_VALIDOS.includes(tipo)) {
      return res.status(400).json({ error: `El tipo debe ser uno de: ${TIPOS_VALIDOS.join(', ')}` });
    }

    if (tipo === 'porcentaje' && (valor < 0 || valor > 100)) {
      return res.status(400).json({ error: 'El valor porcentaje debe estar entre 0 y 100' });
    }

    const [result] = await pool.execute(
      `INSERT INTO descuentos_volumen (nombre, descripcion, cantidad_minima, cantidad_maxima, tipo, valor, aplica_a, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion || null,
        cantidad_minima,
        cantidad_maxima || null,
        tipo,
        valor,
        APLICA_VALIDOS.includes(aplica_a) ? aplica_a : 'todos',
        ESTADOS_VALIDOS.includes(estado) ? estado : 'activo'
      ]
    );

    res.status(201).json({
      message: 'Descuento por volumen creado exitosamente',
      descuento: {
        id_descuento_volumen: result.insertId,
        nombre,
        cantidad_minima,
        cantidad_maxima: cantidad_maxima || null,
        tipo,
        valor,
        aplica_a: APLICA_VALIDOS.includes(aplica_a) ? aplica_a : 'todos',
        estado: ESTADOS_VALIDOS.includes(estado) ? estado : 'activo'
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/descuentos/:id - Actualizar descuento por ID
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, cantidad_minima, cantidad_maxima, tipo, valor, aplica_a, estado } = req.body;

    const [existing] = await pool.execute('SELECT id_descuento_volumen FROM descuentos_volumen WHERE id_descuento_volumen = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Descuento con ID ${id} no encontrado` });
    }

    if (!nombre || cantidad_minima === undefined || !tipo || valor === undefined) {
      return res.status(400).json({ error: 'Los campos nombre, cantidad_minima, tipo y valor son obligatorios' });
    }

    await pool.execute(
      `UPDATE descuentos_volumen SET nombre = ?, descripcion = ?, cantidad_minima = ?, cantidad_maxima = ?,
       tipo = ?, valor = ?, aplica_a = ?, estado = ?
       WHERE id_descuento_volumen = ?`,
      [
        nombre,
        descripcion || null,
        cantidad_minima,
        cantidad_maxima || null,
        TIPOS_VALIDOS.includes(tipo) ? tipo : 'porcentaje',
        valor,
        APLICA_VALIDOS.includes(aplica_a) ? aplica_a : 'todos',
        ESTADOS_VALIDOS.includes(estado) ? estado : 'activo',
        id
      ]
    );

    res.json({
      message: 'Descuento actualizado exitosamente',
      descuento: { id_descuento_volumen: Number(id), nombre, cantidad_minima, tipo, valor, estado }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/descuentos/:id - Eliminar descuento
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT nombre FROM descuentos_volumen WHERE id_descuento_volumen = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Descuento con ID ${id} no encontrado` });
    }

    await pool.execute('DELETE FROM descuentos_volumen WHERE id_descuento_volumen = ?', [id]);
    res.json({
      message: `Descuento "${existing[0].nombre}" eliminado exitosamente`,
      deletedId: Number(id)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
