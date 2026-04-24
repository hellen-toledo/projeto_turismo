import type { InputHTMLAttributes } from 'react';
import { FormField } from './FormField';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextInput = ({ className = '', error, hint, id, label, ...props }: TextInputProps) => {
  return (
    <FormField error={error} hint={hint} htmlFor={id} label={label}>
      <input
        className={[
          'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors',
          error ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500',
          className,
        ].join(' ')}
        id={id}
        {...props}
      />
    </FormField>
  );
};
