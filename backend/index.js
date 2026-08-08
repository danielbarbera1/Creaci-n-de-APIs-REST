const express = require('express');
const mysql = require('mysql2/promise'); // Usamos /promise para usar async/await
const cors = require('cors');

const app = express();

app.use(cors()); // Habilitas cors para aceptar peticiones de cualquier origen

// Middleware para que Express entienda el formato JSON si enviamos datos por POST
app.use(express.json());

// 1. Configuración de la base de datos (Valores por defecto de Laragon)
// const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: '123456', // Laragon viene sin contraseña por defecto
//     database: 'express' // ¡Cambiar por la BD real!
// };

//PRODUCCION
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

// 2. Crear una ruta (Endpoint GET) para exponer una API

// POST - Crear nuevo producto
app.post('/api/productos', async (req, res) => {
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

        // Validar campos obligatorios
        if (!nombre_producto || !id_marca || !id_categoria) {
            return res.status(400).json({
                error: 'Los campos nombre_producto, id_marca y id_categoria son obligatorios'
            });
        }

        const connection = await mysql.createConnection(dbConfig);

        // Iniciar transacción
        await connection.beginTransaction();

        // 1. Insertar el producto
        const [productResult] = await connection.execute(
            `INSERT INTO productos (nombre_producto, descripcion_detallada, id_marca, id_categoria, id_unidad) 
             VALUES (?, ?, ?, ?, ?)`,
            [nombre_producto, descripcion_detallada, id_marca, id_categoria, id_unidad || 1]
        );

        const id_producto = productResult.insertId;

        // 2. Insertar en inventario
        if (precio_publico || costo_proveedor || stock_actual) {
            await connection.execute(
                `INSERT INTO inventario (id_producto, id_ubicacion, precio_publico, costo_proveedor, stock_actual) 
                 VALUES (?, ?, ?, ?, ?)`,
                [id_producto, id_ubicacion || null, precio_publico || 0, costo_proveedor || 0, stock_actual || 0]
            );
        }

        // Confirmar transacción
        await connection.commit();

        // Obtener el producto creado
        const [newProduct] = await connection.execute(`
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

        await connection.end();

        res.status(201).json({
            message: 'Producto creado exitosamente',
            product: newProduct[0]
        });

    } catch (error) {
        console.error("Error:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'El producto ya existe' });
        } else {
            res.status(500).json({ error: 'Error al crear el producto', details: error.message });
        }
    }
});

// PUT - Actualizar producto completo
app.put('/api/productos/:id', async (req, res) => {
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

        // Validar ID
        if (isNaN(productId) || productId <= 0) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }

        const connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        // Verificar si el producto existe
        const [existingProduct] = await connection.execute(
            'SELECT id_producto FROM productos WHERE id_producto = ?',
            [productId]
        );

        if (existingProduct.length === 0) {
            await connection.rollback();
            await connection.end();
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Actualizar producto
        await connection.execute(
            `UPDATE productos 
             SET nombre_producto = ?, descripcion_detallada = ?, id_marca = ?, id_categoria = ?, id_unidad = ?
             WHERE id_producto = ?`,
            [nombre_producto, descripcion_detallada, id_marca, id_categoria, id_unidad, productId]
        );

        // Actualizar inventario
        await connection.execute(
            `UPDATE inventario 
             SET precio_publico = ?, costo_proveedor = ?, stock_actual = ?, id_ubicacion = ?
             WHERE id_producto = ?`,
            [precio_publico, costo_proveedor, stock_actual, id_ubicacion, productId]
        );

        await connection.commit();

        // Obtener producto actualizado
        const [updatedProduct] = await connection.execute(`
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

        await connection.end();

        res.json({
            message: 'Producto actualizado exitosamente',
            product: updatedProduct[0]
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
    }
});

// DELETE - Eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        if (isNaN(productId) || productId <= 0) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }

        const connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        // Verificar si el producto existe
        const [product] = await connection.execute(
            'SELECT nombre_producto FROM productos WHERE id_producto = ?',
            [productId]
        );

        if (product.length === 0) {
            await connection.rollback();
            await connection.end();
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Eliminar inventario primero (por la relación)
        await connection.execute(
            'DELETE FROM inventario WHERE id_producto = ?',
            [productId]
        );

        // Eliminar producto
        await connection.execute(
            'DELETE FROM productos WHERE id_producto = ?',
            [productId]
        );

        await connection.commit();
        await connection.end();

        res.json({
            message: `Producto "${product[0].nombre_producto}" eliminado exitosamente`,
            deletedId: parseInt(productId)
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
    }
});

app.get('/api/productos/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Validar que el ID sea un número
        if (isNaN(productId) || productId <= 0) {
            return res.status(400).json({
                error: 'ID de producto inválido. Debe ser un número positivo.'
            });
        }

        // Abrimos la conexión
        const connection = await mysql.createConnection(dbConfig);

        // Consulta SQL con todas las relaciones
        const [rows] = await connection.execute(`
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

        // Cerramos la conexión
        await connection.end();

        // Verificar si el producto existe
        if (rows.length === 0) {
            return res.status(404).json({
                error: `Producto con ID ${productId} no encontrado`
            });
        }

        // Tomamos el primer resultado (debería ser único)
        const product = rows[0];

        // Estructurar la respuesta con formato similar a DummyJSON
        const response = {
            // Información del producto
            id: product.id_producto,
            nombre: product.nombre_producto,
            descripcion: product.descripcion_detallada,

            // Relaciones
            marca: {
                id: product.id_marca,
                nombre: product.marca
            },
            categoria: {
                id: product.id_categoria,
                nombre: product.categoria
            },
            unidad: {
                id: product.id_unidad,
                nombre: product.unidad_medida,
                abreviatura: product.unidad_abreviatura
            },

            // Información de inventario
            inventario: {
                id: product.id_inventario,
                precio: parseFloat(product.precio_publico),
                costo: parseFloat(product.costo_proveedor),
                stock: product.stock_actual,
                min_stock: product.stock_minimo || 0,
                max_stock: product.stock_maximo || 0,
                estado: product.stock_actual > 0 ? 'In Stock' : 'Out of Stock'
            },

            // Ubicación
            ubicacion: {
                id: product.id_ubicacion,
                fullLocation: product.ubicacion_completa,
                aisle: product.pasillo,
                shelf: product.estante,
                zone: product.zona
            }
        };

        // Devolvemos los datos al cliente en formato JSON
        res.json(response);

    } catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).json({
            error: 'Hubo un problema al conectar con la base de datos',
            details: error.message
        });
    }
});

app.get('/api/productos/categories/:categoria', async (req, res) => {
    let connection;
    try {
        // El parámetro ahora es el slug
        const slug = req.params.categoria;
        const { brand, minPrice, maxPrice, search, sortBy, sortOrder = 'ASC', page = 1, limit = 10 } = req.query;

        // Validar que el slug no esté vacío
        if (!slug || slug.trim() === '') {
            return res.status(400).json({
                error: 'El slug de la categoría es requerido'
            });
        }

        connection = await mysql.createConnection(dbConfig);

        // PRIMERO: Obtener la categoría por su slug
        const [categoryResult] = await connection.execute(
            'SELECT id_categoria, nombre_categoria, slug FROM categorias WHERE slug = ?',
            [slug]
        );

        // Si no existe la categoría con ese slug
        if (categoryResult.length === 0) {
            // Verificar si existe alguna categoría con ese nombre (para compatibilidad)
            const [categoryByName] = await connection.execute(
                'SELECT id_categoria, nombre_categoria, slug FROM categorias WHERE nombre_categoria = ?',
                [slug.replace(/-/g, ' ')] // Intentar con el nombre normalizado
            );

            if (categoryByName.length === 0) {
                return res.status(404).json({
                    error: `La categoría con slug "${slug}" no existe`,
                    availableCategories: await getAvailableCategories(connection)
                });
            }

            // Si existe por nombre, redirigir al slug correcto
            return res.status(301).json({
                message: 'Redirigir al slug correcto',
                suggestedSlug: categoryByName[0].slug,
                category: categoryByName[0].nombre_categoria
            });
        }

        const categoriaId = categoryResult[0].id_categoria;
        const categoriaNombre = categoryResult[0].nombre_categoria;
        const categoriaSlug = categoryResult[0].slug;

        // Construir la consulta base con el ID de categoría
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
                ub.pasillo,
                ub.estante,
                ub.zona,
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

        // Agregar filtros adicionales
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

        // Ordenamiento
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

        // Paginación
        const parsedLimit = parseInt(limit, 10) || 10;
        const parsedPage = parseInt(page, 10) || 1;
        const offset = (parsedPage - 1) * parsedLimit;
        sql += ` LIMIT ${parsedLimit} OFFSET ${offset}`;

        // Ejecutar consulta
        const [rows] = await connection.execute(sql, params);

        // Contar el total de productos en esta categoría (con los mismos filtros)
        let countSql = `
            SELECT COUNT(*) as total 
            FROM productos p
            INNER JOIN categorias c ON p.id_categoria = c.id_categoria
            LEFT JOIN marcas m ON p.id_marca = m.id_marca
            LEFT JOIN inventario i ON p.id_producto = i.id_producto
            WHERE c.id_categoria = ?
        `;

        const countParams = [categoriaId];

        if (brand) {
            countSql += ` AND m.nombre_marca = ?`;
            countParams.push(brand);
        }
        if (minPrice) {
            countSql += ` AND i.precio_publico >= ?`;
            countParams.push(parseFloat(minPrice));
        }
        if (maxPrice) {
            countSql += ` AND i.precio_publico <= ?`;
            countParams.push(parseFloat(maxPrice));
        }
        if (search) {
            countSql += ` AND (p.nombre_producto LIKE ? OR p.descripcion_detallada LIKE ?)`;
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm);
        }

        const [countResult] = await connection.execute(countSql, countParams);
        const total = countResult[0].total;

        // Transformar los resultados para la respuesta
        const products = rows.map(product => ({
            id: product.id_producto,
            nombre: product.nombre_producto,
            slug: product.producto_slug,
            descripcion: product.descripcion_detallada,
            marca: {
                id: product.id_marca,
                nombre: product.marca
            },
            categoria: {
                id: product.id_categoria,
                nombre: product.categoria,
                slug: product.categoria_slug
            },
            unidad: {
                id: product.id_unidad,
                nombre: product.unidad_medida,
                abreviatura: product.unidad_abreviatura
            },
            inventario: {
                id: product.id_inventario,
                precio_publico: parseFloat(product.precio_publico),
                costo_proveedor: parseFloat(product.costo_proveedor),
                stock_actual: product.stock_actual,
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

        // Estructurar la respuesta
        const response = {
            categoria: {
                id: categoriaId,
                nombre: categoriaNombre,
                slug: categoriaSlug
            },
            total: total,
            page: parsedPage,
            limit: parsedLimit,
            totalPages: Math.ceil(total / parsedLimit),
            products: products,
            filtros_aplicados: {
                marca: brand || null,
                precio_minimo: minPrice || null,
                precio_maximo: maxPrice || null,
                busqueda: search || null,
                ordenar_por: sortBy || 'nombre_producto',
                orden: sortOrder
            },
            resumen: {
                total_stock: products.reduce((sum, p) => sum + p.inventario.stock_actual, 0),
                precio_promedio: products.length > 0 ?
                    (products.reduce((sum, p) => sum + p.inventario.precio_publico, 0) / products.length).toFixed(2) : 0,
                marcas_disponibles: [...new Set(products.map(p => p.marca.nombre))].filter(Boolean)
            }
        };

        // Enviar la respuesta al cliente
        res.json(response);

    } catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).json({
            error: 'Hubo un problema al conectar con la base de datos',
            details: error.message
        });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});


// FUNCIÓN AUXILIAR PARA OBTENER CATEGORÍAS DISPONIBLES
async function getAvailableCategories(existingConnection) {
    try {
        // Reutilizar la conexión si ya existe, si no crear una nueva
        const connection = existingConnection || await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT nombre_categoria, slug FROM categorias ORDER BY nombre_categoria'
        );
        // Solo cerrar si creamos una conexión nueva
        if (!existingConnection) await connection.end();
        return rows.map(row => ({
            nombre: row.nombre_categoria,
            slug: row.slug
        }));
    } catch (error) {
        console.error("Error obteniendo categorías:", error);
        return [];
    }
}

app.get('/api/productos', async (req, res) => {
    try {
        // Abrimos la conexión
        const connection = await mysql.createConnection(dbConfig);

        // Ejecutamos la consulta SQL
        const [rows] = await connection.execute('SELECT id_producto,nombre_producto,descripcion_detallada,id_marca,id_categoria,id_unidad FROM productos'); // Cambiar 'usuarios' por tu tabla

        // Cerramos la conexión para no saturar la base de datos
        await connection.end();

        // Devolvemos los datos al cliente en formato JSON
        res.json(rows);

    } catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).json({ error: 'Hubo un problema al conectar con la base de datos' });
    }
});

app.get('/api/marcas', async (req, res) => {
    try {
        // Abrimos la conexión
        const connection = await mysql.createConnection(dbConfig);

        // Ejecutamos la consulta SQL
        const [rows] = await connection.execute('SELECT id_marca,nombre_marca FROM marcas');

        // Cerramos la conexión
        await connection.end();

        // Devolvemos los datos al cliente en formato JSON
        res.json(rows);
    } catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).json({ error: 'Hubo un problema al conectar con la base de datos' });
    }

});


app.get('/api/categorias', async (req, res) => {
    try {
        // Abrimos la conexión
        const connection = await mysql.createConnection(dbConfig);

        // Ejecutamos la consulta SQL
        const [rows] = await connection.execute('SELECT id_categoria,nombre_categoria,descripcion_categoria FROM categorias'); // Cambiar 'usuarios' por tu tabla

        // Cerramos la conexión para no saturar la base de datos
        await connection.end();

        // Devolvemos los datos al cliente en formato JSON
        res.json(rows);

    } catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).json({ error: 'Hubo un problema al conectar con la base de datos' });
    }
});

app.get('/api/ubicaciones', async (req, res) => {
    try {
        // Abrimos la conexión
        const connection = await mysql.createConnection(dbConfig);

        // Ejecutamos la consulta SQL
        const [rows] = await connection.execute('SELECT id_ubicacion,pasillo,estante,ubicacion_completa FROM ubicaciones'); // Cambiar 'usuarios' por tu tabla

        // Cerramos la conexión para no saturar la base de datos
        await connection.end();

        // Devolvemos los datos al cliente en formato JSON
        res.json(rows);

    } catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).json({ error: 'Hubo un problema al conectar con la base de datos' });
    }
});


// 3. Levantar el servidor (solo en desarrollo local)
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
        console.log(`Prueba la API en http://localhost:${PORT}/api/productos`);
    });
}

// 4. Exportar la app para Vercel Serverless
module.exports = app;