import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError   = toast.type === 'error';

  return (
    <div className={`fixed bottom-5 right-5 z-50 animate-toast-in flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-lg border min-w-[300px] max-w-sm text-sm font-medium ${
      isSuccess
        ? 'bg-white border-emerald-200 text-gray-800'
        : isError
        ? 'bg-white border-red-200 text-gray-800'
        : 'bg-white border-amber-200 text-gray-800'
    }`}>
      <div className="shrink-0 mt-0.5">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        {isError   && <XCircle     className="w-5 h-5 text-red-500" />}
        {!isSuccess && !isError && <AlertTriangle className="w-5 h-5 text-amber-500" />}
      </div>
      <p className="flex-1 leading-snug text-gray-700">{toast.message}</p>
      <button
        onClick={onClose}
        className="shrink-0 p-0.5 text-gray-400 hover:text-gray-600 rounded transition-colors mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
