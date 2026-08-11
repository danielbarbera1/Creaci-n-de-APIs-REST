/**
 * Middleware centralizado de manejo de errores en Express
 */
function errorHandler(err, req, res, next) {
  console.error('[Error Middleware]:', err);

  // Error de entrada duplicada en MySQL (UNIQUE key)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      error: 'El registro ya existe en la base de datos (clave duplicada)',
      details: err.sqlMessage || err.message
    });
  }

  // Error de llave foránea / restricción referencial en MySQL (Eliminación impedida por relaciones)
  if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
    return res.status(400).json({
      error: 'No se puede eliminar o modificar el registro porque está siendo utilizado por otros elementos en el sistema.',
      details: err.sqlMessage || err.message
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({
      error: 'Uno de los IDs referenciados (marca, categoría, unidad o ubicación) no existe.',
      details: err.sqlMessage || err.message
    });
  }

  // Estado HTTP personalizado o 500 por defecto
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Hubo un error interno en el servidor';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { details: err.stack })
  });
}

module.exports = errorHandler;
