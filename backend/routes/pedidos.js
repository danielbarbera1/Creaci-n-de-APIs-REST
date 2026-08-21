const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const ESTADOS_VALIDOS = ['pendiente', 'confirmado', 'preparando', 'en_camino', 'entregado', 'cancelado', 'devuelto'];
const ESTADOS_PAGO_VALIDOS = ['pendiente', 'pagado', 'fallido', 'reembolsado'];

// Función para generar número de pedido único
function generarNumeroPedido() {
  const ts = Date.now().toString().slice(-6);
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${ts}${rand}`;
}

// GET /api/pedidos - Listar todos los pedidos
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.id_pedido, p.id_usuario, p.numero_pedido, p.subtotal, p.descuento, p.impuesto, p.costo_envio, p.total,
              p.estado, p.estado_pago, p.fecha_pedido, p.fecha_entrega_estimada, p.fecha_entrega_real,
              u.nombre AS nombre_usuario
       FROM pedidos p
       LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
       ORDER BY p.fecha_pedido DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/pedidos/:id - Obtener pedido por ID con sus productos
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT p.id_pedido, p.id_usuario, p.numero_pedido, p.subtotal, p.descuento, p.impuesto, p.costo_envio, p.total,
              p.estado, p.estado_pago, p.notas, p.fecha_pedido, p.fecha_entrega_estimada, p.fecha_entrega_real,
              u.nombre AS nombre_usuario
       FROM pedidos p
       LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
       WHERE p.id_pedido = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `Pedido con ID ${id} no encontrado` });
    }

    // Obtener detalle de productos del pedido
    const [detalle] = await pool.execute(
      `SELECT dp.id_detalle_pedido, dp.id_producto, dp.cantidad, dp.precio_unitario, dp.subtotal,
              pr.nombre_producto
       FROM detalle_pedidos dp
       LEFT JOIN productos pr ON dp.id_producto = pr.id_producto
       WHERE dp.id_pedido = ?`,
      [id]
    );

    res.json({ ...rows[0], productos: detalle });
  } catch (error) {
    next(error);
  }
});

// POST /api/pedidos - Crear pedido
router.post('/', async (req, res, next) => {
  try {
    const {
      id_usuario, id_direccion_envio, id_metodo_pago,
      subtotal, descuento, impuesto, costo_envio, total,
      estado, estado_pago, notas, fecha_entrega_estimada
    } = req.body;

    if (!id_usuario || !subtotal || !total) {
      return res.status(400).json({ error: 'Los campos id_usuario, subtotal y total son obligatorios' });
    }

    const numero_pedido = generarNumeroPedido();

    const [result] = await pool.execute(
      `INSERT INTO pedidos (id_usuario, id_direccion_envio, id_metodo_pago, numero_pedido, subtotal, descuento, impuesto, costo_envio, total, estado, estado_pago, notas, fecha_entrega_estimada)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_usuario,
        id_direccion_envio || null,
        id_metodo_pago || null,
        numero_pedido,
        subtotal,
        descuento || 0,
        impuesto || 0,
        costo_envio || 0,
        total,
        ESTADOS_VALIDOS.includes(estado) ? estado : 'pendiente',
        ESTADOS_PAGO_VALIDOS.includes(estado_pago) ? estado_pago : 'pendiente',
        notas || null,
        fecha_entrega_estimada || null
      ]
    );

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      pedido: {
        id_pedido: result.insertId,
        numero_pedido,
        id_usuario,
        subtotal,
        total,
        estado: ESTADOS_VALIDOS.includes(estado) ? estado : 'pendiente',
        estado_pago: ESTADOS_PAGO_VALIDOS.includes(estado_pago) ? estado_pago : 'pendiente'
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/pedidos/:id - Actualizar pedido por ID
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      subtotal, descuento, impuesto, costo_envio, total,
      estado, estado_pago, notas, fecha_entrega_estimada, fecha_entrega_real
    } = req.body;

    const [existing] = await pool.execute('SELECT id_pedido FROM pedidos WHERE id_pedido = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Pedido con ID ${id} no encontrado` });
    }

    await pool.execute(
      `UPDATE pedidos SET subtotal = COALESCE(?, subtotal), descuento = COALESCE(?, descuento), impuesto = COALESCE(?, impuesto),
       costo_envio = COALESCE(?, costo_envio), total = COALESCE(?, total), estado = COALESCE(?, estado),
       estado_pago = COALESCE(?, estado_pago), notas = ?, fecha_entrega_estimada = COALESCE(?, fecha_entrega_estimada),
       fecha_entrega_real = COALESCE(?, fecha_entrega_real)
       WHERE id_pedido = ?`,
      [
        subtotal || null,
        descuento || null,
        impuesto || null,
        costo_envio || null,
        total || null,
        ESTADOS_VALIDOS.includes(estado) ? estado : null,
        ESTADOS_PAGO_VALIDOS.includes(estado_pago) ? estado_pago : null,
        notas || null,
        fecha_entrega_estimada || null,
        fecha_entrega_real || null,
        id
      ]
    );

    res.json({
      message: 'Pedido actualizado exitosamente',
      pedido: { id_pedido: Number(id), estado, estado_pago, total }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/pedidos/:id - Eliminar pedido
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT numero_pedido FROM pedidos WHERE id_pedido = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Pedido con ID ${id} no encontrado` });
    }

    await pool.execute('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
    res.json({
      message: `Pedido "${existing[0].numero_pedido}" eliminado exitosamente`,
      deletedId: Number(id)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
