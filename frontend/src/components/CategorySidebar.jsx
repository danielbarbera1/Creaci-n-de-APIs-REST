import React, { useState } from 'react';
import { Tag, Layers, ChevronRight, Menu, X, Filter } from 'lucide-react';

export default function CategorySidebar({
  categorias,
  categoriaActiva,
  onSelectCategoria,
  totalProductosCount
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleSelect = (slug) => {
    onSelectCategoria(slug);
    setIsOpenMobile(false);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      {/* Botón Móvil para abrir menú de categorías */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 font-medium text-sm transition-colors hover:bg-slate-700/80"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span>Categoría:</span>
            <span className="font-semibold text-indigo-300 capitalize">
              {categoriaActiva ? categoriaActiva : 'Todas las categorías'}
            </span>
          </div>
          {isOpenMobile ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Menú de Categorías (Escritorio o desplegado en Móvil) */}
      <div className={`
        ${isOpenMobile ? 'block' : 'hidden'} lg:block 
        bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-xl space-y-2
      `}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Categorías</span>
          </div>
          <span className="text-xs px-2 py-0.5 bg-slate-700/60 text-slate-400 rounded-full font-mono">
            {categorias.length}
          </span>
        </div>

        {/* Opción Todas */}
        <button
          onClick={() => handleSelect(null)}
          className={`
            w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left group
            ${categoriaActiva === null
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 border border-transparent'
            }
          `}
        >
          <div className="flex items-center gap-2.5">
            <Tag className={`w-4 h-4 ${categoriaActiva === null ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
            <span>Todas las categorías</span>
          </div>
          {categoriaActiva === null && (
            <ChevronRight className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* Lista de Categorías de la API */}
        <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
          {categorias.map((cat) => {
            const slug = cat.slug || cat.nombre_categoria?.toLowerCase().replace(/\s+/g, '-');
            const nombre = cat.nombre || cat.nombre_categoria || cat.slug;
            const isSelected = categoriaActiva === slug;

            return (
              <button
                key={slug}
                onClick={() => handleSelect(slug)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left capitalize group
                  ${isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-400' : 'bg-slate-500 group-hover:bg-indigo-400'}`} />
                  <span className="truncate">{nombre}</span>
                </div>
                {isSelected && (
                  <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
