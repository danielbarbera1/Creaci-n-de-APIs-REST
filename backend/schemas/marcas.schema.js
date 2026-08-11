const { z } = require('zod');

const marcaSchema = z.object({
  nombre_marca: z.string({ required_error: 'El nombre de la marca es obligatorio' })
    .min(1, 'El nombre de la marca no puede estar vacío')
    .max(100, 'El nombre de la marca no puede exceder 100 caracteres')
});

module.exports = {
  marcaSchema,
  updateMarcaSchema: marcaSchema.partial()
};
