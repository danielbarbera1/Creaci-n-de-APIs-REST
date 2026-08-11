import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Layers, MapPin, Tag, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export default function ProductDetailModal({ productId, onClose, api }) {
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    fetch(`${api}/productos/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => { setProductDetail(data); setLoading(false); })
      .catch((err) => {
        setError(err.message || 'Error al obtener el detalle');
        setLoading(false);
      });
  }, [productId, api]);

  if (!productId) return null;

  const formatPrice = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? '$0.00' : `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  };

  const inStock = (productDetail?.inventario?.stock ?? 0) > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center">
              <Package className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 m-0">Ficha de Producto</h2>
              <p className="text-xs text-gray-400">Ref. #{productId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm">Cargando información...</p>
            </div>
          ) : error ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-red-500 text-center">
              <AlertCircle className="w-10 h-10" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : productDetail ? (
            <>
              {/* Badges + Nombre */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {productDetail.categoria?.nombre && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5 capitalize">
                      <Tag className="w-3 h-3" />{productDetail.categoria.nombre}
                    </span>
                  )}
                  {productDetail.marca?.nombre && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" />{productDetail.marca.nombre}
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                    inStock
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {inStock ? 'En Stock' : 'Sin Stock'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{productDetail.nombre}</h3>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-lg border border-gray-100">
                  {productDetail.descripcion || 'Sin descripción disponible.'}
                </p>
              </div>

              {/* Grid Financiero + Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>Precios</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Precio público</span>
                      <span className="font-bold text-gray-900 text-base">{formatPrice(productDetail.inventario?.precio)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-500">Costo proveedor</span>
                      <span className="font-semibold text-gray-700">{formatPrice(productDetail.inventario?.costo)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    <Layers className="w-4 h-4" />
                    <span>Inventario</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Stock actual</span>
                      <span className="font-bold text-gray-900 text-base">
                        {productDetail.inventario?.stock ?? 0} {productDetail.unidad?.abreviatura || 'uds.'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-500">Rango seguro</span>
                      <span className="text-gray-700">
                        Mín {productDetail.inventario?.min_stock ?? 0} — Máx {productDetail.inventario?.max_stock ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>Ubicación en Almacén</span>
                </div>
                {productDetail.ubicacion?.fullLocation ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { label: 'Ubicación', val: productDetail.ubicacion.fullLocation },
                      { label: 'Pasillo',   val: productDetail.ubicacion.aisle  || 'N/A' },
                      { label: 'Estante',   val: productDetail.ubicacion.shelf  || 'N/A' },
                      { label: 'Zona',      val: productDetail.ubicacion.zone   || 'N/A' },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-white border border-gray-200 p-2.5 rounded-lg">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">{label}</span>
                        <span className="font-bold text-gray-800 text-sm">{val}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">Sin ubicación asignada.</p>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end rounded-b-2xl shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
