import { ImageIcon, Link as LinkIcon } from 'lucide-react';
import { FormField } from './FormField';

interface ImageUploadFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
}

export const ImageUploadField = ({ error, hint, id, label, onChange, value }: ImageUploadFieldProps) => {
  return (
    <FormField error={error} hint={hint} htmlFor={id} label={label}>
      <div className="grid gap-4 rounded-3xl border border-dashed border-slate-300 bg-white p-4 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="relative">
            <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className={[
                'w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-colors',
                error ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500',
              ].join(' ')}
              id={id}
              onChange={(event) => {
                onChange(event.target.value);
              }}
              placeholder="https://exemplo.com/imagem.jpg"
              type="url"
              value={value}
            />
          </div>
          <p className="mt-3 text-xs text-slate-500">Base pronta para upload futuro. Hoje o painel aceita URL pública e já exibe preview.</p>
        </div>

        <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
          {value ? (
            <img alt="Pré-visualização" className="h-full w-full object-cover" src={value} />
          ) : (
            <div className="flex flex-col items-center gap-2 text-sm text-slate-500">
              <ImageIcon className="h-6 w-6" />
              Sem imagem
            </div>
          )}
        </div>
      </div>
    </FormField>
  );
};
