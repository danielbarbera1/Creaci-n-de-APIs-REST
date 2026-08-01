# ⚙️ Backend — API REST con Express.js + MySQL

Servidor REST construido con **Express.js 5** y **MySQL2** que expone los endpoints para gestionar el inventario de productos de una ferretería.

---

## 📁 Estructura

```
backend/
├── index.js        → Servidor principal: configuración, middlewares y todos los endpoints
├── package.json    → Dependencias
└── public/
    └── GET_PRODUCTOS.png   → Captura de ejemplo de la API funcionando
```

---

## 🚀 Stack

| Tecnología    | Versión  | Uso                                      |
|---------------|----------|------------------------------------------|
| Node.js       | ≥ 18     | Runtime de JavaScript                    |
| Express.js    | ^5.2.1   | Framework HTTP                           |
| mysql2        | ^3.22.6  | Driver MySQL con soporte async/await     |
| cors          | ^2.8.6   | Habilitar peticiones cross-origin        |

---

## ⚙️ Configuración

### Conexión a la Base de Datos

En `index.js` (línea 13) se define el objeto `dbConfig`:

```js
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456',   // Contraseña de Laragon
    database: 'express'   // Nombre de la BD
};
```

> ⚠️ **PENDIENTE**: Mover estas credenciales a un archivo `.env` para no exponerlas en el código.

### Middlewares activos

```js
app.use(cors());          // Acepta peticiones de cualquier origen
app.use(express.json());  // Parsea el body como JSON (necesario para POST/PUT)
```

---

## 🔧 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Levantar el servidor
node index.js

# El servidor queda en:
# http://localhost:3000
```

> Asegúrate de que **Laragon** (MySQL) esté corriendo antes de iniciar el servidor.

---

## 📡 Endpoints — Referencia Completa

### Base URL
```
http://localhost:3000/api
```

---

### 🛒 Productos

---

#### `GET /api/productos`
Retorna el listado básico de todos los productos.

**Ejemplo de petición:**
```
GET http://localhost:3000/api/productos
```

**Respuesta `200 OK`:**
```json
[
  {
    "id_producto": 1,
    "nombre_producto": "Juego de Destornilladores Stanley",
    "descripcion_detallada": "Set de 10 piezas magneticas (Estria/Pala)",
    "id_marca": 1,
    "id_categoria": 1,
    "id_unidad": 1
  },
  ...
]
```

---

#### `GET /api/productos/:id`
Retorna un producto por su ID con todos los datos relacionados (marca, categoría, unidad, inventario, ubicación).

**Ejemplo de petición:**
```
GET http://localhost:3000/api/productos/8
```

**Respuesta `200 OK`:**
```json
{
  "id": 8,
  "nombre": "Taladro Percutor DeWalt 20V",
  "descripcion": "Inalambrico, mandril de 1/2 pulgada con 2 baterias",
  "marca": {
    "id": 6,
    "nombre": "DeWalt"
  },
  "categoria": {
    "id": 2,
    "nombre": "Herramientas Electricas"
  },
  "unidad": {
    "id": 1,
    "nombre": "Unidad",
    "abreviatura": "unid"
  },
  "inventario": {
    "id": 8,
    "precio": 180.00,
    "costo": 135.00,
    "stock": 45,
    "min_stock": 0,
    "max_stock": 0,
    "estado": "In Stock"
  },
  "ubicacion": {
    "id": 6,
    "fullLocation": "Pasillo B - Vitrina 1",
    "aisle": "Pasillo B",
    "shelf": "Vitrina 1",
    "zone": null
  }
}
```

**Errores posibles:**
| Código | Causa                                |
|--------|--------------------------------------|
| `400`  | ID no es un número positivo          |
| `404`  | No existe producto con ese ID        |
| `500`  | Error de conexión a la base de datos |

---

#### `GET /api/productos/categories/:slug`
Retorna productos filtrados por categoría. Admite paginación, filtros y ordenamiento.

**Ejemplo de petición:**
```
GET http://localhost:3000/api/productos/categories/herramientas-electricas
GET http://localhost:3000/api/productos/categories/electricidad?brand=Schneider&minPrice=10&maxPrice=50&page=1&limit=5&sortBy=precio_publico&sortOrder=DESC
```

**Query params:**

| Parámetro   | Tipo   | Default          | Descripción                                   |
|-------------|--------|------------------|-----------------------------------------------|
| `brand`     | string | —                | Filtrar por nombre de marca exacto            |
| `minPrice`  | number | —                | Precio público mínimo                         |
| `maxPrice`  | number | —                | Precio público máximo                         |
| `search`    | string | —                | Busca en nombre_producto y descripcion_detallada |
| `sortBy`    | string | `nombre_producto`| Campo: `nombre_producto`, `precio_publico`, `stock_actual`, `marca`, `id_producto` |
| `sortOrder` | string | `ASC`            | `ASC` o `DESC`                                |
| `page`      | number | `1`              | Página de resultados                          |
| `limit`     | number | `10`             | Resultados por página                         |

**Respuesta `200 OK`:**
```json
{
  "categoria": {
    "id": 2,
    "nombre": "Herramientas Electricas",
    "slug": "herramientas-electricas"
  },
  "total": 6,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "products": [
    {
      "id": 8,
      "nombre": "Taladro Percutor DeWalt 20V",
      "slug": "taladro-percutor-dewalt-20v",
      "descripcion": "...",
      "marca": { "id": 6, "nombre": "DeWalt" },
      "categoria": { "id": 2, "nombre": "Herramientas Electricas", "slug": "herramientas-electricas" },
      "unidad": { "id": 1, "nombre": "Unidad", "abreviatura": "unid" },
      "inventario": {
        "id": 8,
        "precio_publico": 180.00,
        "costo_proveedor": 135.00,
        "stock_actual": 45,
        "stock_minimo": 0,
        "stock_maximo": 0,
        "disponibilidad": "In Stock"
      },
      "ubicacion": {
        "id": 6,
        "ubicacion_completa": "Pasillo B - Vitrina 1",
        "pasillo": "Pasillo B",
        "estante": "Vitrina 1",
        "zona": null
      },
      "created_at": "2026-07-11T17:35:38.000Z",
      "updated_at": "2026-07-18T17:45:50.000Z"
    }
  ],
  "filtros_aplicados": {
    "marca": null,
    "precio_minimo": null,
    "precio_maximo": null,
    "busqueda": null,
    "ordenar_por": "nombre_producto",
    "orden": "ASC"
  },
  "resumen": {
    "total_stock": 213,
    "precio_promedio": "151.67",
    "marcas_disponibles": ["Black+Decker", "Bosch", "DeWalt", "Makita"]
  }
}
```

> **Comportamiento especial:** Si el slug no existe, retorna `404` con la propiedad `availableCategories` — el frontend lo usa para cargar el menú de categorías sin necesidad de un endpoint dedicado.

**Errores posibles:**
| Código | Causa                                       |
|--------|---------------------------------------------|
| `400`  | Slug vacío                                  |
| `301`  | Slug no existe pero sí el nombre de categoría (sugiere el slug correcto) |
| `404`  | Categoría no encontrada (incluye lista de disponibles) |
| `500`  | Error de conexión a la base de datos        |

---

#### `POST /api/productos`
Crea un nuevo producto e inserta su registro de inventario en una **transacción atómica** (si falla cualquier paso, todo se revierte).

**Body `application/json`:**
```json
{
  "nombre_producto": "Sierra Circular 7-1/4\"",
  "descripcion_detallada": "Motor de 1800W con disco de 24 dientes carburo",
  "id_marca": 7,
  "id_categoria": 2,
  "id_unidad": 1,
  "precio_publico": 145.00,
  "costo_proveedor": 105.00,
  "stock_actual": 20,
  "id_ubicacion": 7
}
```

| Campo               | Tipo    | Requerido | Descripción                    |
|---------------------|---------|-----------|--------------------------------|
| `nombre_producto`   | string  | ✅        | Nombre del producto            |
| `descripcion_detallada` | string | ❌    | Descripción larga              |
| `id_marca`          | integer | ✅        | ID de la marca                 |
| `id_categoria`      | integer | ✅        | ID de la categoría             |
| `id_unidad`         | integer | ❌        | ID de unidad (default: 1)      |
| `precio_publico`    | decimal | ❌        | Precio de venta                |
| `costo_proveedor`   | decimal | ❌        | Costo de compra                |
| `stock_actual`      | integer | ❌        | Stock inicial (default: 0)     |
| `id_ubicacion`      | integer | ❌        | ID de la ubicación en almacén  |

**Respuesta `201 Created`:**
```json
{
  "message": "Producto creado exitosamente",
  "product": {
    "id_producto": 41,
    "nombre_producto": "Sierra Circular 7-1/4\"",
    "marca": "Bosch",
    "categoria": "Herramientas Electricas",
    "precio_publico": 145.00,
    "costo_proveedor": 105.00,
    "stock_actual": 20,
    "ubicacion_completa": "Pasillo B - Vitrina 2"
  }
}
```

**Errores posibles:**
| Código | Causa                                              |
|--------|----------------------------------------------------|
| `400`  | Faltan campos obligatorios o producto duplicado    |
| `500`  | Error al crear el producto                         |

---

#### `PUT /api/productos/:id`
Actualiza completamente un producto existente y su inventario (también en transacción).

**Ejemplo de petición:**
```
PUT http://localhost:3000/api/productos/41
```

**Body `application/json`:** Mismos campos que el `POST`.

**Respuesta `200 OK`:**
```json
{
  "message": "Producto actualizado exitosamente",
  "product": { ... }
}
```

**Errores posibles:**
| Código | Causa                            |
|--------|----------------------------------|
| `400`  | ID inválido                      |
| `404`  | Producto no encontrado           |
| `500`  | Error al actualizar              |

---

#### `DELETE /api/productos/:id`
Elimina un producto. Primero borra su registro de inventario (para respetar la FK) y luego el producto.

**Ejemplo de petición:**
```
DELETE http://localhost:3000/api/productos/41
```

**Respuesta `200 OK`:**
```json
{
  "message": "Producto \"Sierra Circular 7-1/4\"\" eliminado exitosamente",
  "deletedId": 41
}
```

**Errores posibles:**
| Código | Causa                            |
|--------|----------------------------------|
| `400`  | ID inválido                      |
| `404`  | Producto no encontrado           |
| `500`  | Error al eliminar                |

---

### 🏷️ Marcas

#### `GET /api/marcas`
Retorna todas las marcas disponibles.

```
GET http://localhost:3000/api/marcas
```

```json
[
  { "id_marca": 1, "nombre_marca": "Stanley" },
  { "id_marca": 6, "nombre_marca": "DeWalt" },
  { "id_marca": 7, "nombre_marca": "Bosch" }
]
```

---

### 📁 Categorías

#### `GET /api/categorias`
Retorna todas las categorías.

```
GET http://localhost:3000/api/categorias
```

```json
[
  { "id_categoria": 1, "nombre_categoria": "Herramientas Manuales", "descripcion_categoria": "..." },
  { "id_categoria": 2, "nombre_categoria": "Herramientas Electricas", "descripcion_categoria": "..." }
]
```

---

### 📍 Ubicaciones

#### `GET /api/ubicaciones`
Retorna todas las ubicaciones del almacén.

```
GET http://localhost:3000/api/ubicaciones
```

```json
[
  { "id_ubicacion": 1, "pasillo": "Pasillo A", "estante": "Estante 2", "ubicacion_completa": "Pasillo A - Estante 2" },
  { "id_ubicacion": 6, "pasillo": "Pasillo B", "estante": "Vitrina 1", "ubicacion_completa": "Pasillo B - Vitrina 1" }
]
```

---

## 🔁 Función Auxiliar Interna

### `getAvailableCategories(connection)`

Función interna (no es un endpoint) usada por `GET /api/productos/categories/:slug` cuando el slug no existe. Retorna un arreglo de categorías disponibles para informar al cliente qué slugs puede usar.

```js
// Retorna: [{ nombre: "Herramientas Manuales", slug: "herramientas-manuales" }, ...]
```

---

## 🌐 Puerto del Servidor

```js
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
```

---

## ⚠️ Notas Importantes

- **Sin pool de conexiones:** Cada request abre y cierra una conexión individual. Funciona para desarrollo pero en producción se debería usar `mysql2.createPool()`.
- **CORS abierto:** `app.use(cors())` acepta cualquier origen. En producción se debe restringir a dominios específicos.
- **Credenciales hardcodeadas:** La contraseña de la BD está directamente en el código. Mover a `.env` es una tarea pendiente.
- **Transacciones en escritura:** Los endpoints `POST`, `PUT` y `DELETE` usan `BEGIN TRANSACTION` / `COMMIT` / `ROLLBACK` para garantizar consistencia.

---

## 📋 Pendientes del Backend

Ver: [PENDIENTES.md](../PENDIENTES.md)

Los puntos clave son:
- Segmentar rutas en archivos separados (`routes/`)
- Mover credenciales a `.env`
- Usar pool de conexiones
- Agregar CRUD completo para marcas, categorías y ubicaciones
- Agregar endpoint de búsqueda global y PATCH
