import type { TextareaHTMLAttributes } from 'react';
import { FormField } from './FormField';

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextareaField = ({ className = '', error, hint, id, label, ...props }: TextareaFieldProps) => {
  return (
    <FormField error={error} hint={hint} htmlFor={id} label={label}>
      <textarea
        className={[
          'min-h-32 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors',
          error ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500',
          className,
        ].join(' ')}
        id={id}
        {...props}
      />
    </FormField>
  );
};
