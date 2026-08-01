# Frontend — React + Vite + TailwindCSS

Interfaz visual del sistema de gestión de inventario. Se conecta a la API REST del backend en Express.js.

## Stack
- React 19
- Vite 8
- TailwindCSS 4

## Instalación

```bash
npm install
npm run dev
```

App disponible en: http://localhost:5173

## Variables de entorno

Archivo `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

## Funcionalidades actuales

- Listado de categorías (desde la API)
- Listado de todos los productos al cargar
- Filtrado de productos por categoría al hacer clic en el menú lateral
- Indicador de stock por producto

## Pendientes del frontend

Ver el archivo PENDIENTES.md en la raíz del proyecto para la lista completa.
Los puntos principales son:

- Panel administrativo (crear/editar/eliminar productos desde la UI)
- Vista de detalle de producto
- Mostrar precio y marca en las tarjetas
- Buscador y filtros visuales
- Loading states y manejo de errores en la UI
