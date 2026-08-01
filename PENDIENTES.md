# 📋 Tareas Pendientes — API GET / Sistema de Inventario

Este archivo registra las funcionalidades y mejoras que faltan para completar el proyecto.

---

## 🔴 Backend — Pendientes

### API & Endpoints
- [ ] **Segmentar el backend**: separar cada recurso en su propio archivo de rutas (ej: `routes/productos.js`, `routes/marcas.js`, etc.) en lugar de tenerlo todo en `index.js`
- [ ] **Agregar endpoint PATCH** para actualizaciones parciales de un producto (`PATCH /api/productos/:id`)
- [ ] **Agregar endpoint de búsqueda global**: `GET /api/productos/search?q=taladro` para buscar en todos los productos sin necesidad de conocer la categoría
- [ ] **Agregar paginación al endpoint `GET /api/productos`** (actualmente devuelve todos los productos sin paginar)
- [ ] **Endpoints faltantes para Marcas:**
  - [ ] `POST /api/marcas` — Crear marca
  - [ ] `PUT /api/marcas/:id` — Actualizar marca
  - [ ] `DELETE /api/marcas/:id` — Eliminar marca
- [ ] **Endpoints faltantes para Categorías:**
  - [ ] `POST /api/categorias` — Crear categoría
  - [ ] `PUT /api/categorias/:id` — Actualizar categoría
  - [ ] `DELETE /api/categorias/:id` — Eliminar categoría
- [ ] **Endpoints faltantes para Ubicaciones:**
  - [ ] `POST /api/ubicaciones` — Crear ubicación
  - [ ] `PUT /api/ubicaciones/:id` — Actualizar ubicación
  - [ ] `DELETE /api/ubicaciones/:id` — Eliminar ubicación

### Seguridad & Calidad
- [ ] **Mover credenciales de DB a variables de entorno** (`.env`): actualmente la contraseña y nombre de la BD están hardcodeadas en `index.js`
- [ ] **Usar un pool de conexiones** en lugar de `mysql.createConnection()` por petición — mejora el rendimiento y evita saturar la BD
- [ ] **Validación de entrada con una librería** (ej: Zod o Joi) en lugar de validaciones manuales con `if`
- [ ] **Agregar middleware de manejo de errores** centralizado (`app.use((err, req, res, next) => ...)`)
- [ ] **Agregar script `start` en `package.json`** del backend y usar `nodemon` para desarrollo automático

---

## 🟡 Frontend — Pendientes

### Funcionalidades
- [ ] **Panel administrativo** — Interfaz para crear, editar y eliminar productos directamente desde el frontend (sin usar Postman)
  - [ ] Formulario para crear producto (POST)
  - [ ] Formulario para editar producto (PUT)
  - [ ] Botón para eliminar producto (DELETE) con confirmación
- [ ] **Ver detalle de producto** — Al hacer clic en una tarjeta de producto, mostrar todos sus datos (`GET /api/productos/:id`)
- [ ] **Mostrar precio en las tarjetas de producto** — Actualmente solo muestra nombre y stock
- [ ] **Mostrar marca y categoría** en las tarjetas de producto
- [ ] **Buscador de productos** en la interfaz
- [ ] **Filtros visuales** (precio mín/máx, marca) en el panel de productos por categoría
- [ ] **Indicador de "cargando"** (loading state) mientras se esperan las respuestas de la API
- [ ] **Manejo de errores en la UI** — Mostrar mensajes amigables si la API falla en lugar de quedarse en blanco

### Diseño & UX
- [ ] **Mejorar el diseño general** — Actualmente usa clases de Tailwind simples, se puede pulir con un diseño más profesional
- [ ] **Responsividad completa** — Revisar en móviles el menú lateral de categorías
- [ ] **Resaltar categoría activa** en el menú lateral cuando está seleccionada
- [ ] **Paginación en el frontend** para navegar entre páginas de productos de una categoría

---

## 🟢 DevOps & Documentación — Pendientes

- [ ] **Archivo `.env.example`** en el backend con las variables de entorno necesarias (sin valores reales)
- [ ] **Script SQL de inicialización** — Un archivo `.sql` para crear las tablas y datos de prueba fácilmente
- [ ] **Agregar `package.json` raíz** con scripts para levantar backend y frontend simultáneamente (`concurrently`)
- [ ] **Colección de Postman** exportada (`.json`) con todos los endpoints documentados y listos para probar
- [ ] **Agregar `.gitignore`** en el backend (actualmente no tiene uno)

---

## ✅ Completado

- [x] CRUD completo de productos: POST, GET (todos), GET (por ID), GET (por categoría), PUT, DELETE
- [x] Filtros y paginación en el endpoint de categorías
- [x] URLs con slugs (en lugar de nombres con espacios y acentos)
- [x] Transacciones en operaciones que tocan múltiples tablas (POST y DELETE)
- [x] Frontend conectado a la API con filtro por categoría funcional
- [x] Variables de entorno en el frontend (`.env` con `VITE_API_URL`)
