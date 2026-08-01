# 📦 Sistema de Gestión de Inventario — API REST + Frontend React

Un sistema fullstack de gestión de productos e inventario con una **API REST en Express.js** y una **interfaz visual en React + Vite + TailwindCSS**.

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

Ver: [PENDIENTES.md](./PENDIENTES.md)

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

### Base de datos: `express`

Motor: **MySQL 8.0** · Charset: `utf8mb4_unicode_ci`

> El archivo `express.sql` en la raíz del proyecto contiene el dump completo listo para importar con phpMyAdmin o por CLI.

```bash
# Importar desde CLI
mysql -u root -p express < express.sql
```

#### Diagrama de relaciones

```
categorias ──────────────────┐
                             │ id_categoria
marcas ──────────────────┐  │
                          │  │
unidades_medida ───────┐  │  │
                       │  │  │
                   productos (tabla central)
                       │
                   inventario
                       │
                   ubicaciones
```

#### Tablas

| Tabla             | Filas de datos | Descripción                          |
|-------------------|---------------|--------------------------------------|
| `categorias`      | 7             | Categorías de productos con slug     |
| `marcas`          | 25            | Marcas/fabricantes                   |
| `unidades_medida` | 9             | Tipos de unidad (unid, kg, cj, etc.) |
| `productos`       | 40            | Productos del inventario             |
| `inventario`      | 40            | Precios, stock y ubicación           |
| `ubicaciones`     | 31            | Pasillos y estantes del almacén      |

---

#### `categorias`
```sql
CREATE TABLE categorias (
  id_categoria      INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre_categoria  VARCHAR(100)  NOT NULL UNIQUE,
  slug              TEXT          NOT NULL,
  descripcion_categoria TEXT,
  created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
| id | nombre_categoria          | slug                       |
|----|---------------------------|----------------------------|
| 1  | Herramientas Manuales     | herramientas-manuales      |
| 2  | Herramientas Electricas   | herramientas-electricas    |
| 3  | Fijaciones y Tornilleria  | fijaciones-y-tornilleria   |
| 4  | Electricidad              | electricidad               |
| 5  | Plomeria y Griferia       | plomeria-y-griferia        |
| 6  | Pinturas y Acabados       | pinturas-y-acabados        |
| 7  | Construccion y Seguridad  | construccion-y-seguridad   |

---

#### `marcas` (25 registros)
```sql
CREATE TABLE marcas (
  id_marca      INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre_marca  VARCHAR(100)  NOT NULL UNIQUE,
  slug          TEXT          NOT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
Algunas marcas: Stanley, Truper, Bahco, Irwin, Bellota, DeWalt, Bosch, Makita, Black+Decker, Schneider, BTicino, Conduven, 3M, Pavco, Montana...

---

#### `unidades_medida`
```sql
CREATE TABLE unidades_medida (
  id_unidad     INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre_unidad VARCHAR(50)   NOT NULL UNIQUE,
  abreviatura   VARCHAR(10),
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
```
| id | nombre  | abreviatura |
|----|---------|-------------|
| 1  | Unidad  | unid        |
| 2  | Caja    | cj          |
| 3  | Paquete | pq          |
| 4  | Kilo    | kg          |
| 5  | Rollo   | rl          |
| 6  | Tubo    | tb          |
| 7  | Galon   | gal         |
| 8  | Cuñete  | ñete        |
| 9  | Par     | par         |

---

#### `productos` (40 registros)
```sql
CREATE TABLE productos (
  id_producto           INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre_producto       VARCHAR(255)  NOT NULL,
  slug                  TEXT          NOT NULL,
  descripcion_detallada TEXT,
  id_marca              INT           DEFAULT NULL,  -- FK → marcas
  id_categoria          INT           DEFAULT NULL,  -- FK → categorias
  id_unidad             INT           DEFAULT 1,     -- FK → unidades_medida
  created_at            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
Algunos productos de ejemplo:

| id | nombre_producto                  | categoria              | marca   |
|----|----------------------------------|------------------------|---------|
| 1  | Juego de Destornilladores Stanley | Herramientas Manuales  | Stanley |
| 8  | Taladro Percutor DeWalt 20V      | Herramientas Electricas| DeWalt  |
| 14 | Caja de Tornillos Drywall 1x1000 | Fijaciones y Tornilleria| Mejia  |
| 20 | Cable Electrico THW #12 AWG      | Electricidad           | Elecon  |
| 33 | Pintura Caucho Clase A Blanco    | Pinturas y Acabados    | Montana |

---

#### `inventario`
```sql
CREATE TABLE inventario (
  id_inventario              INT            NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_producto                INT            NOT NULL UNIQUE, -- FK → productos (CASCADE)
  id_ubicacion               INT            DEFAULT NULL,   -- FK → ubicaciones (SET NULL)
  precio_publico             DECIMAL(12,2)  NOT NULL,
  costo_proveedor            DECIMAL(12,2)  NOT NULL,
  stock_actual               INT            NOT NULL DEFAULT 0,
  stock_minimo               INT            DEFAULT 0,
  stock_maximo               INT            DEFAULT 0,
  fecha_ultima_actualizacion TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at                 TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);
```

---

#### `ubicaciones` (31 registros)
```sql
CREATE TABLE ubicaciones (
  id_ubicacion       INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  pasillo            VARCHAR(50),
  estante            VARCHAR(50),
  zona               VARCHAR(50),
  ubicacion_completa VARCHAR(255)  NOT NULL UNIQUE,
  created_at         TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
Algunas ubicaciones: Pasillo A - Estante 1/2/3, Pasillo B - Vitrina 1/2, Pasillo C - Tambores, Zona Pinturas - Paleta 1, Patio Tubos, Patio Hierros...

---

#### Vistas SQL incluidas

| Vista                        | Descripción                                          |
|------------------------------|------------------------------------------------------|
| `vista_productos_completos`  | JOIN completo: producto + marca + categoría + inventario + ubicación |
| `vista_productos_por_categoria` | Resumen de cantidad y stock total por categoría    |
| `vista_stock_bajo`           | Productos cuyo stock_actual <= stock_minimo          |

---

#### Restricciones (Foreign Keys)

```sql
-- inventario → productos (CASCADE delete/update)
FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE ON UPDATE CASCADE

-- inventario → ubicaciones (SET NULL on delete)
FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones(id_ubicacion) ON DELETE SET NULL ON UPDATE CASCADE

-- productos → marcas (SET NULL on delete)
FOREIGN KEY (id_marca) REFERENCES marcas(id_marca) ON DELETE SET NULL ON UPDATE CASCADE

-- productos → categorias (SET NULL on delete)
FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL ON UPDATE CASCADE

-- productos → unidades_medida (SET NULL on delete)
FOREIGN KEY (id_unidad) REFERENCES unidades_medida(id_unidad) ON DELETE SET NULL ON UPDATE CASCADE
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


