import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all animate-bounce-short text-sm font-medium bg-slate-800/95 border-slate-700 text-slate-100 min-w-[300px] max-w-md">
      {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
      {isError && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
      {!isSuccess && !isError && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}

      <span className="flex-1 text-slate-200 leading-snug">{toast.message}</span>

      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
