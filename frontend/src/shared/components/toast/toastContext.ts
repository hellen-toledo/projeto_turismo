import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export type ToastType = 'success' | 'error';

export interface ToastInput {
  type: ToastType;
  title: string;
  message?: ReactNode;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
}

export const ToastContext = createContext<ToastContextValue>({
  showToast: () => undefined,
});

export const useToast = () => useContext(ToastContext);
