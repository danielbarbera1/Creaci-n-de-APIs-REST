import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CategorySidebar from './components/CategorySidebar';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import ProductFormModal from './components/ProductFormModal';
import ConfirmModal from './components/ConfirmModal';
import Pagination from './components/Pagination';
import Toast from './components/Toast';
import PromotionsSection from './components/PromotionsSection';
import { Loader2, AlertCircle, PackageX, Plus, RefreshCw } from 'lucide-react';

function App() {
  const api = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL_PRODUCCION || 'https://creaci-n-de-ap-is-rest.vercel.app/api')
    : (import.meta.env.VITE_API_URL || 'http://localhost:3000/api');

  // Core Data States
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [promocionesActivas, setPromocionesActivas] = useState([]); // Nuevo estado para promos

  // View States
  const [activeView, setActiveView] = useState('productos'); // 'productos' | 'promociones'

  // Active Filter / Navigation States
  const [categoriaActiva, setCategoriaActiva] = useState(null); // null = todas
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('nombre_producto');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  // UI / Modal / Notification States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Inicializar desde localStorage o preferir dark mode si está en SO
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Efecto para aplicar la clase dark al html y guardar en localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Modals
  const [detailProductId, setDetailProductId] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductInfo, setDeleteProductInfo] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // 0. Cargar Promociones Activas para calcular descuentos
  const fetchPromocionesActivas = useCallback(() => {
    fetch(`${api}/promociones`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          // Filtramos solo las que están activas validando la fecha de expiración
          const ahora = new Date();
          const validas = data.filter(p => {
            if (p.estado !== 'activa') return false;
            if (p.fecha_inicio && new Date(p.fecha_inicio) > ahora) return false;
            if (p.fecha_fin && new Date(p.fecha_fin) < ahora) return false;
            return true;
          });
          setPromocionesActivas(validas);
        }
      })
      .catch(err => console.error('Error cargando promociones:', err));
  }, [api]);

  useEffect(() => {
    fetchPromocionesActivas();
  }, [fetchPromocionesActivas]);


  // 1. Cargar lista de categorías y marcas al iniciar
  useEffect(() => {
    // Categorías
    fetch(`${api}/categorias`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategorias(data.map(c => ({
            ...c,
            slug: c.slug || c.nombre_categoria.toLowerCase().replace(/\s+/g, '-')
          })));
        } else {
          // Fallback a endpoint de categories si el backend responde con availableCategories
          fetch(`${api}/productos/categories/slug`)
            .then(r => r.json())
            .then(d => {
              if (d.availableCategories) setCategorias(d.availableCategories);
            })
            .catch(() => { });
        }
      })
      .catch(err => {
        console.error('Error al cargar categorías:', err);
      });

    // Marcas
    fetch(`${api}/marcas`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) setMarcas(data);
      })
      .catch(err => {
        console.error('Error al cargar marcas:', err);
      });
  }, [api]);

  // 2. Función principal para fetch de productos (por categoría o global)
  const fetchProductos = useCallback(() => {
    if (activeView !== 'productos') return;
    setLoading(true);
    setError(null);

    let url = '';

    if (categoriaActiva) {
      // Usamos el endpoint paginado y filtrado de categorías
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', '9');
      if (selectedBrand) queryParams.append('brand', selectedBrand);
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);
      if (searchQuery) queryParams.append('search', searchQuery);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (sortOrder) queryParams.append('sortOrder', sortOrder);

      url = `${api}/productos/categories/${categoriaActiva}?${queryParams.toString()}`;
    } else {
      // Todas las categorías
      url = `${api}/productos`;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: No se pudo obtener la lista de productos.`);
        }
        return res.json();
      })
      .then(data => {
        if (categoriaActiva) {
          // Formato retornado por /api/productos/categories/:slug
          setProductos(data.products || []);
          setTotalPages(data.totalPages || 1);
          setTotalProductsCount(data.total || 0);
        } else {
          // Formato retornado por /api/productos (arreglo simple)
          const allProducts = Array.isArray(data) ? data : [];
          setProductos(allProducts);
          setTotalPages(1);
          setTotalProductsCount(allProducts.length);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error en fetchProductos:', err);
        setError('No se pudo conectar con la API de backend. Por favor verifica que el servidor esté activo.');
        setLoading(false);
      });
  }, [api, categoriaActiva, page, selectedBrand, minPrice, maxPrice, searchQuery, sortBy, sortOrder, activeView]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Reset de página al cambiar filtros o categorías
  const handleSelectCategoria = (slug) => {
    setCategoriaActiva(slug);
    setActiveView('productos'); // Cambiar a vista productos al seleccionar categoria
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('nombre_producto');
    setSortOrder('ASC');
    setSearchQuery('');
    setPage(1);
  };

  // Filtrado y ordenamiento en cliente si no hay categoría seleccionada (para /api/productos general)
  const productosFiltrados = useCallback(() => {
    if (categoriaActiva) return productos; // Ya viene filtrado de la API

    let list = [...productos];

    // Buscador
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        (p.nombre_producto || p.nombre || '').toLowerCase().includes(q) ||
        (p.descripcion_detallada || p.descripcion || '').toLowerCase().includes(q)
      );
    }

    // Marca
    if (selectedBrand) {
      list = list.filter(p => {
        const m = typeof p.marca === 'object' ? p.marca?.nombre : (p.marca || p.nombre_marca);
        return m === selectedBrand;
      });
    }

    // Precios
    const hasAnyPriceFilter = minPrice !== '' || maxPrice !== '';
    if (hasAnyPriceFilter) {
      const min = minPrice !== '' ? parseFloat(minPrice) : null;
      const max = maxPrice !== '' ? parseFloat(maxPrice) : null;
      list = list.filter(p => {
        const precio = parseFloat(
          p.inventario?.precio_publico ?? p.precio_publico ?? p.precio ?? null
        );
        // Excluir productos sin precio cuando hay filtro activo
        if (isNaN(precio) || precio === null) return false;
        if (min !== null && precio < min) return false;
        if (max !== null && precio > max) return false;
        return true;
      });
    }

    // Ordenamiento
    list.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'precio_publico') {
        valA = parseFloat(a.inventario?.precio_publico ?? a.precio_publico ?? 0);
        valB = parseFloat(b.inventario?.precio_publico ?? b.precio_publico ?? 0);
      } else if (sortBy === 'stock_actual') {
        valA = parseInt(a.inventario?.stock_actual ?? a.stock_actual ?? 0, 10);
        valB = parseInt(b.inventario?.stock_actual ?? b.stock_actual ?? 0, 10);
      } else {
        valA = (a.nombre_producto || a.nombre || '').toLowerCase();
        valB = (b.nombre_producto || b.nombre || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'ASC' ? -1 : 1;
      if (valA > valB) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });

    return list;
  }, [categoriaActiva, productos, searchQuery, selectedBrand, minPrice, maxPrice, sortBy, sortOrder]);

  const listaFinalProductos = productosFiltrados();

  // Handlers para Crear/Editar Producto (POST / PUT)
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (producto) => {
    setEditingProduct(producto);
    setIsFormModalOpen(true);
  };

  const handleSaveProduct = async (payload, idToUpdate) => {
    const isEdit = Boolean(idToUpdate);
    const url = isEdit ? `${api}/productos/${idToUpdate}` : `${api}/productos`;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Error ${res.status} al guardar producto.`);
    }

    showToast(
      isEdit ? `Producto "${payload.nombre_producto}" actualizado correctamente.` : `Producto "${payload.nombre_producto}" creado exitosamente.`
    );

    // Recargar lista de productos y catálogos
    fetchProductos();
  };

  // Handlers para Eliminar Producto (DELETE)
  const handleOpenDeleteModal = (id, name) => {
    setDeleteProductInfo({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteProductInfo) return;
    setDeleting(true);

    try {
      const res = await fetch(`${api}/productos/${deleteProductInfo.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar el producto.');
      }

      showToast(`Producto "${deleteProductInfo.name}" eliminado correctamente.`, 'success');
      setDeleteProductInfo(null);
      setDeleting(false);
      fetchProductos();
    } catch (err) {
      console.error('Error al eliminar:', err);
      showToast(err.message || 'Error al eliminar producto.', 'error');
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={(val) => { setSearchQuery(val); setPage(1); setActiveView('productos'); }}
        totalProducts={totalProductsCount}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Menú Lateral de Categorías */}
          <CategorySidebar
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            onSelectCategoria={handleSelectCategoria}
            totalProductosCount={totalProductsCount}
            activeView={activeView}
            onChangeView={(view) => { setActiveView(view); setCategoriaActiva(null); }}
            promocionesActivas={promocionesActivas.length}
          />

          {/* Panel Principal */}
          {activeView === 'productos' ? (
            <section className="flex-1 min-w-0">

              {/* Header del Panel */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight capitalize m-0">
                    {categoriaActiva ? `Categoría: ${categoriaActiva}` : 'Catálogo Completo'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Mostrando {listaFinalProductos.length} producto(s)
                    {categoriaActiva ? ` en esta categoría` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => { fetchProductos(); fetchPromocionesActivas(); }}
                    disabled={loading}
                    title="Actualizar"
                    className="p-2 text-gray-600 bg-white border border-gray-200 shadow-sm hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center shrink-0"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleOpenCreateModal}
                    className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Producto</span>
                  </button>
                </div>
              </div>

              {/* Filtros Visuales y Ordenamiento */}
              <FilterBar
                marcas={marcas}
                selectedBrand={selectedBrand}
                onBrandChange={(val) => { setSelectedBrand(val); setPage(1); }}
                minPrice={minPrice}
                onMinPriceChange={(val) => { setMinPrice(val); setPage(1); }}
                maxPrice={maxPrice}
                onMaxPriceChange={(val) => { setMaxPrice(val); setPage(1); }}
                sortBy={sortBy}
                onSortByChange={(val) => setSortBy(val)}
                sortOrder={sortOrder}
                onSortOrderChange={(val) => setSortOrder(val)}
                onResetFilters={handleResetFilters}
              />

              {/* Error Banner */}
              {error && (
                <div className="p-4 mb-5 bg-red-50 border border-red-200 rounded-xl text-red-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm shadow-sm">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                  <button
                    onClick={fetchProductos}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reintentar
                  </button>
                </div>
              )}

              {/* Grid de Productos */}
              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-sm font-medium">Cargando productos...</p>
                </div>
              ) : listaFinalProductos.length === 0 ? (
                <div className="py-16 px-4 bg-white border border-gray-200 rounded-2xl text-center flex flex-col items-center justify-center gap-3 shadow-sm">
                  <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                    <PackageX className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 m-0">No se encontraron productos</h3>
                  <p className="text-xs text-gray-500 max-w-sm">
                    Intenta cambiar el término de búsqueda, ajustar los filtros o registrar un nuevo producto.
                  </p>
                  <button
                    onClick={handleOpenCreateModal}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear Primer Producto</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {listaFinalProductos.map((prod) => {
                    const id = prod.id || prod.id_producto;
                    return (
                      <ProductCard
                        key={id}
                        producto={prod}
                        promocionesActivas={promocionesActivas}
                        onViewDetail={(pid) => setDetailProductId(pid)}
                        onEdit={handleOpenEditModal}
                        onDelete={handleOpenDeleteModal}
                      />
                    );
                  })}
                </div>
              )}

              {/* Paginación */}
              {categoriaActiva && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              )}

            </section>
          ) : (
            <PromotionsSection
              api={api}
              onShowToast={showToast}
              onUpdatePromotions={fetchPromocionesActivas}
            />
          )}

        </div>
      </main>

      {/* Modales */}
      {/* Modal Ficha Técnica / Detalle */}
      {detailProductId && (
        <ProductDetailModal
          productId={detailProductId}
          onClose={() => setDetailProductId(null)}
          api={api}
        />
      )}

      {/* Modal Formulario Crear/Editar */}
      {isFormModalOpen && (
        <ProductFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleSaveProduct}
          initialData={editingProduct}
          api={api}
        />
      )}

      {/* Modal Confirmar Borrado */}
      {deleteProductInfo && (
        <ConfirmModal
          isOpen={Boolean(deleteProductInfo)}
          title="¿Eliminar producto?"
          message={`¿Estás seguro de eliminar "${deleteProductInfo.name}"? Esta acción no se puede deshacer y borrará también su inventario.`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteProductInfo(null)}
          loading={deleting}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-5 px-4 text-center text-xs text-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-gray-700">Panel de administrador &copy; 2026</span>
          <span className="text-gray-400">Desarrollado con React, Express & Tailwind CSS</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
