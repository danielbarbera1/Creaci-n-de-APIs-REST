const { z } = require('zod');

const createProductSchema = z.object({
  nombre_producto: z.string({ required_error: 'El nombre del producto es obligatorio' })
    .min(1, 'El nombre del producto no puede estar vacío')
    .max(150, 'El nombre no puede exceder 150 caracteres'),
  descripcion_detallada: z.string().optional().nullable(),
  id_marca: z.number({ required_error: 'El id_marca es obligatorio' })
    .int('id_marca debe ser un entero positivo')
    .positive('id_marca debe ser positivo'),
  id_categoria: z.number({ required_error: 'El id_categoria es obligatorio' })
    .int('id_categoria debe ser un entero positivo')
    .positive('id_categoria debe ser positivo'),
  id_unidad: z.number().int().positive().optional().default(1),
  precio_publico: z.number().min(0, 'El precio no puede ser negativo').optional().default(0),
  costo_proveedor: z.number().min(0, 'El costo no puede ser negativo').optional().default(0),
  stock_actual: z.number().int().min(0, 'El stock no puede ser negativo').optional().default(0),
  id_ubicacion: z.number().int().positive().optional().nullable()
});

const updateProductSchema = z.object({
  nombre_producto: z.string().min(1).max(150),
  descripcion_detallada: z.string().optional().nullable(),
  id_marca: z.number().int().positive(),
  id_categoria: z.number().int().positive(),
  id_unidad: z.number().int().positive().optional().default(1),
  precio_publico: z.number().min(0).optional().default(0),
  costo_proveedor: z.number().min(0).optional().default(0),
  stock_actual: z.number().int().min(0).optional().default(0),
  id_ubicacion: z.number().int().positive().optional().nullable()
});

const patchProductSchema = updateProductSchema.partial();

module.exports = {
  createProductSchema,
  updateProductSchema,
  patchProductSchema
};
