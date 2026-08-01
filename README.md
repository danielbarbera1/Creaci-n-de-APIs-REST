# 📦 Sistema de Gestión de Inventario — API REST + Frontend React

Un sistema fullstack de gestión de productos e inventario con una **API REST en Express.js** y una **interfaz visual en React + Vite + TailwindCSS**.

---

## 🗂️ Estructura del Proyecto

```
API GET/
├── backend/          → Servidor Express.js + MySQL
│   ├── index.js      → Punto de entrada del servidor y todos los endpoints
│   ├── package.json  → Dependencias del backend
│   └── public/       → Recursos estáticos (capturas, etc.)
│
├── frontend/         → Aplicación React + Vite
│   ├── src/
│   │   ├── App.jsx   → Componente principal (categorías + productos)
│   │   ├── App.css   → Estilos del componente principal
│   │   ├── index.css → Estilos globales
│   │   └── main.jsx  → Punto de entrada de React
│   ├── .env          → Variables de entorno (URL de la API)
│   ├── vite.config.js
│   └── package.json
│
└── README.md         ← Este archivo
```

---

## 🚀 Stack Tecnológico

| Capa          | Tecnología                       |
|---------------|----------------------------------|
| Backend       | Node.js, Express.js 5, MySQL2    |
| Frontend      | React 19, Vite 8, TailwindCSS 4  |
| Base de datos | MySQL (via Laragon)              |
| CORS          | Habilitado para desarrollo local |

---

## ⚙️ Requisitos Previos

- **Node.js** v18 o superior
- **Laragon** (o cualquier servidor MySQL local)
- Base de datos MySQL llamada `express` con las tablas correspondientes

### Tablas requeridas en la base de datos `express`:

```sql
productos       (id_producto, nombre_producto, descripcion_detallada, id_marca, id_categoria, id_unidad, slug, created_at, updated_at)
marcas          (id_marca, nombre_marca)
categorias      (id_categoria, nombre_categoria, descripcion_categoria, slug)
unidades_medida (id_unidad, nombre_unidad, abreviatura)
inventario      (id_inventario, id_producto, id_ubicacion, precio_publico, costo_proveedor, stock_actual, stock_minimo, stock_maximo)
ubicaciones     (id_ubicacion, pasillo, estante, zona, ubicacion_completa)
```

---

## 📡 API REST — Endpoints Disponibles

### Base URL
```
http://localhost:3000/api
```

---

### 🛒 Productos

#### GET /api/productos
Retorna todos los productos (listado simplificado).

```json
[
  {
    "id_producto": 1,
    "nombre_producto": "Taladro Bosch",
    "descripcion_detallada": "...",
    "id_marca": 2,
    "id_categoria": 1,
    "id_unidad": 1
  }
]
```

---

#### GET /api/productos/:id
Retorna un producto específico con todos sus datos relacionados.

Ejemplo: GET /api/productos/5

```json
{
  "id": 5,
  "nombre": "Taladro Bosch",
  "descripcion": "...",
  "marca": { "id": 2, "nombre": "Bosch" },
  "categoria": { "id": 1, "nombre": "Herramientas Eléctricas" },
  "unidad": { "id": 1, "nombre": "Unidad", "abreviatura": "UN" },
  "inventario": {
    "id": 3,
    "precio": 150.00,
    "costo": 90.00,
    "stock": 25,
    "min_stock": 5,
    "max_stock": 100,
    "estado": "In Stock"
  },
  "ubicacion": {
    "id": 2,
    "fullLocation": "A-1-Z1",
    "aisle": "A",
    "shelf": "1",
    "zone": "Z1"
  }
}
```

---

#### GET /api/productos/categories/:slug
Retorna productos filtrados por categoría. Soporta paginación, filtros y ordenamiento.

Ejemplo: GET /api/productos/categories/herramientas-electricas?page=1&limit=10&sortBy=precio_publico&sortOrder=ASC

| Query Param  | Tipo   | Descripción                                                                                    |
|--------------|--------|-----------------------------------------------------------------------------------------------|
| brand        | string | Filtra por nombre de marca                                                                     |
| minPrice     | number | Precio mínimo                                                                                  |
| maxPrice     | number | Precio máximo                                                                                  |
| search       | string | Busca por nombre o descripción                                                                 |
| sortBy       | string | nombre_producto, precio_publico, stock_actual, marca, id_producto                              |
| sortOrder    | string | ASC o DESC (default: ASC)                                                                      |
| page         | number | Página actual (default: 1)                                                                     |
| limit        | number | Productos por página (default: 10)                                                             |

Respuesta:
```json
{
  "categoria": { "id": 1, "nombre": "Herramientas Eléctricas", "slug": "herramientas-electricas" },
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "products": [...],
  "filtros_aplicados": { ... },
  "resumen": {
    "total_stock": 350,
    "precio_promedio": "125.50",
    "marcas_disponibles": ["Bosch", "Dewalt"]
  }
}
```

> NOTA: Si el slug no existe, retorna 404 con la propiedad availableCategories — el frontend usa esto para cargar el menú de categorías.

---

#### POST /api/productos
Crea un nuevo producto con su inventario (transacción atómica).

Body (JSON):
```json
{
  "nombre_producto": "Sierra Circular",
  "descripcion_detallada": "Sierra circular 7 1/4 pulgadas",
  "id_marca": 2,
  "id_categoria": 1,
  "id_unidad": 1,
  "precio_publico": 200.00,
  "costo_proveedor": 120.00,
  "stock_actual": 15,
  "id_ubicacion": 3
}
```

Campos obligatorios: nombre_producto, id_marca, id_categoria

Respuesta exitosa (201):
```json
{
  "message": "Producto creado exitosamente",
  "product": { ... }
}
```

---

#### PUT /api/productos/:id
Actualiza un producto existente y su inventario de forma completa.

Body: Mismos campos que el POST.

Respuesta exitosa (200):
```json
{
  "message": "Producto actualizado exitosamente",
  "product": { ... }
}
```

---

#### DELETE /api/productos/:id
Elimina un producto y su inventario (respeta integridad referencial).

Respuesta exitosa (200):
```json
{
  "message": "Producto \"Taladro Bosch\" eliminado exitosamente",
  "deletedId": 5
}
```

---

### 🏷️ Marcas

#### GET /api/marcas
```json
[{ "id_marca": 1, "nombre_marca": "Bosch" }, ...]
```

---

### 📁 Categorías

#### GET /api/categorias
```json
[{ "id_categoria": 1, "nombre_categoria": "Herramientas Eléctricas", "descripcion_categoria": "..." }, ...]
```

---

### 📍 Ubicaciones

#### GET /api/ubicaciones
```json
[{ "id_ubicacion": 1, "pasillo": "A", "estante": "1", "ubicacion_completa": "A-1-Z1" }, ...]
```

---

## 🖥️ Frontend React

### Funcionalidades Implementadas

- ✅ Lista de categorías cargada dinámicamente desde la API
- ✅ Lista de productos cargada al inicio
- ✅ Filtrado por categoría al hacer clic en el slug del menú lateral
- ✅ Indicador visual de stock (En Stock / Sin Stock)
- ✅ Soporte para dos formatos de respuesta (listado general vs. por categoría)

### Variables de Entorno

Archivo: frontend/.env
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🗃️ Códigos de Error

| Código | Descripción                                          |
|--------|------------------------------------------------------|
| 400    | Parámetros inválidos o campos obligatorios faltantes |
| 404    | Recurso no encontrado                                |
| 500    | Error de conexión o consulta a la base de datos      |

---

## 🔧 Instalación y Ejecución

### 1. Backend

```bash
cd backend
npm install
node index.js
# Servidor en: http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# App en: http://localhost:5173
```

> ⚠️ Asegúrate de que Laragon (MySQL) esté corriendo antes de iniciar el backend.

---

## 📋 Tareas Pendientes

Ver: PENDIENTES.md
