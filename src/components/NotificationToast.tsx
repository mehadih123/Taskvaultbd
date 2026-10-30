import React from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface NotificationToastProps {
  message: string | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 p-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-start gap-3 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-1 rounded-xl bg-emerald-500 text-white shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="flex-1 text-xs sm:text-sm font-semibold leading-snug">
        {message}
      </div>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white dark:hover:text-slate-900 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
