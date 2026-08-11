const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const validate = require('../middlewares/validate');
const { categoriaSchema, updateCategoriaSchema } = require('../schemas/categorias.schema');

// Función auxiliar para generar slug
function createSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^a-z0-9 -]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-') // Espacios por guiones
    .replace(/-+/g, '-') // Eliminar guiones repetidos
    .trim();
}

// GET /api/categorias - Listar todas las categorías
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id_categoria, nombre_categoria, descripcion_categoria, slug FROM categorias ORDER BY nombre_categoria ASC'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/categorias/:id - Obtener categoría por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT id_categoria, nombre_categoria, descripcion_categoria, slug FROM categorias WHERE id_categoria = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `Categoría con ID ${id} no encontrada` });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/categorias - Crear categoría con generación automática de slug
router.post('/', validate(categoriaSchema), async (req, res, next) => {
  try {
    const { nombre_categoria, descripcion_categoria, slug } = req.body;
    const finalSlug = slug ? createSlug(slug) : createSlug(nombre_categoria);

    const [result] = await pool.execute(
      'INSERT INTO categorias (nombre_categoria, descripcion_categoria, slug) VALUES (?, ?, ?)',
      [nombre_categoria, descripcion_categoria || null, finalSlug]
    );

    res.status(201).json({
      message: 'Categoría creada exitosamente',
      categoria: {
        id_categoria: result.insertId,
        nombre_categoria,
        descripcion_categoria: descripcion_categoria || null,
        slug: finalSlug
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/categorias/:id - Actualizar categoría por ID
router.put('/:id', validate(categoriaSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_categoria, descripcion_categoria, slug } = req.body;

    const [existing] = await pool.execute('SELECT id_categoria FROM categorias WHERE id_categoria = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Categoría con ID ${id} no encontrada` });
    }

    const finalSlug = slug ? createSlug(slug) : createSlug(nombre_categoria);

    await pool.execute(
      'UPDATE categorias SET nombre_categoria = ?, descripcion_categoria = ?, slug = ? WHERE id_categoria = ?',
      [nombre_categoria, descripcion_categoria || null, finalSlug, id]
    );

    res.json({
      message: 'Categoría actualizada exitosamente',
      categoria: {
        id_categoria: Number(id),
        nombre_categoria,
        descripcion_categoria: descripcion_categoria || null,
        slug: finalSlug
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/categorias/:id - Eliminar categoría
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT nombre_categoria FROM categorias WHERE id_categoria = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Categoría con ID ${id} no encontrada` });
    }

    await pool.execute('DELETE FROM categorias WHERE id_categoria = ?', [id]);
    res.json({
      message: `Categoría "${existing[0].nombre_categoria}" eliminada exitosamente`,
      deletedId: Number(id)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
