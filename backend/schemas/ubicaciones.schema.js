const { z } = require('zod');

const ubicacionSchema = z.object({
  pasillo: z.string().optional().nullable(),
  estante: z.string().optional().nullable(),
  zona: z.string().optional().nullable(),
  ubicacion_completa: z.string().optional().nullable()
});

module.exports = {
  ubicacionSchema,
  updateUbicacionSchema: ubicacionSchema.partial()
};
