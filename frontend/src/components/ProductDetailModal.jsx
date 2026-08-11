import React, { useState, useEffect } from 'react';
import { X, Package, ShieldCheck, Tag, MapPin, DollarSign, Layers, Loader2, AlertCircle } from 'lucide-react';

export default function ProductDetailModal({ productId, onClose, api }) {
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError(null);

    fetch(`${api}/productos/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: No se pudo cargar la información`);
        return res.json();
      })
      .then((data) => {
        setProductDetail(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar detalle:', err);
        setError(err.message || 'Error al obtener el detalle del producto');
        setLoading(false);
      });
  }, [productId, api]);

  if (!productId) return null;

  const formatPrice = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? '$0.00' : `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 m-0">Detalle del Producto</h2>
              <p className="text-xs text-slate-400">ID de Referencia: #{productId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-sm font-medium">Obteniendo datos de la API...</p>
            </div>
          ) : error ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-rose-400 text-center">
              <AlertCircle className="w-10 h-10" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : productDetail ? (
            <>
              {/* Main Info */}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {productDetail.categoria?.nombre && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5 capitalize">
                      <Tag className="w-3.5 h-3.5" />
                      {productDetail.categoria.nombre}
                    </span>
                  )}
                  {productDetail.marca?.nombre && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      {productDetail.marca.nombre}
                    </span>
                  )}
                  {productDetail.inventario?.estado && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      productDetail.inventario.stock > 0
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {productDetail.inventario.estado}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                  {productDetail.nombre}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
                  {productDetail.descripcion || 'Sin descripción disponible.'}
                </p>
              </div>

              {/* Grid: Financial & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Precios */}
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <DollarSign className="w-4 h-4" />
                    <span>Información Financiera</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Precio Público:</span>
                      <span className="text-lg font-bold text-emerald-400">
                        {formatPrice(productDetail.inventario?.precio)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                      <span className="text-slate-400">Costo Proveedor:</span>
                      <span className="font-semibold text-slate-200">
                        {formatPrice(productDetail.inventario?.costo)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock & Medidas */}
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>Control de Inventario</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Stock Actual:</span>
                      <span className="font-bold text-white text-base">
                        {productDetail.inventario?.stock ?? 0} {productDetail.unidad?.abreviatura || 'unid'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-700/50">
                      <span className="text-slate-400">Rango Seguro:</span>
                      <span className="text-slate-300">
                        Mín: {productDetail.inventario?.min_stock ?? 0} | Máx: {productDetail.inventario?.max_stock ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Location Info */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>Ubicación en Almacén</span>
                </div>
                {productDetail.ubicacion?.fullLocation ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">Ubicación</span>
                      <span className="font-bold text-slate-200">{productDetail.ubicacion.fullLocation}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">Pasillo</span>
                      <span className="font-bold text-slate-200">{productDetail.ubicacion.aisle || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">Estante</span>
                      <span className="font-bold text-slate-200">{productDetail.ubicacion.shelf || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 block text-[10px]">Zona</span>
                      <span className="font-bold text-slate-200">{productDetail.ubicacion.zone || 'N/A'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No tiene ubicación asignada en almacén.</p>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-800/40 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium text-sm transition-colors"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}
