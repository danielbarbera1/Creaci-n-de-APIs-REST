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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 m-0">
                {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Modifica los datos del registro existente' : 'Ingresa los datos para registrar un producto en el sistema'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Nombre del Producto */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Nombre del Producto <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="nombre_producto"
              required
              placeholder="Ej: Taladro Inalámbrico 20V"
              value={formData.nombre_producto}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Descripción Detallada
            </label>
            <textarea
              name="descripcion_detallada"
              rows={2}
              placeholder="Características principales del producto..."
              value={formData.descripcion_detallada}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>

          {/* Grid: Marca & Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Marca <span className="text-rose-400">*</span>
              </label>
              <select
                name="id_marca"
                required
                value={formData.id_marca}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 transition-all text-sm cursor-pointer"
              >
                <option value="">-- Seleccionar Marca --</option>
                {marcas.map(m => (
                  <option key={m.id_marca} value={m.id_marca}>
                    {m.nombre_marca}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Categoría <span className="text-rose-400">*</span>
              </label>
              <select
                name="id_categoria"
                required
                value={formData.id_categoria}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 transition-all text-sm cursor-pointer"
              >
                <option value="">-- Seleccionar Categoría --</option>
                {categorias.map(c => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid: Precio & Costo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Precio Público ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="precio_publico"
                placeholder="0.00"
                value={formData.precio_publico}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Costo Proveedor ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="costo_proveedor"
                placeholder="0.00"
                value={formData.costo_proveedor}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Grid: Stock & Ubicación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Stock Inicial / Actual
              </label>
              <input
                type="number"
                min="0"
                name="stock_actual"
                placeholder="0"
                value={formData.stock_actual}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Ubicación en Almacén
              </label>
              <select
                name="id_ubicacion"
                value={formData.id_ubicacion}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 transition-all text-sm cursor-pointer"
              >
                <option value="">-- Sin Ubicación Asignada --</option>
                {ubicaciones.map(u => (
                  <option key={u.id_ubicacion} value={u.id_ubicacion}>
                    {u.ubicacion_completa || `Pasillo ${u.pasillo} - Estante ${u.estante}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Guardar Cambios' : 'Crear Producto'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
