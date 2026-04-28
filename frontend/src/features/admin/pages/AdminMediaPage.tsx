import { ImagePlus, LoaderCircle, Trash2, Upload } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import type { MediaAsset } from '../../../shared/types/api';
import { AdminPage, AdminSurface } from '../components/AdminUi';
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
      description="Envio e organização do acervo visual em uma interface mais enxuta, com preview, metadados e filtro por coleção."
      eyebrow="Mídia"
      title="Biblioteca administrativa mais clara para operar"
    >
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <AdminSurface description="Envie imagens reutilizáveis para capas e galerias de cidades e eventos." meta={selectedFile ? 'Arquivo selecionado' : 'Aguardando envio'} title="Upload de mídia">
          <FormAlert feedback={feedback} />

          <div className="mt-6 space-y-5">
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
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

            <button
              className={adminButtonClassName.secondary}
              onClick={() => {
                fileInputRef.current?.click();
              }}
              type="button"
            >
              <ImagePlus className="h-4 w-4" />
              Selecionar imagem
            </button>

            <p className="mt-3 text-xs text-slate-500">
              Arquivos permitidos: JPG, JPEG, PNG e WEBP com até 5 MB.
            </p>

            {selectedFileMetadata ? (
              <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                {selectedFileMetadata}
              </div>
            ) : null}

            {previewUrl ? (
              <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <img alt="Pré-visualização da mídia selecionada" className="h-64 w-full object-cover" src={previewUrl} />
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-slate-700">
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

            <label className="space-y-2 text-sm font-semibold text-slate-700">
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

          <div className="flex flex-wrap gap-3">
            <button
              className={adminButtonClassName.primary}
              disabled={!selectedFile || uploading}
              onClick={() => {
                void handleUpload();
              }}
              type="button"
            >
              {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Enviar mídia
            </button>

            <button
              className={adminButtonClassName.secondary}
              onClick={resetUploadState}
              type="button"
            >
              Limpar
            </button>
          </div>
          </div>
        </AdminSurface>

        <AdminSurface description="Filtre por coleção e reutilize arquivos já enviados sem sair da tela." meta={`${mediaResponse?.meta.total ?? 0} itens`} title="Arquivos enviados">
          <form
            className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 md:grid-cols-[1fr_auto]"
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

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {mediaItems.length ? (
              mediaItems.map((media) => (
                <article key={media.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/80 transition-colors hover:border-slate-300">
                  <img alt={media.altText ?? media.originalName ?? `Mídia ${media.id}`} className="h-52 w-full object-cover" src={media.url} />
                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-black text-slate-900">{media.originalName ?? `Arquivo #${media.id}`}</h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-teal-700">{media.collection ?? 'general'}</p>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                        {formatFileSize(media.size)}
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-slate-500">
                      {media.altText || 'Sem texto alternativo informado.'}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <a
                        className={adminButtonClassName.secondary}
                        href={media.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Ver preview
                      </a>
                      <button
                        className={adminButtonClassName.danger}
                        disabled={deleting}
                        onClick={() => {
                          void handleDelete(media.id);
                        }}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remover
                      </button>
                    </div>
                  </div>
                </article>
              ))
          ) : (
            <div className="md:col-span-2">
              <EmptyState
                title="Nenhuma mídia cadastrada"
                description="Envie imagens nesta tela para reutilizar em capas e galerias do painel."
              />
            </div>
          )}
          </div>

          <PaginationControls
            currentPage={mediaResponse?.meta.currentPage ?? 1}
            lastPage={mediaResponse?.meta.lastPage ?? 1}
            onPageChange={(page) => {
              const next = new URLSearchParams(searchParams);
              next.set('page', String(page));
              setSearchParams(next);
            }}
          />
        </AdminSurface>
      </div>
    </AdminPage>
  );
};
