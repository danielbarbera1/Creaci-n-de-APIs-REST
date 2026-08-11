import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

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
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5 shadow-sm flex flex-wrap items-center gap-3">
      
      <div className="flex items-center gap-1.5 text-gray-500 shrink-0">
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Filtros</span>
      </div>

      <div className="w-px h-4 bg-gray-200 hidden sm:block" />

      {/* Precio rango */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 font-medium shrink-0">Precio:</label>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1.5 border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
          <span className="text-gray-400 text-xs">$</span>
          <input
            type="number"
            placeholder="Mín"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="w-14 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-xs"
            min="0"
          />
          <span className="text-gray-300 text-xs">–</span>
          <input
            type="number"
            placeholder="Máx"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-14 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-xs"
            min="0"
          />
        </div>
      </div>

      {/* Marca */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 font-medium shrink-0">Marca:</label>
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="text-xs bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 cursor-pointer transition-all"
        >
          <option value="">Todas</option>
          {marcas.map((m) => (
            <option key={m.id_marca || m.nombre_marca} value={m.nombre_marca}>
              {m.nombre_marca}
            </option>
          ))}
        </select>
      </div>

      {/* Ordenar */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 font-medium shrink-0">Ordenar:</label>
        <div className="flex items-center gap-1">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="text-xs bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 cursor-pointer transition-all"
          >
            <option value="nombre_producto">Nombre</option>
            <option value="precio_publico">Precio</option>
            <option value="stock_actual">Stock</option>
            <option value="marca">Marca</option>
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
            className="px-2.5 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-600 rounded-lg transition-colors"
            title={sortOrder === 'ASC' ? 'Ascendente' : 'Descendente'}
          >
            {sortOrder === 'ASC' ? '↑ Asc' : '↓ Des'}
          </button>
        </div>
      </div>

      {/* Limpiar */}
      {hasActiveFilters && (
        <>
          <div className="w-px h-4 bg-gray-200 hidden sm:block" />
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar filtros
          </button>
        </>
      )}
    </div>
  );
}
