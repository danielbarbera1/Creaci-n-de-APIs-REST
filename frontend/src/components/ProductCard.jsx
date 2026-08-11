import React from 'react';
import { Eye, Edit3, Trash2, Tag, ShieldCheck, Box } from 'lucide-react';

export default function ProductCard({
  producto,
  onViewDetail,
  onEdit,
  onDelete
}) {
  const id = producto.id || producto.id_producto;
  const nombre = producto.nombre || producto.nombre_producto;
  const descripcion = producto.descripcion || producto.descripcion_detallada;
  
  // Extraer precio
  const precio = producto.inventario?.precio_publico !== undefined
    ? producto.inventario.precio_publico
    : (producto.precio_publico || producto.precio || 0);

  // Extraer stock
  const stock = producto.inventario?.stock_actual !== undefined
    ? producto.inventario.stock_actual
    : (producto.stock_actual !== undefined ? producto.stock_actual : 0);

  // Extraer marca y categoría
  const marca = typeof producto.marca === 'object' ? producto.marca?.nombre : (producto.marca || producto.nombre_marca);
  const categoria = typeof producto.categoria === 'object' ? producto.categoria?.nombre : (producto.categoria || producto.nombre_categoria);

  const formatPrice = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? '$0.00' : `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      
      {/* Accent Top Highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/0 group-hover:via-indigo-500 transition-all duration-500" />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {categoria && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 capitalize">
                <Tag className="w-3 h-3" />
                {categoria}
              </span>
            )}
            {marca && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700/60 text-slate-300 border border-slate-600/50">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
                {marca}
              </span>
            )}
          </div>

          {/* Stock status badge */}
          {stock > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {stock} en stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Sin stock
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-200 transition-colors line-clamp-1 mb-1" title={nombre}>
          {nombre}
        </h3>

        {/* Product Description */}
        {descripcion ? (
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 h-8 leading-relaxed">
            {descripcion}
          </p>
        ) : (
          <p className="text-xs text-slate-500 italic mb-4 h-8">
            Sin descripción detallada.
          </p>
        )}
      </div>

      {/* Footer: Price & Quick Action Buttons */}
      <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between gap-3 mt-2">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">
            Precio Público
          </span>
          <span className="text-xl font-extrabold text-white tracking-tight">
            {formatPrice(precio)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Detail Button */}
          <button
            onClick={() => onViewDetail(id)}
            title="Ver detalle completo"
            className="p-2 rounded-xl bg-slate-700/50 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-600/40 hover:border-indigo-500/40 transition-all"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(producto)}
            title="Editar producto"
            className="p-2 rounded-xl bg-slate-700/50 hover:bg-amber-600/30 text-slate-300 hover:text-amber-200 border border-slate-600/40 hover:border-amber-500/40 transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(id, nombre)}
            title="Eliminar producto"
            className="p-2 rounded-xl bg-slate-700/50 hover:bg-rose-600/30 text-slate-300 hover:text-rose-300 border border-slate-600/40 hover:border-rose-500/40 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
