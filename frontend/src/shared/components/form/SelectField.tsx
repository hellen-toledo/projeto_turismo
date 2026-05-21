import type { SelectHTMLAttributes } from 'react';
import type { AdminOption } from '../../../features/admin/types/admin';
import { FormField } from './FormField';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: AdminOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  requiredMark?: boolean;
}

export const SelectField = ({
  error,
  hint,
  id,
  label,
  options,
  placeholder = 'Selecione uma opção',
  requiredMark = false,
  ...props
}: SelectFieldProps) => {
  return (
    <FormField error={error} hint={hint} htmlFor={id} label={label} required={requiredMark}>
      <select
        className={[
          'h-10 w-full rounded-md border bg-white px-3 text-sm text-slate-900 outline-none transition-colors',
          error ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500',
        ].join(' ')}
        id={id}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};
