import React from 'react';
import { Eye, Edit3, Trash2 } from 'lucide-react';

export default function ProductCard({
  producto,
  onViewDetail,
  onEdit,
  onDelete
}) {
  const id = producto.id || producto.id_producto;
  const nombre = producto.nombre || producto.nombre_producto;
  const descripcion = producto.descripcion || producto.descripcion_detallada;

  const precio = producto.inventario?.precio_publico !== undefined
    ? producto.inventario.precio_publico
    : (producto.precio_publico || producto.precio || 0);

  const stock = producto.inventario?.stock_actual !== undefined
    ? producto.inventario.stock_actual
    : (producto.stock_actual !== undefined ? producto.stock_actual : 0);

  const marca = typeof producto.marca === 'object'
    ? producto.marca?.nombre
    : (producto.marca || producto.nombre_marca);

  const categoria = typeof producto.categoria === 'object'
    ? producto.categoria?.nombre
    : (producto.categoria || producto.nombre_categoria);

  const formatPrice = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? '$0.00' : `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const inStock = stock > 0;

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col justify-between">

      {/* Top: badges */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {categoria && (
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                {categoria}
              </span>
            )}
            {marca && (
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                {marca}
              </span>
            )}
          </div>

          {/* Stock pill */}
          <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${
            inStock
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-red-400'}`} />
            {inStock ? `${stock} uds.` : 'Sin stock'}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1" title={nombre}>
          {nombre}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {descripcion || 'Sin descripción disponible.'}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 mb-0.5">
            Precio
          </p>
          <p className="text-lg font-bold text-gray-900 leading-none">
            {formatPrice(precio)}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewDetail(id)}
            title="Ver detalle"
            className="p-2 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(producto)}
            title="Editar"
            className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-100 transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id, nombre)}
            title="Eliminar"
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
