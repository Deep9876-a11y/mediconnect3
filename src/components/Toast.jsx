import React from 'react';
import { Icons } from './Icons.jsx';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      icon: <Icons.CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
    },
    info: {
      bg: 'bg-sky-50 border-sky-300 text-sky-900',
      icon: <Icons.Info className="w-5 h-5 text-sky-600 flex-shrink-0" />
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      icon: <Icons.AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
    }
  };

  const config = typeConfig[toast.type || 'success'];

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border shadow-xl ${config.bg} max-w-md`}>
        {config.icon}
        <div className="text-xs">
          <p className="font-bold">{toast.title || 'Notification'}</p>
          <p className="text-slate-600 text-[11px] mt-0.5">{toast.message}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-black/5 rounded text-slate-400 hover:text-slate-700">
          <Icons.X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
