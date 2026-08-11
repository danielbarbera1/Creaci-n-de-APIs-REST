# 📋 Tareas Pendientes — API GET / Sistema de Inventario

Este archivo registra las funcionalidades y mejoras que faltan para completar el proyecto.

---

## 🔴 Backend — Pendientes (Completado)

### API & Endpoints
- [x] **Segmentar el backend**: separar cada recurso en su propio archivo de rutas (`routes/productos.js`, `routes/marcas.js`, `routes/categorias.js`, `routes/ubicaciones.js`) en lugar de tenerlo todo en `index.js`
- [x] **Agregar endpoint PATCH** para actualizaciones parciales de un producto (`PATCH /api/productos/:id`)
- [x] **Agregar endpoint de búsqueda global**: `GET /api/productos/search?q=taladro` para buscar en todos los productos sin necesidad de conocer la categoría
- [x] **Agregar paginación al endpoint `GET /api/productos`** (`GET /api/productos?page=1&limit=10`)
- [x] **Endpoints faltantes para Marcas:**
  - [x] `POST /api/marcas` — Crear marca
  - [x] `PUT /api/marcas/:id` — Actualizar marca
  - [x] `DELETE /api/marcas/:id` — Eliminar marca
- [x] **Endpoints faltantes para Categorías:**
  - [x] `POST /api/categorias` — Crear categoría
  - [x] `PUT /api/categorias/:id` — Actualizar categoría
  - [x] `DELETE /api/categorias/:id` — Eliminar categoría
- [x] **Endpoints faltantes para Ubicaciones:**
  - [x] `POST /api/ubicaciones` — Crear ubicación
  - [x] `PUT /api/ubicaciones/:id` — Actualizar ubicación
  - [x] `DELETE /api/ubicaciones/:id` — Eliminar ubicación

### Seguridad & Calidad
- [x] **Mover credenciales de DB a variables de entorno** (`process.env` / `.env`): configurado con `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` y soporte SSL.
- [x] **Usar un pool de conexiones** (`mysql2.createPool()`): implementado en `config/db.js` para reutilizar conexiones.
- [x] **Validación de entrada con una librería** (Zod) en lugar de validaciones manuales con `if`
- [x] **Agregar middleware de manejo de errores** centralizado (`middlewares/errorHandler.js`)
- [x] **Agregar script `start` en `package.json`** del backend y usar `nodemon` para desarrollo automático (`npm run dev`)

---

## 🟡 Frontend — Pendientes (Completado)

### Funcionalidades
- [x] **Panel administrativo** — Interfaz para crear, editar y eliminar productos directamente desde el frontend (sin usar Postman)
  - [x] Formulario para crear producto (POST)
  - [x] Formulario para editar producto (PUT)
  - [x] Botón para eliminar producto (DELETE) con confirmación
- [x] **Ver detalle de producto** — Al hacer clic en una tarjeta de producto, mostrar todos sus datos (`GET /api/productos/:id`)
- [x] **Mostrar precio en las tarjetas de producto** — Actualmente solo muestra nombre y stock
- [x] **Mostrar marca y categoría** en las tarjetas de producto
- [x] **Buscador de productos** en la interfaz
- [x] **Filtros visuales** (precio mín/máx, marca) en el panel de productos por categoría
- [x] **Indicador de "cargando"** (loading state) mientras se esperan las respuestas de la API
- [x] **Manejo de errores en la UI** — Mostrar mensajes amigables si la API falla en lugar de quedarse en blanco

### Diseño & UX
- [x] **Mejorar el diseño general** — Actualmente usa clases de Tailwind simples, se puede pulir con un diseño más profesional
- [x] **Responsividad completa** — Revisar en móviles el menú lateral de categorías
- [x] **Resaltar categoría activa** en el menú lateral cuando está seleccionada
- [x] **Paginación en el frontend** para navegar entre páginas de productos de una categoría


---

## 🟢 DevOps & Documentación — Pendientes

- [x] **Archivo `.env.example`** en el backend con las variables de entorno necesarias (sin valores reales)
- [ ] **Script SQL de inicialización** — Un archivo `.sql` para crear las tablas y datos de prueba fácilmente
- [ ] **Agregar `package.json` raíz** con scripts para levantar backend y frontend simultáneamente (`concurrently`)
- [ ] **Colección de Postman** exportada (`.json`) con todos los endpoints documentados y listos para probar
- [x] **Agregar `.gitignore`** en el backend

---

## ✅ Completado

- [x] CRUD completo de productos: POST, GET (todos), GET (por ID), GET (por categoría), PUT, DELETE
- [x] Implementación de Pool de conexiones con `mysql2.createPool()`
- [x] Configuración por variables de entorno (`process.env.DB_*`) y soporte SSL en producción (Vercel)
- [x] Exportación Serverless `module.exports = app` para despliegues en Vercel
- [x] Filtros y paginación en el endpoint de categorías
- [x] URLs con slugs (en lugar de nombres con espacios y acentos)
- [x] Transacciones en operaciones que tocan múltiples tablas (POST, PUT y DELETE)
- [x] Frontend conectado a la API con filtro por categoría funcional
- [x] Variables de entorno en el frontend (`.env` con `VITE_API_URL`)
