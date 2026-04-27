import { ImageIcon, Link as LinkIcon, LoaderCircle, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { uploadAdminMedia } from '../../../features/admin/api/adminMediaApi';
import type { MediaAsset } from '../../types/api';
import { getApiErrorMessage } from '../../lib/api/getApiErrorMessage';
import { FormField } from './FormField';

interface ImageUploadFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  altText?: string;
  onAltTextChange?: (value: string) => void;
  error?: string;
  hint?: string;
  uploadCollection?: 'cover' | 'gallery' | 'general';
  onUploadComplete?: (media: MediaAsset) => void;
  allowManualUrl?: boolean;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const ImageUploadField = ({
  altText,
  error,
  hint,
  id,
  label,
  onAltTextChange,
  onChange,
  onUploadComplete,
  uploadCollection = 'cover',
  value,
  allowManualUrl = true,
}: ImageUploadFieldProps) => {
  const [internalAltText, setInternalAltText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resolvedAltText = altText ?? internalAltText;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const statusId = `${id}-status`;
  const describedBy = [hintId, errorId, statusMessage ? statusId : null].filter(Boolean).join(' ') || undefined;

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const setAltTextValue = (nextValue: string) => {
    if (onAltTextChange) {
      onAltTextChange(nextValue);
      return;
    }

    setInternalAltText(nextValue);
  };

  const resetTransientState = () => {
    setSelectedFile(null);
    setStatus('idle');
    setStatusMessage('');

    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (nextValue: string) => {
    resetTransientState();
    onChange(nextValue);
  };

  const handleFileSelection = (file: File | null) => {
    if (!file) {
      return;
    }

    setSelectedFile(file);
    setStatus('idle');
    setStatusMessage('');

    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    if (typeof URL.createObjectURL === 'function') {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setStatus('uploading');
    setStatusMessage('Enviando imagem...');

    try {
      const media = await uploadAdminMedia(selectedFile, {
        altText: resolvedAltText,
        collection: uploadCollection,
      });

      onChange(media.url);
      onUploadComplete?.(media);
      setStatus('success');
      setStatusMessage('Upload concluído com sucesso.');
    } catch (uploadError) {
      setStatus('error');
      setStatusMessage(getApiErrorMessage(uploadError, 'Falha ao enviar a imagem.'));
    }
  };

  const handleClear = () => {
    resetTransientState();
    setAltTextValue('');
    onChange('');
  };

  const currentPreview = previewUrl || value;

  return (
    <FormField htmlFor={id} label={label}>
      <div className="grid gap-4 rounded-3xl border border-dashed border-slate-300 bg-white p-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="relative">
            <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              aria-disabled={!allowManualUrl}
              aria-describedby={describedBy}
              className={[
                'w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-colors',
                error ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500',
                !allowManualUrl ? 'cursor-not-allowed bg-slate-100 text-slate-400' : '',
              ].join(' ')}
              disabled={!allowManualUrl}
              id={id}
              onChange={(event) => {
                handleUrlChange(event.target.value);
              }}
              placeholder="https://exemplo.com/imagem.jpg"
              type="url"
              value={value}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              aria-describedby={describedBy}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500"
              id={`${id}-alt-text`}
              onChange={(event) => {
                setAltTextValue(event.target.value);
              }}
              placeholder="Texto alternativo da imagem"
              type="text"
              value={resolvedAltText}
            />
            <div className="flex flex-wrap gap-2">
              <input
                accept="image/jpeg,image/png,image/webp"
                aria-label={`${label}: selecionar arquivo`}
                className="sr-only"
                id={`${id}-file`}
                onChange={(event) => {
                  handleFileSelection(event.target.files?.[0] ?? null);
                }}
                ref={fileInputRef}
                type="file"
              />
              <button
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                type="button"
              >
                <Upload className="h-4 w-4" />
                Escolher arquivo
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                disabled={!selectedFile || status === 'uploading'}
                onClick={() => {
                  void handleUpload();
                }}
                type="button"
              >
                {status === 'uploading' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Enviar imagem
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                onClick={handleClear}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Limpar
              </button>
            </div>
          </div>

          {selectedFile ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">{selectedFile.name}</p>
              <p className="mt-1">{formatFileSize(selectedFile.size)}</p>
            </div>
          ) : null}

          {hint ? (
            <p className="text-xs text-slate-500" id={hintId}>
              {hint}
            </p>
          ) : null}

          {statusMessage ? (
            <p
              aria-live="polite"
              className={[
                'text-sm font-medium',
                status === 'error' ? 'text-rose-600' : status === 'success' ? 'text-emerald-700' : 'text-slate-600',
              ].join(' ')}
              id={statusId}
              role={status === 'error' ? 'alert' : 'status'}
            >
              {statusMessage}
            </p>
          ) : null}

          {error ? (
            <p className="text-sm font-medium text-rose-600" id={errorId}>
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
          {currentPreview ? (
            <img alt="Pré-visualização" className="h-full w-full object-cover" src={currentPreview} />
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
