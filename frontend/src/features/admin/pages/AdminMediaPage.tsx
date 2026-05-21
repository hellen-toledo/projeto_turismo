import { ChevronDown, ImagePlus, LoaderCircle, Plus, Trash2, Upload } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { useToast } from '../../../shared/components/toast/toastContext';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import type { MediaAsset } from '../../../shared/types/api';
import { AdminConfirmDialog, AdminPage, AdminSurface, AdminSideSheet } from '../components/AdminUi';
import { adminButtonClassName, adminInputClassName } from '../components/adminUiStyles';
import { useAdminMedia, useAdminMediaMutations } from '../hooks/useAdminMedia';
import type { AdminFeedback } from '../types/admin';

const acceptedFileTypes = 'image/jpeg,image/png,image/webp';

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

type MediaCollectionFilter = MediaAsset['collection'] | 'all';
type MediaCollection = NonNullable<MediaAsset['collection']>;

const collectionLabels: Record<MediaCollection, string> = {
  cover: 'Capa',
  gallery: 'Galeria',
  general: 'Geral',
};

export const AdminMediaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCollection = (searchParams.get('collection') as MediaCollectionFilter | null) ?? 'all';
  const filters = {
    page: Number(searchParams.get('page') || '1'),
    perPage: 12,
    collection: activeCollection === 'all' ? undefined : activeCollection,
  };
  const { data: mediaResponse, isLoading, isError } = useAdminMedia(filters);
  const { uploadMedia, deleteMedia, uploading, deleting } = useAdminMediaMutations();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [collection, setCollection] = useState<MediaAsset['collection']>('general');
  const [altText, setAltText] = useState('');
  const [pendingDeleteMediaId, setPendingDeleteMediaId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaItems = mediaResponse?.data ?? [];
  const { showToast } = useToast();

  useEffect(() => () => {
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const selectedFileMetadata = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return `${selectedFile.name} • ${formatFileSize(selectedFile.size)}`;
  }, [selectedFile]);

  if (isLoading) {
    return <LoadingState label="Carregando mídia..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar as imagens"
        description="Tente novamente em instantes ou verifique seu acesso ao painel."
      />
    );
  }

  const resetUploadState = () => {
    setSelectedFile(null);
    setAltText('');

    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      await uploadMedia({
        file: selectedFile,
        altText,
        collection,
      });

      setFeedback({
        type: 'success',
        message: 'Mídia enviada com sucesso.',
      });
      showToast({
        type: 'success',
        title: 'Mídia enviada com sucesso.',
      });
      resetUploadState();
      setIsFormOpen(false);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Falha ao enviar a mídia.');
      setFeedback({
        type: 'error',
        message,
      });
      showToast({
        type: 'error',
        title: 'Não foi possível enviar',
        message,
      });
    }
  };

  const handleDelete = async (mediaId: number) => {
    try {
      await deleteMedia(mediaId);
      setFeedback({
        type: 'success',
        message: 'Mídia removida com sucesso.',
      });
      showToast({
        type: 'success',
        title: 'Mídia removida com sucesso.',
      });
      setPendingDeleteMediaId(null);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Falha ao remover a mídia.');
      setFeedback({
        type: 'error',
        message,
      });
      showToast({
        type: 'error',
        title: 'Não foi possível remover',
        message,
      });
    }
  };

  return (
    <AdminPage
      actions={
        <button
          className={adminButtonClassName.primaryAction}
          onClick={() => {
            resetUploadState();
            setFeedback(null);
            setIsFormOpen(true);
          }}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Enviar mídia
        </button>
      }
      description="Envie e organize imagens usadas em capas e galerias."
      eyebrow="Mídia"
      title="Biblioteca de mídia"
    >
      <AdminSurface description="Filtre por coleção e reutilize arquivos já enviados sem sair da tela." meta={`${mediaResponse?.meta.total ?? 0} itens`} title="Arquivos enviados">
        <form
          className="grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const next = new URLSearchParams(searchParams);
            const nextCollection = String(formData.get('collection') || 'all');

            if (nextCollection === 'all') {
              next.delete('collection');
            } else {
              next.set('collection', nextCollection);
            }

            next.set('page', '1');
            setSearchParams(next);
          }}
        >
          <span className="relative block w-full">
            <select
              className={`${adminInputClassName} appearance-none pr-10`}
              defaultValue={activeCollection}
              name="collection"
            >
              <option value="all">Todas as coleções</option>
              <option value="general">Geral</option>
              <option value="cover">Capa</option>
              <option value="gallery">Galeria</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </span>
          <button className={adminButtonClassName.primary} type="submit">
            Aplicar
          </button>
        </form>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mediaItems.length ? (
            mediaItems.map((media) => (
              <article key={media.id} className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-colors hover:border-slate-300">
                <img alt={media.altText ?? media.originalName ?? `Mídia ${media.id}`} className="h-48 w-full border-b border-slate-100 object-cover" src={media.url} />
                <div className="flex flex-1 flex-col space-y-3 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900" title={media.originalName}>{media.originalName ?? `Arquivo #${media.id}`}</h3>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">{collectionLabels[media.collection ?? 'general']}</p>
                  </div>

                  <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500" title={media.altText || 'Sem texto alternativo'}>
                    {media.altText || 'Sem texto alternativo informado.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
                    <span className="shrink-0 text-xs font-medium text-slate-500">
                      {formatFileSize(media.size)}
                    </span>
                    <div className="ml-auto flex shrink-0 gap-2">
                      <a
                        className={adminButtonClassName.ghost}
                        href={media.url}
                        rel="noreferrer"
                        target="_blank"
                        title="Visualizar imagem"
                      >
                        <ImagePlus className="h-4 w-4" />
                      </a>
                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                        disabled={deleting}
                        onClick={() => {
                          setPendingDeleteMediaId(media.id);
                        }}
                        type="button"
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="md:col-span-full">
              <EmptyState
                title="Nenhuma mídia cadastrada"
                description="Envie imagens nesta tela para reutilizar em capas e galerias do painel."
              />
            </div>
          )}
        </div>

        <div className="mt-8">
          <PaginationControls
            currentPage={mediaResponse?.meta.currentPage ?? 1}
            lastPage={mediaResponse?.meta.lastPage ?? 1}
            onPageChange={(page) => {
              const next = new URLSearchParams(searchParams);
              next.set('page', String(page));
              setSearchParams(next);
            }}
          />
        </div>
      </AdminSurface>

      <AdminSideSheet
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Upload de mídia"
        description="Envie imagens reutilizáveis para capas e galerias de cidades e eventos."
      >
        <FormAlert feedback={feedback} />

        <div className="mt-6 space-y-6">
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <input
              accept={acceptedFileTypes}
              className="sr-only"
              id="admin-media-file"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;

                setSelectedFile(file);
                setFeedback(null);

                if (previewUrl?.startsWith('blob:')) {
                  URL.revokeObjectURL(previewUrl);
                }

                setPreviewUrl(file ? URL.createObjectURL(file) : null);
              }}
              ref={fileInputRef}
              type="file"
            />

            {!previewUrl ? (
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                  <Upload className="h-6 w-6" />
                </div>
                <button
                  className={adminButtonClassName.secondary}
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  type="button"
                >
                  Selecionar imagem
                </button>
                <p className="mt-3 text-xs text-slate-500">
                  Permitido: JPG, PNG, WEBP (até 15 MB)
                </p>
              </div>
            ) : null}

            {selectedFileMetadata ? (
              <div className="mt-4 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                {selectedFileMetadata}
              </div>
            ) : null}

            {previewUrl ? (
              <div className="mt-4 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                <img alt="Pré-visualização da mídia selecionada" className="h-48 w-full object-cover" src={previewUrl} />
                <div className="border-t border-slate-200 p-2">
                  <button
                    className="w-full py-1 text-xs font-semibold text-rose-600 hover:text-rose-800"
                    onClick={resetUploadState}
                    type="button"
                  >
                    Remover seleção
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <label className="block space-y-2 text-sm font-semibold text-slate-700">
              <span>Coleção</span>
              <select
                className={adminInputClassName}
                onChange={(event) => {
                  setCollection(event.target.value as MediaAsset['collection']);
                }}
                value={collection ?? 'general'}
              >
                <option value="general">Geral</option>
                <option value="cover">Capa</option>
                <option value="gallery">Galeria</option>
              </select>
            </label>

            <label className="block space-y-2 text-sm font-semibold text-slate-700">
              <span>Texto alternativo</span>
              <input
                className={adminInputClassName}
                onChange={(event) => {
                  setAltText(event.target.value);
                }}
                placeholder="Descreva a imagem"
                type="text"
                value={altText}
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
            <button
              className={adminButtonClassName.primary}
              disabled={!selectedFile || uploading}
              onClick={() => {
                void handleUpload();
              }}
              type="button"
            >
              {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Confirmar e Enviar
            </button>

            <button
              className={adminButtonClassName.ghost}
              onClick={() => setIsFormOpen(false)}
              type="button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </AdminSideSheet>

      <AdminConfirmDialog
        confirmLabel="Remover"
        description="Esta ação não pode ser desfeita e removerá a mídia da biblioteca administrativa."
        isConfirming={deleting}
        isOpen={pendingDeleteMediaId !== null}
        onClose={() => setPendingDeleteMediaId(null)}
        onConfirm={() => {
          if (pendingDeleteMediaId !== null) {
            void handleDelete(pendingDeleteMediaId);
          }
        }}
        title="Remover mídia?"
      />
    </AdminPage>
  );
};
