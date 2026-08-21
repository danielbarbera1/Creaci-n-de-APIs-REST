require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar enrutadores modulares
const productosRouter = require('./routes/productos');
const marcasRouter = require('./routes/marcas');
const categoriasRouter = require('./routes/categorias');
const ubicacionesRouter = require('./routes/ubicaciones');
const usuariosRouter = require('./routes/usuarios');
const direccionesRouter = require('./routes/direcciones');
const metodosPagoRouter = require('./routes/metodos-pago');
const pedidosRouter = require('./routes/pedidos');
const promocionesRouter = require('./routes/promociones');
const descuentosRouter = require('./routes/descuentos');

// Importar middleware centralizado de manejo de errores
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Montar rutas modulares de la API
app.use('/api/productos', productosRouter);
app.use('/api/marcas', marcasRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/ubicaciones', ubicacionesRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/direcciones', direccionesRouter);
app.use('/api/metodos-pago', metodosPagoRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/promociones', promocionesRouter);
app.use('/api/descuentos', descuentosRouter);

// Ruta raíz de prueba/bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API REST de Inventario escuchando correctamente',
    endpoints: {
      productos: '/api/productos',
      busqueda_global: '/api/productos/search?q=taladro',
      marcas: '/api/marcas',
      categorias: '/api/categorias',
      ubicaciones: '/api/ubicaciones',
      usuarios: '/api/usuarios',
      direcciones: '/api/direcciones',
      'metodos-pago': '/api/metodos-pago',
      pedidos: '/api/pedidos',
      promociones: '/api/promociones',
      descuentos: '/api/descuentos'
    }
  });
});

// Middleware centralizado de errores (Debe ser el último middleware)
app.use(errorHandler);

// Levantar el servidor en desarrollo local
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
    console.log(`📦 Productos: http://localhost:${PORT}/api/productos`);
    console.log(`🔍 Búsqueda: http://localhost:${PORT}/api/productos/search?q=taladro`);
    console.log(`==================================================\n`);
  });
}

// Exportar app para Vercel Serverless
module.exports = app;