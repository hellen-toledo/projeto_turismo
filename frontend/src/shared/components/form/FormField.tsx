import type { PropsWithChildren, ReactNode } from 'react';

interface FormFieldProps extends PropsWithChildren {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  action?: ReactNode;
}

export const FormField = ({ action, children, error, hint, htmlFor, label }: FormFieldProps) => {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
        <span>{label}</span>
        {action}
      </span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-slate-500">{hint}</span> : null}
      {error ? <span className="mt-2 block text-sm font-medium text-rose-600">{error}</span> : null}
    </label>
  );
};
