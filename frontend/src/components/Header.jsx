import React from 'react';
import { Search, Moon, Sun } from 'lucide-react';

export default function Header({
  searchQuery,
  onSearchChange,
  totalProducts,
  isDarkMode,
  toggleDarkMode
}) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block">
            <span className="text-sm font-bold text-gray-900 tracking-tight">Panel de administrador</span>
            <span className="ml-2 text-xs font-medium text-gray-400">
              {totalProducts !== undefined ? `${totalProducts} registros` : ''}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 ">
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mr-1"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
