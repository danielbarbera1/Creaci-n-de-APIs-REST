# ⚙️ Backend — API REST con Express.js + MySQL

Servidor REST construido con **Express.js 5** y **MySQL2** que expone los endpoints para gestionar el inventario de productos de una ferretería. 

---

## 📁 Estructura del Proyecto

El proyecto está modularizado para mantener un código limpio y escalable:

```
backend/
├── config/
│   └── db.js               → Configuración y Pool de conexiones de la base de datos
├── middlewares/
│   ├── errorHandler.js     → Manejo centralizado de errores
│   └── validate.js         → Middleware de validación usando Zod
├── routes/
│   ├── categorias.js       → Endpoints de categorías
│   ├── marcas.js           → Endpoints de marcas
│   ├── productos.js        → Endpoints de productos
│   └── ubicaciones.js      → Endpoints de ubicaciones
├── schemas/                → Esquemas de validación Zod (productos, marcas, etc.)
├── index.js                → Punto de entrada, configuración de Express y montaje de rutas
└── package.json            → Dependencias y scripts
```

---

## 🚀 Stack Tecnológico

| Tecnología    | Versión  | Uso                                      |
|---------------|----------|------------------------------------------|
| Node.js       | ≥ 18     | Runtime de JavaScript                    |
| Express.js    | ^5.2.1   | Framework HTTP                           |
| mysql2        | ^3.22.6  | Driver MySQL con soporte async/await     |
| zod           | ^4.4.3   | Validación estricta de esquemas y datos  |
| cors          | ^2.8.6   | Habilitar peticiones cross-origin        |
| dotenv        | ^17.4.2  | Gestión de variables de entorno          |
| nodemon       | ^3.1.14  | Recarga automática en desarrollo         |

---

## ⚙️ Configuración

### Variables de Entorno

Se requiere un archivo `.env` en la raíz de `backend/` basado en `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=express
DB_PORT=3306
# DB_SSL=true # Descomentar para producción si se requiere SSL
```

### Conexión a la Base de Datos (`config/db.js`)

Se utiliza un **Pool de Conexiones** (`mysql.createPool`) para gestionar eficientemente las conexiones a la base de datos, con soporte para SSL en producción.

---

## 🔧 Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de MySQL

# 3. Levantar el servidor en modo desarrollo (usa nodemon)
npm run dev

# O en modo producción
npm start

# El servidor quedará escuchando en:
# http://localhost:3000
```

> Asegúrate de que tu servidor MySQL (ej. Laragon, XAMPP, o Docker) esté corriendo y que hayas importado el script SQL proporcionado (`express.sql`).

---

## 🧪 Pruebas con Postman

En la raíz del proyecto encontrarás el archivo `API DANIEL PRACTICA FERRETERIA .postman_collection.json`. Puedes importarlo directamente en tu cliente de Postman (botón **Import**) para tener listos todos los endpoints de esta API, con ejemplos de variables, headers y body para probarlos fácilmente.

---

## 📡 Endpoints — Referencia Completa

### Base URL
```
http://localhost:3000/api
```

### 🛒 Productos (`/api/productos`)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/productos` | Retorna todos los productos (soporta paginación: `?page=1&limit=10`) |
| `GET` | `/api/productos/search?q=termino` | Búsqueda global de productos |
| `GET` | `/api/productos/:id` | Obtener detalle completo de un producto por su ID |
| `GET` | `/api/productos/categories/:slug` | Productos por categoría (soporta filtros: `brand`, `minPrice`, `maxPrice`, `search`, y ordenamiento) |
| `POST` | `/api/productos` | Crear un nuevo producto (usa transacción para insertar en `productos` e `inventario`) |
| `PUT` | `/api/productos/:id` | Actualizar completamente un producto |
| `PATCH` | `/api/productos/:id` | Actualizar parcialmente un producto |
| `DELETE`| `/api/productos/:id` | Eliminar un producto y su inventario |

### 🏷️ Marcas (`/api/marcas`)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/marcas` | Listar todas las marcas |
| `GET` | `/api/marcas/:id` | Obtener una marca por ID |
| `POST` | `/api/marcas` | Crear una nueva marca |
| `PUT` | `/api/marcas/:id` | Actualizar una marca |
| `DELETE`| `/api/marcas/:id` | Eliminar una marca |

### 📁 Categorías (`/api/categorias`)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/categorias` | Listar todas las categorías |
| `GET` | `/api/categorias/:id` | Obtener una categoría por ID |
| `POST` | `/api/categorias` | Crear una categoría (genera `slug` automáticamente) |
| `PUT` | `/api/categorias/:id` | Actualizar una categoría |
| `DELETE`| `/api/categorias/:id` | Eliminar una categoría |

### 📍 Ubicaciones (`/api/ubicaciones`)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/ubicaciones` | Listar todas las ubicaciones |
| `GET` | `/api/ubicaciones/:id` | Obtener una ubicación por ID |
| `POST` | `/api/ubicaciones` | Crear una ubicación |
| `PUT` | `/api/ubicaciones/:id` | Actualizar una ubicación |
| `DELETE`| `/api/ubicaciones/:id` | Eliminar una ubicación |

---

## 🛡️ Manejo de Errores y Validaciones

- **Validación con Zod**: Todos los endpoints `POST`, `PUT` y `PATCH` validan el cuerpo de la petición (body) usando `zod` a través del middleware `validate.js`. Si los datos son inválidos, se retorna `400 Bad Request` con el detalle de los errores.
- **Middleware de Errores**: `errorHandler.js` captura errores generales y de base de datos (ej. violación de llaves foráneas `ER_ROW_IS_REFERENCED`, entradas duplicadas `ER_DUP_ENTRY`) y responde con mensajes amigables y códigos HTTP adecuados.

---

## ⚠️ Notas de Arquitectura

- **Transacciones en escritura:** Los endpoints `POST`, `PUT`, `PATCH` y `DELETE` de productos utilizan transacciones SQL (`beginTransaction()`, `commit()`, `rollback()`) para garantizar que la información en las tablas `productos` e `inventario` se mantenga consistente.
- **Despliegue Serverless (Vercel):** `index.js` exporta la app de Express al final (`module.exports = app;`) para facilitar el despliegue como Serverless Function.
