import type { InputHTMLAttributes } from 'react';

interface ToggleFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description: string;
}

export const ToggleField = ({ checked, description, id, label, ...props }: ToggleFieldProps) => {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <input checked={checked} className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600" id={id} type="checkbox" {...props} />
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        <span className="mt-1 block text-sm text-slate-500">{description}</span>
      </span>
    </label>
  );
};
