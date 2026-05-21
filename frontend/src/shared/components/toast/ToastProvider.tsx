import { CheckCircle2, CircleAlert, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { ToastContext } from './toastContext';
import type { ToastInput, ToastType } from './toastContext';

interface ToastItem extends ToastInput {
  id: number;
}

const toastStyles: Record<ToastType, { icon: ReactNode; accent: string; title: string }> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    accent: 'text-emerald-600',
    title: 'text-slate-950',
  },
  error: {
    icon: <CircleAlert className="h-5 w-5" />,
    accent: 'text-rose-600',
    title: 'text-slate-950',
  },
};

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((toastId: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId));
  }, []);

  const showToast = useCallback((toast: ToastInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current.slice(-3), { ...toast, id }]);
    window.setTimeout(() => dismissToast(id), toast.type === 'error' ? 7000 : 4500);
  }, [dismissToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[90] flex w-[min(100%-2rem,24rem)] flex-col gap-3">
        {toasts.map((toast) => {
          const styles = toastStyles[toast.type];

          return (
            <div
              className="pointer-events-auto rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-2xl shadow-slate-950/15"
              key={toast.id}
              role="status"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${styles.accent}`}>{styles.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold ${styles.title}`}>{toast.title}</p>
                  {toast.message ? <div className="mt-1 leading-5 text-slate-600">{toast.message}</div> : null}
                </div>
                <button
                  aria-label="Fechar aviso"
                  className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  onClick={() => dismissToast(toast.id)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
