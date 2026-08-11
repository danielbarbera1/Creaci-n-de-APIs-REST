const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const validate = require('../middlewares/validate');
const {
  createProductSchema,
  updateProductSchema,
  patchProductSchema
} = require('../schemas/productos.schema');



// Función auxiliar para generar slug
function createSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace
    .replace(/-+/g, "-"); // collapse dashes
}

// Función auxiliar para obtener categorías disponibles
async function getAvailableCategories() {
  try {
    const [rows] = await pool.execute(
      'SELECT nombre_categoria, slug FROM categorias ORDER BY nombre_categoria'
    );
    return rows.map(row => ({
      nombre: row.nombre_categoria,
      slug: row.slug
    }));
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return [];
  }
}

// 1. GET /api/productos/search?q=taladro - Búsqueda global en todos los productos
router.get('/search', async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        error: 'El parámetro de búsqueda "q" es requerido. Ejemplo: /api/productos/search?q=taladro'
      });
    }

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const offset = (parsedPage - 1) * parsedLimit;
    const searchTerm = `%${q.trim()}%`;

    const countSql = `
      SELECT COUNT(*) as total 
      FROM productos p 
      WHERE p.nombre_producto LIKE ? OR p.descripcion_detallada LIKE ?
    `;
    const [countResult] = await pool.execute(countSql, [searchTerm, searchTerm]);
    const total = countResult[0].total;

    const sql = `
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.descripcion_detallada,
        p.slug AS producto_slug,
        m.id_marca,
        m.nombre_marca AS marca,
        c.id_categoria,
        c.nombre_categoria AS categoria,
        c.slug AS categoria_slug,
        u.id_unidad,
        u.nombre_unidad AS unidad_medida,
        u.abreviatura AS unidad_abreviatura,
        i.id_inventario,
        i.precio_publico,
        i.costo_proveedor,
        i.stock_actual,
        i.stock_minimo,
        i.stock_maximo,
        ub.id_ubicacion,
        ub.ubicacion_completa
      FROM productos p
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN unidades_medida u ON p.id_unidad = u.id_unidad
      LEFT JOIN inventario i ON p.id_producto = i.id_producto
      LEFT JOIN ubicaciones ub ON i.id_ubicacion = ub.id_ubicacion
      WHERE p.nombre_producto LIKE ? OR p.descripcion_detallada LIKE ?
      ORDER BY p.nombre_producto ASC
      LIMIT ${parsedLimit} OFFSET ${offset}
    `;

    const [rows] = await pool.execute(sql, [searchTerm, searchTerm]);

    const products = rows.map(p => ({
      id: p.id_producto,
      nombre: p.nombre_producto,
      slug: p.producto_slug,
      descripcion: p.descripcion_detallada,
      marca: { id: p.id_marca, nombre: p.marca },
      categoria: { id: p.id_categoria, nombre: p.categoria, slug: p.categoria_slug },
      unidad: { id: p.id_unidad, nombre: p.unidad_medida, abreviatura: p.unidad_abreviatura },
      inventario: {
        id: p.id_inventario,
        precio_publico: parseFloat(p.precio_publico || 0),
        costo_proveedor: parseFloat(p.costo_proveedor || 0),
        stock_actual: p.stock_actual || 0
      },
      ubicacion: { id: p.id_ubicacion, ubicacion_completa: p.ubicacion_completa }
    }));

    res.json({
      query: q,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
      products
    });

  } catch (error) {
    next(error);
  }
});

// 2. GET /api/productos/categories/:categoria - Filtrado por slug de categoría con paginación
router.get('/categories/:categoria', async (req, res, next) => {
  try {
    const slug = req.params.categoria;
    const { brand, minPrice, maxPrice, search, sortBy, sortOrder = 'ASC', page = 1, limit = 10 } = req.query;

    if (!slug || slug.trim() === '') {
      return res.status(400).json({ error: 'El slug de la categoría es requerido' });
    }

    const [categoryResult] = await pool.execute(
      'SELECT id_categoria, nombre_categoria, slug FROM categorias WHERE slug = ?',
      [slug]
    );

    if (categoryResult.length === 0) {
      const [categoryByName] = await pool.execute(
        'SELECT id_categoria, nombre_categoria, slug FROM categorias WHERE nombre_categoria = ?',
        [slug.replace(/-/g, ' ')]
      );

      if (categoryByName.length === 0) {
        return res.status(404).json({
          error: `La categoría con slug "${slug}" no existe`,
          availableCategories: await getAvailableCategories()
        });
      }

      return res.status(301).json({
        message: 'Redirigir al slug correcto',
        suggestedSlug: categoryByName[0].slug,
        category: categoryByName[0].nombre_categoria
      });
    }

    const categoriaId = categoryResult[0].id_categoria;
    const categoriaNombre = categoryResult[0].nombre_categoria;
    const categoriaSlug = categoryResult[0].slug;

    let sql = `
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.descripcion_detallada,
        p.slug AS producto_slug,
        m.id_marca,
        m.nombre_marca AS marca,
        c.id_categoria,
        c.nombre_categoria AS categoria,
        c.slug AS categoria_slug,
        u.id_unidad,
        u.nombre_unidad AS unidad_medida,
        u.abreviatura AS unidad_abreviatura,
        i.id_inventario,
        i.precio_publico,
        i.costo_proveedor,
        i.stock_actual,
        i.stock_minimo,
        i.stock_maximo,
        ub.id_ubicacion,
        ub.ubicacion_completa,
        p.created_at,
        p.updated_at
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN unidades_medida u ON p.id_unidad = u.id_unidad
      LEFT JOIN inventario i ON p.id_producto = i.id_producto
      LEFT JOIN ubicaciones ub ON i.id_ubicacion = ub.id_ubicacion
      WHERE c.id_categoria = ?
    `;

    const params = [categoriaId];

    if (brand) {
      sql += ` AND m.nombre_marca = ?`;
      params.push(brand);
    }
    if (minPrice) {
      sql += ` AND i.precio_publico >= ?`;
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      sql += ` AND i.precio_publico <= ?`;
      params.push(parseFloat(maxPrice));
    }
    if (search) {
      sql += ` AND (p.nombre_producto LIKE ? OR p.descripcion_detallada LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    const validSortColumns = ['id_producto', 'nombre_producto', 'precio_publico', 'stock_actual', 'marca'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'nombre_producto';
    const sortDirection = String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let orderByField = sortColumn;
    if (sortColumn === 'precio_publico') orderByField = 'i.precio_publico';
    else if (sortColumn === 'stock_actual') orderByField = 'i.stock_actual';
    else if (sortColumn === 'marca') orderByField = 'm.nombre_marca';
    else if (sortColumn === 'id_producto') orderByField = 'p.id_producto';
    else if (sortColumn === 'nombre_producto') orderByField = 'p.nombre_producto';

    sql += ` ORDER BY ${orderByField} ${sortDirection}`;

    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedPage = parseInt(page, 10) || 1;
    const offset = (parsedPage - 1) * parsedLimit;
    sql += ` LIMIT ${parsedLimit} OFFSET ${offset}`;

    const [rows] = await pool.execute(sql, params);

    let countSql = `
      SELECT COUNT(*) as total 
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN inventario i ON p.id_producto = i.id_producto
      WHERE c.id_categoria = ?
    `;
    const countParams = [categoriaId];

    if (brand) { countSql += ` AND m.nombre_marca = ?`; countParams.push(brand); }
    if (minPrice) { countSql += ` AND i.precio_publico >= ?`; countParams.push(parseFloat(minPrice)); }
    if (maxPrice) { countSql += ` AND i.precio_publico <= ?`; countParams.push(parseFloat(maxPrice)); }
    if (search) {
      countSql += ` AND (p.nombre_producto LIKE ? OR p.descripcion_detallada LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countSql, countParams);
    const total = countResult[0].total;

    const products = rows.map(product => ({
      id: product.id_producto,
      nombre: product.nombre_producto,
      slug: product.producto_slug,
      descripcion: product.descripcion_detallada,
      marca: { id: product.id_marca, nombre: product.marca },
      categoria: { id: product.id_categoria, nombre: product.categoria, slug: product.categoria_slug },
      unidad: { id: product.id_unidad, nombre: product.unidad_medida, abreviatura: product.unidad_abreviatura },
      inventario: {
        id: product.id_inventario,
        precio_publico: parseFloat(product.precio_publico || 0),
        costo_proveedor: parseFloat(product.costo_proveedor || 0),
        stock_actual: product.stock_actual || 0,
        stock_minimo: product.stock_minimo || 0,
        stock_maximo: product.stock_maximo || 0,
        disponibilidad: product.stock_actual > 0 ? 'In Stock' : 'Out of Stock'
      },
      ubicacion: {
        id: product.id_ubicacion,
        ubicacion_completa: product.ubicacion_completa,
        pasillo: product.pasillo,
        estante: product.estante,
        zona: product.zona
      },
      created_at: product.created_at,
      updated_at: product.updated_at
    }));

    res.json({
      categoria: { id: categoriaId, nombre: categoriaNombre, slug: categoriaSlug },
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
      products,
      filtros_aplicados: {
        marca: brand || null,
        precio_minimo: minPrice || null,
        precio_maximo: maxPrice || null,
        busqueda: search || null,
        ordenar_por: sortBy || 'nombre_producto',
        orden: sortOrder
      }
    });

  } catch (error) {
    next(error);
  }
});

// 3. GET /api/productos - Obtener todos los productos (con paginación opcional via ?page=1&limit=10)
router.get('/', async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    if (page || limit) {
      const parsedPage = parseInt(page, 10) || 1;
      const parsedLimit = parseInt(limit, 10) || 10;
      const offset = (parsedPage - 1) * parsedLimit;

      const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM productos');
      const total = countResult[0].total;

      const [rows] = await pool.execute(`
        SELECT 
          p.id_producto,
          p.nombre_producto,
          p.descripcion_detallada,
          p.id_marca,
          m.nombre_marca AS marca,
          p.id_categoria,
          c.nombre_categoria AS categoria,
          p.id_unidad,
          i.precio_publico,
          i.costo_proveedor,
          i.stock_actual
        FROM productos p
        LEFT JOIN marcas m ON p.id_marca = m.id_marca
        LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
        LEFT JOIN inventario i ON p.id_producto = i.id_producto
        ORDER BY p.id_producto DESC
        LIMIT ${parsedLimit} OFFSET ${offset}
      `);

      return res.json({
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
        products: rows
      });
    }

    // Sin paginación: devuelve la lista de productos
    const [rows] = await pool.execute(`
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.descripcion_detallada,
        p.id_marca,
        m.nombre_marca AS marca,
        p.id_categoria,
        c.nombre_categoria AS categoria,
        p.id_unidad,
        i.precio_publico,
        i.costo_proveedor,
        i.stock_actual
      FROM productos p
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN inventario i ON p.id_producto = i.id_producto
      ORDER BY p.id_producto DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// 4. GET /api/productos/:id - Obtener un producto por ID con todas sus relaciones
router.get('/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;

    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ error: 'ID de producto inválido. Debe ser un número positivo.' });
    }

    const [rows] = await pool.execute(`
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.descripcion_detallada,
        m.id_marca,
        m.nombre_marca AS marca,
        c.id_categoria,
        c.nombre_categoria AS categoria,
        u.id_unidad,
        u.nombre_unidad AS unidad_medida,
        u.abreviatura AS unidad_abreviatura,
        i.id_inventario,
        i.precio_publico,
        i.costo_proveedor,
        i.stock_actual,
        i.stock_minimo,
        i.stock_maximo,
        ub.id_ubicacion,
        ub.pasillo,
        ub.estante,
        ub.zona,
        ub.ubicacion_completa
      FROM productos p
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN unidades_medida u ON p.id_unidad = u.id_unidad
      LEFT JOIN inventario i ON p.id_producto = i.id_producto
      LEFT JOIN ubicaciones ub ON i.id_ubicacion = ub.id_ubicacion
      WHERE p.id_producto = ?
    `, [productId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: `Producto con ID ${productId} no encontrado` });
    }

    const product = rows[0];

    res.json({
      id: product.id_producto,
      nombre: product.nombre_producto,
      descripcion: product.descripcion_detallada,
      marca: { id: product.id_marca, nombre: product.marca },
      categoria: { id: product.id_categoria, nombre: product.categoria },
      unidad: { id: product.id_unidad, nombre: product.unidad_medida, abreviatura: product.unidad_abreviatura },
      inventario: {
        id: product.id_inventario,
        precio: parseFloat(product.precio_publico || 0),
        costo: parseFloat(product.costo_proveedor || 0),
        stock: product.stock_actual || 0,
        min_stock: product.stock_minimo || 0,
        max_stock: product.stock_maximo || 0,
        estado: (product.stock_actual || 0) > 0 ? 'In Stock' : 'Out of Stock'
      },
      ubicacion: {
        id: product.id_ubicacion,
        fullLocation: product.ubicacion_completa,
        aisle: product.pasillo,
        shelf: product.estante,
        zone: product.zona
      }
    });

  } catch (error) {
    next(error);
  }
});

// 5. POST /api/productos - Crear nuevo producto (con validación Zod y transacción)
router.post('/', validate(createProductSchema), async (req, res, next) => {
  let conn;
  try {
    const {
      nombre_producto,
      descripcion_detallada,
      id_marca,
      id_categoria,
      id_unidad,
      precio_publico,
      costo_proveedor,
      stock_actual,
      id_ubicacion
    } = req.body;

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const slug = createSlug(nombre_producto);

    const [productResult] = await conn.execute(
      `INSERT INTO productos (nombre_producto, descripcion_detallada, id_marca, id_categoria, id_unidad, slug) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre_producto, descripcion_detallada || null, id_marca, id_categoria, id_unidad || 1, slug]
    );

    const id_producto = productResult.insertId;

    await conn.execute(
      `INSERT INTO inventario (id_producto, id_ubicacion, precio_publico, costo_proveedor, stock_actual, slug) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_producto, id_ubicacion || null, precio_publico || 0, costo_proveedor || 0, stock_actual || 0, slug]
    );

    await conn.commit();

    const [newProduct] = await conn.execute(`
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.descripcion_detallada,
        m.nombre_marca AS marca,
        c.nombre_categoria AS categoria,
        i.precio_publico,
        i.costo_proveedor,
        i.stock_actual,
        ub.ubicacion_completa
      FROM productos p
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN inventario i ON p.id_producto = i.id_producto
      LEFT JOIN ubicaciones ub ON i.id_ubicacion = ub.id_ubicacion
      WHERE p.id_producto = ?
    `, [id_producto]);

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: newProduct[0]
    });

  } catch (error) {
    if (conn) await conn.rollback();
    next(error);
  } finally {
    if (conn) conn.release();
  }
});

// 6. PUT /api/productos/:id - Actualización completa de producto
router.put('/:id', validate(updateProductSchema), async (req, res, next) => {
  let conn;
  try {
    const productId = req.params.id;
    const {
      nombre_producto,
      descripcion_detallada,
      id_marca,
      id_categoria,
      id_unidad,
      precio_publico,
      costo_proveedor,
      stock_actual,
      id_ubicacion
    } = req.body;

    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [existingProduct] = await conn.execute(
      'SELECT id_producto FROM productos WHERE id_producto = ?',
      [productId]
    );

    if (existingProduct.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const slug = createSlug(nombre_producto);

    await conn.execute(
      `UPDATE productos 
       SET nombre_producto = ?, descripcion_detallada = ?, id_marca = ?, id_categoria = ?, id_unidad = ?, slug = ?
       WHERE id_producto = ?`,
      [nombre_producto, descripcion_detallada || null, id_marca, id_categoria, id_unidad || 1, slug, productId]
    );

    await conn.execute(
      `UPDATE inventario 
       SET precio_publico = ?, costo_proveedor = ?, stock_actual = ?, id_ubicacion = ?, slug = ?
       WHERE id_producto = ?`,
      [precio_publico || 0, costo_proveedor || 0, stock_actual || 0, id_ubicacion || null, slug, productId]
    );

    await conn.commit();

    const [updatedProduct] = await conn.execute(`
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.descripcion_detallada,
        m.nombre_marca AS marca,
        c.nombre_categoria AS categoria,
        i.precio_publico,
        i.costo_proveedor,
        i.stock_actual,
        ub.ubicacion_completa
      FROM productos p
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN inventario i ON p.id_producto = i.id_producto
      LEFT JOIN ubicaciones ub ON i.id_ubicacion = ub.id_ubicacion
      WHERE p.id_producto = ?
    `, [productId]);

    res.json({
      message: 'Producto actualizado exitosamente',
      product: updatedProduct[0]
    });

  } catch (error) {
    if (conn) await conn.rollback();
    next(error);
  } finally {
    if (conn) conn.release();
  }
});

// 7. PATCH /api/productos/:id - Actualización parcial de un producto
router.patch('/:id', validate(patchProductSchema), async (req, res, next) => {
  let conn;
  try {
    const productId = req.params.id;
    const body = req.body;

    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    if (Object.keys(body).length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar al menos un campo para actualizar.' });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [existingProduct] = await conn.execute(
      'SELECT id_producto FROM productos WHERE id_producto = ?',
      [productId]
    );

    if (existingProduct.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar tabla productos si hay campos presentes
    const productFields = ['nombre_producto', 'descripcion_detallada', 'id_marca', 'id_categoria', 'id_unidad'];
    const productUpdates = [];
    const productParams = [];

    for (const field of productFields) {
      if (body[field] !== undefined) {
        productUpdates.push(`${field} = ?`);
        productParams.push(body[field]);
      }
    }

    if (productUpdates.length > 0) {
      productParams.push(productId);
      await conn.execute(
        `UPDATE productos SET ${productUpdates.join(', ')} WHERE id_producto = ?`,
        productParams
      );
    }

    // Actualizar tabla inventario si hay campos presentes
    const inventoryFields = ['precio_publico', 'costo_proveedor', 'stock_actual', 'id_ubicacion'];
    const inventoryUpdates = [];
    const inventoryParams = [];

    for (const field of inventoryFields) {
      if (body[field] !== undefined) {
        inventoryUpdates.push(`${field} = ?`);
        inventoryParams.push(body[field]);
      }
    }

    if (inventoryUpdates.length > 0) {
      inventoryParams.push(productId);
      await conn.execute(
        `UPDATE inventario SET ${inventoryUpdates.join(', ')} WHERE id_producto = ?`,
        inventoryParams
      );
    }

    await conn.commit();

    const [updatedProduct] = await conn.execute(`
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.descripcion_detallada,
        m.nombre_marca AS marca,
        c.nombre_categoria AS categoria,
        i.precio_publico,
        i.costo_proveedor,
        i.stock_actual,
        ub.ubicacion_completa
      FROM productos p
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN inventario i ON p.id_producto = i.id_producto
      LEFT JOIN ubicaciones ub ON i.id_ubicacion = ub.id_ubicacion
      WHERE p.id_producto = ?
    `, [productId]);

    res.json({
      message: 'Producto actualizado parcialmente (PATCH) exitosamente',
      product: updatedProduct[0]
    });

  } catch (error) {
    if (conn) await conn.rollback();
    next(error);
  } finally {
    if (conn) conn.release();
  }
});

// 8. DELETE /api/productos/:id - Eliminar producto
router.delete('/:id', async (req, res, next) => {
  let conn;
  try {
    const productId = req.params.id;

    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [product] = await conn.execute(
      'SELECT nombre_producto FROM productos WHERE id_producto = ?',
      [productId]
    );

    if (product.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await conn.execute('DELETE FROM inventario WHERE id_producto = ?', [productId]);
    await conn.execute('DELETE FROM productos WHERE id_producto = ?', [productId]);

    await conn.commit();

    res.json({
      message: `Producto "${product[0].nombre_producto}" eliminado exitosamente`,
      deletedId: parseInt(productId, 10)
    });

  } catch (error) {
    if (conn) await conn.rollback();
    next(error);
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
