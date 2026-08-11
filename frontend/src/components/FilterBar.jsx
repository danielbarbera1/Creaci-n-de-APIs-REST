import React from 'react';
import { SlidersHorizontal, RotateCcw, ArrowUpDown } from 'lucide-react';

export default function FilterBar({
  marcas,
  selectedBrand,
  onBrandChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onResetFilters
}) {
  const hasActiveFilters = selectedBrand || minPrice || maxPrice || sortBy !== 'nombre_producto';

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-3.5 mb-6 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-300">
        
        {/* Title */}
        <div className="flex items-center gap-2 text-indigo-400 font-semibold">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtros y Orden</span>
        </div>

        {/* Form Controls Container */}
        <div className="flex flex-wrap items-center gap-3 flex-1 justify-end">
          
          {/* Rango de Precios */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
            <span className="text-slate-400">Precio $:</span>
            <input
              type="number"
              placeholder="Mín"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-14 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-xs"
              min="0"
            />
            <span className="text-slate-500">-</span>
            <input
              type="number"
              placeholder="Máx"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-14 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-xs"
              min="0"
            />
          </div>

          {/* Selector de Marcas */}
          <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl px-2 py-1.5">
            <select
              value={selectedBrand}
              onChange={(e) => onBrandChange(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs cursor-pointer pr-1"
            >
              <option value="" className="bg-slate-800 text-slate-200">Todas las marcas</option>
              {marcas.map((m) => (
                <option key={m.id_marca || m.nombre_marca} value={m.nombre_marca} className="bg-slate-800 text-slate-200">
                  {m.nombre_marca}
                </option>
              ))}
            </select>
          </div>

          {/* Criterio de Ordenamiento */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-700/80 rounded-xl px-2 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs cursor-pointer"
            >
              <option value="nombre_producto" className="bg-slate-800">Nombre</option>
              <option value="precio_publico" className="bg-slate-800">Precio</option>
              <option value="stock_actual" className="bg-slate-800">Stock</option>
              <option value="marca" className="bg-slate-800">Marca</option>
            </select>

            <button
              onClick={() => onSortOrderChange(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold uppercase transition-colors"
              title={sortOrder === 'ASC' ? 'Orden Ascendente' : 'Orden Descendente'}
            >
              {sortOrder}
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl transition-all text-xs font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
