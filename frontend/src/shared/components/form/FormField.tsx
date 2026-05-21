import type { PropsWithChildren, ReactNode } from 'react';

interface FormFieldProps extends PropsWithChildren {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  action?: ReactNode;
  required?: boolean;
}

export const FormField = ({ action, children, error, hint, htmlFor, label, required = false }: FormFieldProps) => {
  return (
    <div className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
        <span>
          <label htmlFor={htmlFor}>{label}</label>
          {required ? <span aria-hidden="true" className="ml-1 text-rose-600">*</span> : null}
        </span>
        {action}
      </span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-slate-500">{hint}</span> : null}
      {error ? <span className="mt-2 block text-sm font-medium text-rose-600">{error}</span> : null}
    </div>
  );
};
