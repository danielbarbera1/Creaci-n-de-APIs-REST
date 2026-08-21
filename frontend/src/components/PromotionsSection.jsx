import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Plus, Edit3, Trash2, RefreshCw, Loader2, AlertCircle, Calendar, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import PromotionFormModal from './PromotionFormModal';
import ConfirmModal from './ConfirmModal';

// ── Utilidades ────────────────────────────────────────────────────────────────

function getEstadoReal(promo) {
  const ahora = new Date();
  const fin = promo.fecha_fin ? new Date(promo.fecha_fin) : null;
  const inicio = promo.fecha_inicio ? new Date(promo.fecha_inicio) : null;

  if (promo.estado === 'inactiva') return 'inactiva';
  if (fin && fin < ahora) return 'expirada';
  if (inicio && inicio > ahora) return 'pendiente';
  return 'activa';
}

const ESTADO_BADGE = {
  activa:    { label: 'Activa',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', Icon: CheckCircle },
  inactiva:  { label: 'Inactiva',  cls: 'bg-gray-100 text-gray-600 border-gray-200',         dot: 'bg-gray-400',   Icon: XCircle },
  expirada:  { label: 'Expirada',  cls: 'bg-red-50 text-red-600 border-red-200',             dot: 'bg-red-400',    Icon: XCircle },
  pendiente: { label: 'Pendiente', cls: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-400',  Icon: Clock },
};

const TIPO_LABEL = {
  porcentaje:      '% Porcentaje',
  monto_fijo:     '$ Monto fijo',
  envio_gratis:   '🚚 Envío gratis',
  producto_gratis: '🎁 Producto gratis',
};

function formatFecha(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function diasRestantes(fecha_fin) {
  if (!fecha_fin) return null;
  const diff = new Date(fecha_fin) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function PromotionsSection({ api, onShowToast }) {
  const [promociones, setPromociones]         = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [filtroEstado, setFiltroEstado]       = useState('todas');
  const [searchQ, setSearchQ]                 = useState('');

  // Modales
  const [formOpen, setFormOpen]               = useState(false);
  const [editingPromo, setEditingPromo]       = useState(null);
  const [deleteInfo, setDeleteInfo]           = useState(null);
  const [deleting, setDeleting]               = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchPromociones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${api}/promociones`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setPromociones(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('No se pudo cargar la lista de promociones. Verifica que el servidor esté activo.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { fetchPromociones(); }, [fetchPromociones]);

  // ── Filtros ────────────────────────────────────────────────────────────────
  const listaFiltrada = promociones
    .map(p => ({ ...p, _estadoReal: getEstadoReal(p) }))
    .filter(p => {
      if (filtroEstado !== 'todas' && p._estadoReal !== filtroEstado) return false;
      if (searchQ.trim()) {
        const q = searchQ.toLowerCase();
        return (
          p.nombre?.toLowerCase().includes(q) ||
          p.codigo?.toLowerCase().includes(q) ||
          p.descripcion?.toLowerCase().includes(q)
        );
      }
      return true;
    });

  const counts = promociones.reduce((acc, p) => {
    const s = getEstadoReal(p);
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // ── Handlers CRUD ──────────────────────────────────────────────────────────
  const handleSave = async (payload, id) => {
    const isEdit = Boolean(id);
    const url    = isEdit ? `${api}/promociones/${id}` : `${api}/promociones`;
    const method = isEdit ? 'PUT' : 'POST';

    const res  = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`);

    onShowToast(
      isEdit
        ? `Promoción "${payload.nombre}" actualizada correctamente.`
        : `Promoción "${payload.nombre}" creada exitosamente.`
    );
    fetchPromociones();
  };

  const handleDelete = async () => {
    if (!deleteInfo) return;
    setDeleting(true);
    try {
      const res  = await fetch(`${api}/promociones/${deleteInfo.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar');
      onShowToast(`Promoción "${deleteInfo.nombre}" eliminada.`);
      setDeleteInfo(null);
      fetchPromociones();
    } catch (err) {
      onShowToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section className="flex-1 min-w-0 animate-fade-in">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight m-0 flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-600" />
            Promociones
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {promociones.length} promoción(es) en total · {counts.activa || 0} activas · {counts.expirada || 0} expiradas
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchPromociones}
            disabled={loading}
            title="Actualizar"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => { setEditingPromo(null); setFormOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nueva Promoción
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Buscar por código o nombre..."
            className="w-full pl-9 pr-3 py-2 bg-gray-100 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
          />
        </div>

        {/* Estado tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {['todas', 'activa', 'inactiva', 'expirada', 'pendiente'].map(s => (
            <button
              key={s}
              onClick={() => setFiltroEstado(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors capitalize ${
                filtroEstado === s
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s === 'todas' ? `Todas (${promociones.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchPromociones} className="ml-auto px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg text-xs font-semibold transition">Reintentar</button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="py-24 flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-7 h-7 animate-spin text-purple-600" />
          <p className="text-sm font-medium">Cargando promociones...</p>
        </div>
      ) : listaFiltrada.length === 0 ? (
        <div className="py-16 bg-white border border-gray-200 rounded-2xl text-center flex flex-col items-center gap-3 shadow-sm">
          <div className="p-4 bg-gray-50 rounded-full text-gray-400">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 m-0">No hay promociones</h3>
          <p className="text-xs text-gray-500">Crea tu primera promoción para empezar a ofrecer descuentos.</p>
          <button
            onClick={() => { setEditingPromo(null); setFormOpen(true); }}
            className="mt-1 flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Crear primera promoción
          </button>
        </div>
      ) : (
        /* Tabla */
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Código / Nombre</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descuento</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vigencia</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usos</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {listaFiltrada.map((promo) => {
                  const badge  = ESTADO_BADGE[promo._estadoReal] || ESTADO_BADGE.inactiva;
                  const dias   = promo._estadoReal === 'activa' ? diasRestantes(promo.fecha_fin) : null;

                  return (
                    <tr key={promo.id_promocion} className="hover:bg-gray-50 transition-colors group">
                      {/* Código/Nombre */}
                      <td className="px-4 py-3">
                        <p className="font-mono font-bold text-purple-700 text-xs tracking-wider">{promo.codigo}</p>
                        <p className="text-gray-800 font-medium text-sm truncate max-w-[160px]">{promo.nombre}</p>
                        {promo.descripcion && (
                          <p className="text-gray-400 text-xs truncate max-w-[160px]">{promo.descripcion}</p>
                        )}
                      </td>

                      {/* Tipo */}
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {TIPO_LABEL[promo.tipo] || promo.tipo}
                        <br/>
                        <span className="text-gray-400 capitalize">{promo.aplica_a}</span>
                      </td>

                      {/* Valor */}
                      <td className="px-4 py-3">
                        {promo.tipo === 'porcentaje' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md font-bold text-sm">
                            -{promo.valor}%
                          </span>
                        )}
                        {promo.tipo === 'monto_fijo' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md font-bold text-sm">
                            -S/{Number(promo.valor).toFixed(2)}
                          </span>
                        )}
                        {(promo.tipo === 'envio_gratis' || promo.tipo === 'producto_gratis') && (
                          <span className="text-gray-500 text-xs">—</span>
                        )}
                        {Number(promo.monto_minimo) > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">mín. S/{Number(promo.monto_minimo).toFixed(2)}</p>
                        )}
                      </td>

                      {/* Vigencia */}
                      <td className="px-4 py-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 shrink-0 text-gray-300" />
                          <span>{formatFecha(promo.fecha_inicio)}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 shrink-0 text-gray-300" />
                          <span>{formatFecha(promo.fecha_fin)}</span>
                        </div>
                        {dias !== null && dias >= 0 && (
                          <p className={`text-xs font-semibold mt-1 ${dias <= 3 ? 'text-red-500' : 'text-emerald-600'}`}>
                            {dias === 0 ? 'Vence hoy' : `Vence en ${dias}d`}
                          </p>
                        )}
                        {promo._estadoReal === 'expirada' && (
                          <p className="text-xs font-semibold text-red-500 mt-1">Expirada</p>
                        )}
                      </td>

                      {/* Usos */}
                      <td className="px-4 py-3 text-xs text-gray-500">
                        <span className="font-semibold text-gray-800">{promo.usos_totales || 0}</span>
                        {promo.limite_usos_totales ? (
                          <span className="text-gray-400"> / {promo.limite_usos_totales}</span>
                        ) : (
                          <span className="text-gray-400"> / ∞</span>
                        )}
                        <br />
                        <span className="text-gray-400">máx {promo.cantidad_maxima_uso}/usuario</span>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${badge.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditingPromo(promo); setFormOpen(true); }}
                            title="Editar"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-700 hover:bg-purple-50 transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteInfo({ id: promo.id_promocion, nombre: promo.nombre })}
                            title="Eliminar"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modales */}
      <PromotionFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        initialData={editingPromo}
        api={api}
      />

      {deleteInfo && (
        <ConfirmModal
          isOpen={Boolean(deleteInfo)}
          title="¿Eliminar promoción?"
          message={`¿Estás seguro de eliminar la promoción "${deleteInfo.nombre}"? Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setDeleteInfo(null)}
          loading={deleting}
        />
      )}
    </section>
  );
}
