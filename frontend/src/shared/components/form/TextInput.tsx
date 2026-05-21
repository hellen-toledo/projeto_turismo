import type { InputHTMLAttributes } from 'react';
import { FormField } from './FormField';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  requiredMark?: boolean;
}

export const TextInput = ({ className = '', error, hint, id, label, requiredMark = false, ...props }: TextInputProps) => {
  return (
    <FormField error={error} hint={hint} htmlFor={id} label={label} required={requiredMark}>
      <input
        className={[
          'h-10 w-full rounded-md border bg-white px-3 text-sm text-slate-900 outline-none transition-colors',
          error ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500',
          className,
        ].join(' ')}
        id={id}
        {...props}
      />
    </FormField>
  );
};
