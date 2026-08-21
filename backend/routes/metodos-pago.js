const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Tipos de pago válidos según la BD
const TIPOS_VALIDOS = ['visa', 'mastercard', 'paypal', 'yape', 'plin', 'transferencia'];

// GET /api/metodos-pago - Listar todos los métodos de pago
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id_metodo_pago, id_usuario, tipo_pago, nombre_titular, ultimos_4_digitos, fecha_expiracion, email_paypal, telefono_yape, es_principal, estado, created_at
       FROM metodos_pago ORDER BY id_metodo_pago ASC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/metodos-pago/:id - Obtener método de pago por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT id_metodo_pago, id_usuario, tipo_pago, nombre_titular, ultimos_4_digitos, fecha_expiracion, email_paypal, telefono_yape, es_principal, estado, created_at, updated_at
       FROM metodos_pago WHERE id_metodo_pago = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `Método de pago con ID ${id} no encontrado` });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/metodos-pago - Agregar método de pago
router.post('/', async (req, res, next) => {
  try {
    const {
      id_usuario, tipo_pago, nombre_titular, numero_tarjeta, ultimos_4_digitos,
      fecha_expiracion, cvv, email_paypal, telefono_yape, es_principal, estado
    } = req.body;

    if (!id_usuario || !tipo_pago) {
      return res.status(400).json({ error: 'Los campos id_usuario y tipo_pago son obligatorios' });
    }

    if (!TIPOS_VALIDOS.includes(tipo_pago)) {
      return res.status(400).json({ error: `El tipo_pago debe ser uno de: ${TIPOS_VALIDOS.join(', ')}` });
    }

    const [result] = await pool.execute(
      `INSERT INTO metodos_pago (id_usuario, tipo_pago, nombre_titular, numero_tarjeta, ultimos_4_digitos, fecha_expiracion, cvv, email_paypal, telefono_yape, es_principal, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_usuario,
        tipo_pago,
        nombre_titular || null,
        numero_tarjeta || null,
        ultimos_4_digitos || null,
        fecha_expiracion || null,
        cvv || null,
        email_paypal || null,
        telefono_yape || null,
        es_principal ? 1 : 0,
        estado || 'activo'
      ]
    );

    res.status(201).json({
      message: 'Método de pago agregado exitosamente',
      metodo_pago: {
        id_metodo_pago: result.insertId,
        id_usuario,
        tipo_pago,
        nombre_titular: nombre_titular || null,
        ultimos_4_digitos: ultimos_4_digitos || null,
        fecha_expiracion: fecha_expiracion || null,
        email_paypal: email_paypal || null,
        telefono_yape: telefono_yape || null,
        es_principal: es_principal ? 1 : 0,
        estado: estado || 'activo'
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/metodos-pago/:id - Actualizar método de pago por ID
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      tipo_pago, nombre_titular, numero_tarjeta, ultimos_4_digitos,
      fecha_expiracion, cvv, email_paypal, telefono_yape, es_principal, estado
    } = req.body;

    const [existing] = await pool.execute('SELECT id_metodo_pago FROM metodos_pago WHERE id_metodo_pago = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Método de pago con ID ${id} no encontrado` });
    }

    if (tipo_pago && !TIPOS_VALIDOS.includes(tipo_pago)) {
      return res.status(400).json({ error: `El tipo_pago debe ser uno de: ${TIPOS_VALIDOS.join(', ')}` });
    }

    await pool.execute(
      `UPDATE metodos_pago SET tipo_pago = COALESCE(?, tipo_pago), nombre_titular = ?, numero_tarjeta = ?, ultimos_4_digitos = ?, fecha_expiracion = ?, cvv = ?, email_paypal = ?, telefono_yape = ?, es_principal = ?, estado = COALESCE(?, estado)
       WHERE id_metodo_pago = ?`,
      [
        tipo_pago || null,
        nombre_titular || null,
        numero_tarjeta || null,
        ultimos_4_digitos || null,
        fecha_expiracion || null,
        cvv || null,
        email_paypal || null,
        telefono_yape || null,
        es_principal ? 1 : 0,
        estado || null,
        id
      ]
    );

    res.json({
      message: 'Método de pago actualizado exitosamente',
      metodo_pago: { id_metodo_pago: Number(id), tipo_pago, nombre_titular, ultimos_4_digitos, estado }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/metodos-pago/:id - Eliminar método de pago
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT tipo_pago, ultimos_4_digitos FROM metodos_pago WHERE id_metodo_pago = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: `Método de pago con ID ${id} no encontrado` });
    }

    await pool.execute('DELETE FROM metodos_pago WHERE id_metodo_pago = ?', [id]);
    const label = existing[0].ultimos_4_digitos
      ? `${existing[0].tipo_pago} ***${existing[0].ultimos_4_digitos}`
      : existing[0].tipo_pago;
    res.json({
      message: `Método de pago "${label}" eliminado exitosamente`,
      deletedId: Number(id)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
