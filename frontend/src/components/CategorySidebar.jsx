import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Tag } from 'lucide-react';

export default function CategorySidebar({
  categorias,
  categoriaActiva,
  onSelectCategoria,
  totalProductosCount,
  activeView,
  onChangeView,
  totalPromociones = 0,
  promocionesActivas = 0,
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleSelect = (slug) => {
    onSelectCategoria(slug);
    setIsOpenMobile(false);
  };

  const SidebarContent = () => (
    <nav className="space-y-0.5">
      {/* Todas  */}
      <button
        onClick={() => { handleSelect(null); onChangeView('productos'); }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
            categoriaActiva === null && activeView === 'productos'
            ? 'bg-blue-50 text-blue-700 font-semibold'
            : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
          }`}
      >
        <span>Todos los productos</span>
        {categoriaActiva === null && activeView === 'productos' && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
            {totalProductosCount}
          </span>
        )}
      </button>

      {/* Lista categorías */}
      <div className="pt-2 border-t border-gray-100 mt-2 space-y-0.5">
        {categorias.map((cat) => {
          const slug = cat.slug || cat.nombre_categoria?.toLowerCase().replace(/\s+/g, '-');
          const nombre = cat.nombre || cat.nombre_categoria || cat.slug;
          const isSelected = categoriaActiva === slug;

          return (
            <button
              key={slug}
              onClick={() => handleSelect(slug)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left capitalize ${isSelected
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-blue-600' : 'bg-gray-300'}`} />
                <span className="truncate">{nombre}</span>
              </div>
              {isSelected && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Sección Promociones ── */}
      <div className="pt-3 mt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 px-1 pb-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Gestión</span>
        </div>

        <button
          onClick={() => { onChangeView('promociones'); setIsOpenMobile(false); }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${activeView === 'promociones'
              ? 'bg-purple-50 text-purple-700 font-semibold'
              : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
            }`}
        >
          <div className="flex items-center gap-2.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${activeView === 'promociones' ? 'bg-purple-600' : 'bg-gray-300'}`} />
            <span>Promociones</span>
          </div>
          <div className="flex items-center gap-1">
            {promocionesActivas > 0 && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                {promocionesActivas} activas
              </span>
            )}
          </div>
        </button>
      </div>
    </nav>
  );

  return (
    <aside className="w-full lg:w-56 shrink-0">
      {/* Botón móvil */}
      <div className="lg:hidden mb-3">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="capitalize">{categoriaActiva || 'Todas las categorías'}</span>
          </div>
          {isOpenMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className={`${isOpenMobile ? 'block' : 'hidden'} lg:block bg-white border border-gray-200 rounded-xl p-3 shadow-sm`}>
        <div className="flex items-center gap-2 px-1 pb-3 mb-1">
          <Layers className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Categorías</span>
        </div>
        <SidebarContent />
      </div>
    </aside>
  );
}
