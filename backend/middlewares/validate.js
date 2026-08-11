const { ZodError } = require('zod');

/**
 * Middleware para validar esquemas de Zod en peticiones Express
 * @param {import('zod').ZodSchema} schema - Esquema de validación Zod
 * @param {'body' | 'query' | 'params'} source - Parte de la petición a validar
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const parsed = schema.parse(req[source]);
    req[source] = parsed;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => ({
        campo: err.path.join('.'),
        mensaje: err.message
      }));
      return res.status(400).json({
        error: 'Error de validación en los datos enviados',
        detalles: formattedErrors
      });
    }
    next(error);
  }
};

module.exports = validate;
