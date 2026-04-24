import type { AdminOption } from '../../../features/admin/types/admin';
import { FormField } from './FormField';

interface TagMultiSelectProps {
  label: string;
  options: AdminOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: string;
  hint?: string;
}

export const TagMultiSelect = ({ error, hint, label, onChange, options, selectedValues }: TagMultiSelectProps) => {
  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }

    onChange([...selectedValues, value]);
  };

  return (
    <FormField error={error} hint={hint} label={label}>
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        {options.map((option) => {
          const selected = selectedValues.includes(option.value);

          return (
            <button
              key={option.value}
              className={[
                'rounded-full border px-3 py-2 text-sm font-semibold transition-colors',
                selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-700',
              ].join(' ')}
              onClick={() => {
                toggleValue(option.value);
              }}
              type="button"
            >
              {option.label}
            </button>
          );
        })}

        {!options.length ? <span className="text-sm text-slate-500">Nenhuma tag disponível.</span> : null}
      </div>
    </FormField>
  );
};
