import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, Loader2, Save, AlertCircle } from 'lucide-react';

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  api
}) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    nombre_producto: '',
    descripcion_detallada: '',
    id_marca: '',
    id_categoria: '',
    id_unidad: 1,
    precio_publico: '',
    costo_proveedor: '',
    stock_actual: '',
    id_ubicacion: ''
  });

  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Bloquear scroll del body mientras la modal está abierta
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Cargar catálogos (marcas, categorías, ubicaciones) al abrir modal
  useEffect(() => {
    if (!isOpen) return;

    setLoadingData(true);
    setFormError(null);

    Promise.all([
      fetch(`${api}/marcas`).then(r => r.ok ? r.json() : []),
      fetch(`${api}/categorias`).then(r => r.ok ? r.json() : []),
      fetch(`${api}/ubicaciones`).then(r => r.ok ? r.json() : [])
    ]).then(([marcasData, categoriasData, ubicacionesData]) => {
      setMarcas(Array.isArray(marcasData) ? marcasData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      setUbicaciones(Array.isArray(ubicacionesData) ? ubicacionesData : []);
      setLoadingData(false);
    }).catch(err => {
      console.error('Error al cargar catálogos:', err);
      setLoadingData(false);
    });
  }, [isOpen, api]);

  // Si estamos editando, cargar valores del producto
  useEffect(() => {
    if (isOpen && initialData) {
      // Extraer campos soportando ambos formatos
      const nombre = initialData.nombre || initialData.nombre_producto || '';
      const desc = initialData.descripcion || initialData.descripcion_detallada || '';
      
      const idMarca = typeof initialData.marca === 'object'
        ? initialData.marca?.id
        : (initialData.id_marca || '');

      const idCat = typeof initialData.categoria === 'object'
        ? initialData.categoria?.id
        : (initialData.id_categoria || '');

      const idUnidad = typeof initialData.unidad === 'object'
        ? initialData.unidad?.id
        : (initialData.id_unidad || 1);

      const precio = initialData.inventario?.precio_publico !== undefined
        ? initialData.inventario.precio_publico
        : (initialData.precio_publico || initialData.precio || '');

      const costo = initialData.inventario?.costo_proveedor !== undefined
        ? initialData.inventario.costo_proveedor
        : (initialData.costo_proveedor || initialData.costo || '');

      const stock = initialData.inventario?.stock_actual !== undefined
        ? initialData.inventario.stock_actual
        : (initialData.stock_actual !== undefined ? initialData.stock_actual : '');

      const idUbi = typeof initialData.ubicacion === 'object'
        ? initialData.ubicacion?.id
        : (initialData.id_ubicacion || '');

      setFormData({
        nombre_producto: nombre,
        descripcion_detallada: desc,
        id_marca: idMarca || '',
        id_categoria: idCat || '',
        id_unidad: idUnidad || 1,
        precio_publico: precio,
        costo_proveedor: costo,
        stock_actual: stock,
        id_ubicacion: idUbi || ''
      });
    } else if (isOpen) {
      setFormData({
        nombre_producto: '',
        descripcion_detallada: '',
        id_marca: '',
        id_categoria: '',
        id_unidad: 1,
        precio_publico: '',
        costo_proveedor: '',
        stock_actual: '',
        id_ubicacion: ''
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validar campos obligatorios
    if (!formData.nombre_producto.trim()) {
      setFormError('El nombre del producto es obligatorio.');
      return;
    }
    if (!formData.id_marca) {
      setFormError('Debes seleccionar una marca.');
      return;
    }
    if (!formData.id_categoria) {
      setFormError('Debes seleccionar una categoría.');
      return;
    }

    // Convertir tipos numéricos
    const payload = {
      nombre_producto: formData.nombre_producto.trim(),
      descripcion_detallada: formData.descripcion_detallada.trim(),
      id_marca: Number(formData.id_marca),
      id_categoria: Number(formData.id_categoria),
      id_unidad: Number(formData.id_unidad) || 1,
      precio_publico: formData.precio_publico !== '' ? parseFloat(formData.precio_publico) : 0,
      costo_proveedor: formData.costo_proveedor !== '' ? parseFloat(formData.costo_proveedor) : 0,
      stock_actual: formData.stock_actual !== '' ? parseInt(formData.stock_actual, 10) : 0,
      id_ubicacion: formData.id_ubicacion ? Number(formData.id_ubicacion) : null
    };

    setSubmitting(true);
    try {
      await onSubmit(payload, initialData?.id || initialData?.id_producto);
      setSubmitting(false);
      onClose();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      setFormError(err.message || 'Ocurrió un error al procesar la solicitud.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] animate-fade-in" onClick={onClose}>
      <div
        className="bg-white border border-gray-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center">
              {isEditing ? <Edit3 className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 m-0">
                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <p className="text-xs text-gray-400">
                {isEditing ? 'Modifica los datos del registro' : 'Completa los campos para registrar un producto'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Nombre del Producto */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre_producto"
              required
              placeholder="Ej: Taladro Inalámbrico 20V"
              value={formData.nombre_producto}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Descripción
            </label>
            <textarea
              name="descripcion_detallada"
              rows={2}
              placeholder="Características principales del producto..."
              value={formData.descripcion_detallada}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm resize-none"
            />
          </div>

          {/* Grid: Marca & Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Marca <span className="text-red-500">*</span>
              </label>
              <select
                name="id_marca"
                required
                value={formData.id_marca}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm cursor-pointer"
              >
                <option value="">Seleccionar marca</option>
                {marcas.map(m => (
                  <option key={m.id_marca} value={m.id_marca}>{m.nombre_marca}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="id_categoria"
                required
                value={formData.id_categoria}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm cursor-pointer"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(c => (
                  <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid: Precio & Costo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Precio Público ($)</label>
              <input
                type="number" step="0.01" min="0" name="precio_publico" placeholder="0.00"
                value={formData.precio_publico} onChange={handleChange}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Costo Proveedor ($)</label>
              <input
                type="number" step="0.01" min="0" name="costo_proveedor" placeholder="0.00"
                value={formData.costo_proveedor} onChange={handleChange}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
              />
            </div>
          </div>

          {/* Grid: Stock & Ubicación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Stock Actual</label>
              <input
                type="number" min="0" name="stock_actual" placeholder="0"
                value={formData.stock_actual} onChange={handleChange}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ubicación en Almacén</label>
              <select
                name="id_ubicacion" value={formData.id_ubicacion} onChange={handleChange}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm cursor-pointer"
              >
                <option value="">Sin ubicación asignada</option>
                {ubicaciones.map(u => (
                  <option key={u.id_ubicacion} value={u.id_ubicacion}>
                    {u.ubicacion_completa || `Pasillo ${u.pasillo} - Estante ${u.estante}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-sm transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Guardando...</span></>
              ) : (
                <><Save className="w-4 h-4" /><span>{isEditing ? 'Guardar cambios' : 'Crear producto'}</span></>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
