import { ImagePlus, LoaderCircle, Plus, Trash2, Upload } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import type { MediaAsset } from '../../../shared/types/api';
import { AdminPage, AdminSurface, AdminSideSheet } from '../components/AdminUi';
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
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaItems = mediaResponse?.data ?? [];

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
    return <LoadingState label="Carregando biblioteca administrativa de mídia..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar a mídia administrativa"
        description="Verifique a autenticação do painel e a disponibilidade do endpoint de mídia."
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
      resetUploadState();
      setIsFormOpen(false);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Falha ao enviar a mídia.'),
      });
    }
  };

  const handleDelete = async (mediaId: number) => {
    const confirmed = window.confirm('Tem certeza que deseja remover esta mídia? Esta ação não pode ser desfeita.');

    if (!confirmed) {
      return;
    }

    try {
      await deleteMedia(mediaId);
      setFeedback({
        type: 'success',
        message: 'Mídia removida com sucesso.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Falha ao remover a mídia.'),
      });
    }
  };

  return (
    <AdminPage
      actions={
        <button
          className={adminButtonClassName.primary}
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
      description="Envio e organização do acervo visual em uma interface mais enxuta, com preview, metadados e filtro por coleção."
      eyebrow="Mídia"
      title="Biblioteca administrativa mais clara para operar"
    >
      <AdminSurface description="Filtre por coleção e reutilize arquivos já enviados sem sair da tela." meta={`${mediaResponse?.meta.total ?? 0} itens`} title="Arquivos enviados">
        <form
          className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 md:grid-cols-[1fr_auto]"
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
          <select
            className={adminInputClassName}
            defaultValue={activeCollection}
            name="collection"
          >
            <option value="all">Todas as coleções</option>
            <option value="general">Geral</option>
            <option value="cover">Cover</option>
            <option value="gallery">Gallery</option>
          </select>
          <button className={adminButtonClassName.primary} type="submit">
            Aplicar
          </button>
        </form>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mediaItems.length ? (
            mediaItems.map((media) => (
              <article key={media.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors hover:border-slate-300 shadow-sm flex flex-col">
                <img alt={media.altText ?? media.originalName ?? `Mídia ${media.id}`} className="h-48 w-full object-cover border-b border-slate-100" src={media.url} />
                <div className="flex-1 space-y-3 p-4 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 truncate" title={media.originalName}>{media.originalName ?? `Arquivo #${media.id}`}</h3>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">{media.collection ?? 'general'}</p>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-500 line-clamp-2 flex-1" title={media.altText || 'Sem texto alternativo'}>
                    {media.altText || 'Sem texto alternativo informado.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-500">
                      {formatFileSize(media.size)}
                    </span>
                    <div className="flex gap-2">
                      <a
                        className={adminButtonClassName.ghost}
                        href={media.url}
                        rel="noreferrer"
                        target="_blank"
                        title="Ver preview"
                      >
                        <ImagePlus className="h-4 w-4" />
                      </a>
                      <button
                        className="rounded-md px-2 py-1 text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                        disabled={deleting}
                        onClick={() => {
                          void handleDelete(media.id);
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
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 flex flex-col items-center justify-center text-center">
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
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
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
                  Permitido: JPG, PNG, WEBP (até 5 MB)
                </p>
              </div>
            ) : null}

            {selectedFileMetadata ? (
              <div className="mt-4 w-full rounded-md bg-white px-4 py-3 text-sm text-slate-700 shadow-sm border border-slate-200">
                {selectedFileMetadata}
              </div>
            ) : null}

            {previewUrl ? (
              <div className="mt-4 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                <img alt="Pré-visualização da mídia selecionada" className="h-48 w-full object-cover" src={previewUrl} />
                <div className="p-2 border-t border-slate-200">
                   <button
                    className="w-full text-xs font-semibold text-rose-600 hover:text-rose-800 py-1"
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
            <label className="space-y-2 block text-sm font-semibold text-slate-700">
              <span>Coleção</span>
              <select
                className={adminInputClassName}
                onChange={(event) => {
                  setCollection(event.target.value as MediaAsset['collection']);
                }}
                value={collection ?? 'general'}
              >
                <option value="general">Geral</option>
                <option value="cover">Cover</option>
                <option value="gallery">Gallery</option>
              </select>
            </label>

            <label className="space-y-2 block text-sm font-semibold text-slate-700">
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

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
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
    </AdminPage>
  );
};

