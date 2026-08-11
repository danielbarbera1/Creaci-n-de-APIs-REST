const { z } = require('zod');

const categoriaSchema = z.object({
  nombre_categoria: z.string({ required_error: 'El nombre de la categoría es obligatorio' })
    .min(1, 'El nombre de la categoría no puede estar vacío')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  descripcion_categoria: z.string().optional().nullable(),
  slug: z.string().optional()
});

module.exports = {
  categoriaSchema,
  updateCategoriaSchema: categoriaSchema.partial()
};
