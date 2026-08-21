import React from 'react';
import { Eye, Edit3, Trash2, Tag } from 'lucide-react';

export default function ProductCard({
  producto,
  promocionesActivas,
  onViewDetail,
  onEdit,
  onDelete
}) {
  const id = producto.id || producto.id_producto;
  const nombre = producto.nombre || producto.nombre_producto;
  const descripcion = producto.descripcion || producto.descripcion_detallada;

  const precio = producto.inventario?.precio_publico !== undefined
    ? parseFloat(producto.inventario.precio_publico)
    : parseFloat(producto.precio_publico || producto.precio || 0);

  const stock = producto.inventario?.stock_actual !== undefined
    ? parseInt(producto.inventario.stock_actual, 10)
    : parseInt(producto.stock_actual !== undefined ? producto.stock_actual : 0, 10);

  const marca = typeof producto.marca === 'object'
    ? producto.marca?.nombre
    : (producto.marca || producto.nombre_marca);

  const categoria = typeof producto.categoria === 'object'
    ? producto.categoria?.nombre
    : (producto.categoria || producto.nombre_categoria);

  const formatPrice = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? '$0.00' : `$ ${num.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const inStock = stock > 0;

  // ── Cálculo de Descuento (Promociones Globales / Categoría / Producto) ──
  let promoAplicable = null;
  let precioFinal = precio;

  if (promocionesActivas && promocionesActivas.length > 0 && precio > 0) {
    // Buscamos la mejor promoción aplicable. Por ahora asumimos 'todos' para simplificar,
    // o se podría verificar si el ID del producto o categoría está en una lista.
    const promosValidas = promocionesActivas.filter(p => p.aplica_a === 'todos' && p.tipo === 'porcentaje');
    if (promosValidas.length > 0) {
      // Ordenamos por valor descendente para aplicar el mayor descuento
      promosValidas.sort((a, b) => parseFloat(b.valor) - parseFloat(a.valor));
      promoAplicable = promosValidas[0];
      const descuentoValor = parseFloat(promoAplicable.valor);
      precioFinal = precio * (1 - (descuentoValor / 100));
    }
  }

  const hasDiscount = promoAplicable && precioFinal < precio;

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      
      {/* ── Badge de Descuento ── */}
      {hasDiscount && (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm z-10 flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {parseFloat(promoAplicable.valor)}% OFF
        </div>
      )}

      {/* Top: badges */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3 mt-1">
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
        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1 pr-12" title={nombre}>
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
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-xs text-gray-400 line-through leading-none mb-0.5">
                  {formatPrice(precio)}
                </span>
                <span className="text-lg font-bold text-red-600 leading-none flex items-center gap-1">
                  {formatPrice(precioFinal)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900 leading-none">
                {formatPrice(precio)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 self-end">
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
