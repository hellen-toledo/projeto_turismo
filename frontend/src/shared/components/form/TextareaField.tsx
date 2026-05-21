import type { TextareaHTMLAttributes } from 'react';
import { FormField } from './FormField';

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  requiredMark?: boolean;
}

export const TextareaField = ({ className = '', error, hint, id, label, requiredMark = false, ...props }: TextareaFieldProps) => {
  return (
    <FormField error={error} hint={hint} htmlFor={id} label={label} required={requiredMark}>
      <textarea
        className={[
          'min-h-32 w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors',
          error ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500',
          className,
        ].join(' ')}
        id={id}
        {...props}
      />
    </FormField>
  );
};
