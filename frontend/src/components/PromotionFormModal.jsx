import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Tag, Calendar, Percent, DollarSign, Truck, Gift, AlertCircle } from 'lucide-react';

const TIPOS = [
  { value: 'porcentaje', label: '% Porcentaje', icon: Percent },
  { value: 'monto_fijo', label: '$ Monto fijo', icon: DollarSign },
  { value: 'envio_gratis', label: '🚚 Envío gratis', icon: Truck },
  { value: 'producto_gratis', label: '🎁 Producto gratis', icon: Gift },
];

const APLICA_A = [
  { value: 'todos', label: 'Todos los productos' },
  { value: 'categorias', label: 'Categorías específicas' },
  { value: 'productos', label: 'Productos específicos' },
];

const today = () => new Date().toISOString().split('T')[0];

const emptyForm = {
  codigo: '',
  nombre: '',
  descripcion: '',
  tipo: 'porcentaje',
  valor: '',
  monto_minimo: '',
  cantidad_maxima_uso: 1,
  limite_usos_totales: '',
  fecha_inicio: today(),
  fecha_fin: '',
  aplica_a: 'todos',
  estado: 'activa',
};

export default function PromotionFormModal({ isOpen, onClose, onSubmit, initialData, api }) {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  // Bloquear scroll del body mientras la modal está abierta
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (isEdit && initialData) {
        setForm({
          codigo: initialData.codigo || '',
          nombre: initialData.nombre || '',
          descripcion: initialData.descripcion || '',
          tipo: initialData.tipo || 'porcentaje',
          valor: initialData.valor ?? '',
          monto_minimo: initialData.monto_minimo ?? '',
          cantidad_maxima_uso: initialData.cantidad_maxima_uso ?? 1,
          limite_usos_totales: initialData.limite_usos_totales ?? '',
          fecha_inicio: initialData.fecha_inicio ? initialData.fecha_inicio.split('T')[0] : today(),
          fecha_fin: initialData.fecha_fin ? initialData.fecha_fin.split('T')[0] : '',
          aplica_a: initialData.aplica_a || 'todos',
          estado: initialData.estado || 'activa',
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
      setServerError('');
    }
  }, [isOpen, initialData, isEdit]);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.codigo.trim()) e.codigo = 'El código es obligatorio';
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!form.tipo) e.tipo = 'Selecciona un tipo';
    if (showValorField) {
      if (form.valor === '' || isNaN(Number(form.valor))) e.valor = 'El valor es obligatorio';
      if (form.tipo === 'porcentaje' && (Number(form.valor) < 0 || Number(form.valor) > 100)) {
        e.valor = 'El porcentaje debe estar entre 0 y 100';
      }
    }
    if (!form.fecha_inicio) e.fecha_inicio = 'Fecha de inicio obligatoria';
    if (!form.fecha_fin) e.fecha_fin = 'Fecha de fin obligatoria';
    if (form.fecha_inicio && form.fecha_fin && form.fecha_fin <= form.fecha_inicio) {
      e.fecha_fin = 'La fecha de fin debe ser posterior a la de inicio';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setServerError('');
    try {
      await onSubmit({
        ...form,
        codigo: form.codigo.toUpperCase().trim(),
        valor: showValorField ? Number(form.valor) : 0,
        monto_minimo: form.monto_minimo !== '' ? Number(form.monto_minimo) : 0,
        cantidad_maxima_uso: Number(form.cantidad_maxima_uso) || 1,
        limite_usos_totales: form.limite_usos_totales !== '' ? Number(form.limite_usos_totales) : null,
      }, isEdit ? initialData.id_promocion : null);
      onClose();
    } catch (err) {
      setServerError(err.message || 'Error al guardar la promoción');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const showValorField = form.tipo === 'porcentaje' || form.tipo === 'monto_fijo';

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Tag className="w-4 h-4 text-purple-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 m-0">
                {isEdit ? 'Editar Promoción' : 'Nueva Promoción'}
              </h2>
              <p className="text-xs text-gray-400 m-0">
                {isEdit ? `Editando: ${initialData?.codigo}` : 'Completa los campos para crear la promoción'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {serverError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {serverError}
            </div>
          )}

          {/* Código + Nombre */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Código de cupón *</label>
              <input
                type="text"
                value={form.codigo}
                onChange={e => set('codigo', e.target.value.toUpperCase())}
                placeholder="VERANO20"
                maxLength={50}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition uppercase tracking-wider font-mono ${errors.codigo ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.codigo && <p className="text-xs text-red-500 mt-1">{errors.codigo}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
                placeholder="Promo de verano"
                maxLength={100}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition ${errors.nombre ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
              rows={2}
              placeholder="Descripción opcional de la promoción..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none"
            />
          </div>

          {/* Tipo + Valor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de descuento *</label>
              <select
                value={form.tipo}
                onChange={e => set('tipo', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition bg-white ${errors.tipo ? 'border-red-400' : 'border-gray-200'}`}
              >
                {TIPOS.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            {showValorField && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {form.tipo === 'porcentaje' ? 'Descuento (%) *' : 'Monto fijo (S/) *'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    {form.tipo === 'porcentaje' ? '%' : 'S/'}
                  </span>
                  <input
                    type="number"
                    value={form.valor}
                    onChange={e => set('valor', e.target.value)}
                    min={0}
                    max={form.tipo === 'porcentaje' ? 100 : undefined}
                    step="0.01"
                    placeholder={form.tipo === 'porcentaje' ? '20' : '50.00'}
                    className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition ${errors.valor ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                </div>
                {errors.valor && <p className="text-xs text-red-500 mt-1">{errors.valor}</p>}
              </div>
            )}
          </div>

          {/* Monto mínimo + Aplica a */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Monto mínimo de compra (S/)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">S/</span>
                <input
                  type="number"
                  value={form.monto_minimo}
                  onChange={e => set('monto_minimo', e.target.value)}
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Aplica a</label>
              <select
                value={form.aplica_a}
                onChange={e => set('aplica_a', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition bg-white"
              >
                {APLICA_A.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Límite de usos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Máx. usos totales
                <span className="ml-1 text-gray-400 font-normal">(vacío = sin límite)</span>
              </label>
              <input
                type="number"
                value={form.limite_usos_totales}
                onChange={e => set('limite_usos_totales', e.target.value)}
                min={1}
                step={1}
                placeholder="∞ Sin límite"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Máx. usos por usuario
              </label>
              <input
                type="number"
                value={form.cantidad_maxima_uso}
                onChange={e => set('cantidad_maxima_uso', e.target.value)}
                min={1}
                step={1}
                placeholder="1"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                <Calendar className="w-3 h-3 inline mr-1" />Fecha inicio *
              </label>
              <input
                type="date"
                value={form.fecha_inicio}
                onChange={e => set('fecha_inicio', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition ${errors.fecha_inicio ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.fecha_inicio && <p className="text-xs text-red-500 mt-1">{errors.fecha_inicio}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                <Calendar className="w-3 h-3 inline mr-1" />Fecha fin *
              </label>
              <input
                type="date"
                value={form.fecha_fin}
                onChange={e => set('fecha_fin', e.target.value)}
                min={form.fecha_inicio || today()}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition ${errors.fecha_fin ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.fecha_fin && <p className="text-xs text-red-500 mt-1">{errors.fecha_fin}</p>}
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Estado</label>
            <div className="flex gap-2">
              {['activa', 'inactiva'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('estado', s)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition capitalize ${form.estado === s
                      ? s === 'activa'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                        : 'bg-gray-100 border-gray-400 text-gray-700'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  {s === 'activa' ? '🟢 Activa' : '⚫ Inactiva'}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-60"
          >
            {saving ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
            ) : <Tag className="w-4 h-4" />}
            {isEdit ? 'Guardar cambios' : 'Crear promoción'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
