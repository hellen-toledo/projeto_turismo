import { ImagePlus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Event, MediaAsset } from '../../../shared/types/api';
import { FormActions } from '../../../shared/components/form/FormActions';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { ImageUploadField } from '../../../shared/components/form/ImageUploadField';
import { SelectField } from '../../../shared/components/form/SelectField';
import { TagMultiSelect } from '../../../shared/components/form/TagMultiSelect';
import { TextInput } from '../../../shared/components/form/TextInput';
import { TextareaField } from '../../../shared/components/form/TextareaField';
import { ToggleField } from '../../../shared/components/form/ToggleField';
import { useToast } from '../../../shared/components/toast/toastContext';
import { getApiErrorMessage, getApiValidationErrors } from '../../../shared/lib/api/getApiErrorMessage';
import { uploadAdminMedia } from '../api/adminMediaApi';
import { adminButtonClassName } from '../components/adminUiStyles';
import { useAdminEventMutations } from '../hooks/useAdminEvents';
import type { AdminFeedback, AdminOption, AdminValidationErrors, EventFormValues } from '../types/admin';
import { createEmptyEventForm, mapEventToFormValues, mapMediaAssetToGalleryFormValue } from '../types/admin';
import { useGalleryItems } from './useGalleryItems';
import { getValidationSummary } from './validationSummary';
import { validateEventForm } from './validators';

interface EventFormProps {
  event?: Event | null;
  isLoadingEvent?: boolean;
  cityOptions: AdminOption[];
  tagOptions: AdminOption[];
  onSuccess?: () => void;
}

const getNestedError = (errors: AdminValidationErrors, path: string) => errors[path];

export const EventForm = ({ cityOptions, event, isLoadingEvent = false, tagOptions, onSuccess }: EventFormProps) => {
  const createInitialValues = () => (event ? mapEventToFormValues(event) : createEmptyEventForm());
  const [values, setValues] = useState<EventFormValues>(createInitialValues);
  const [errors, setErrors] = useState<AdminValidationErrors>({});
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [pendingUploadCount, setPendingUploadCount] = useState(0);
  const { createEvent, updateEvent, creating, updating } = useAdminEventMutations();
  const { showToast } = useToast();

  const isUploadingImage = pendingUploadCount > 0;
  const isSubmitting = creating || updating || isUploadingImage;

  const setFieldValue = <Key extends keyof EventFormValues>(
    field: Key,
    value: EventFormValues[Key] | ((currentValue: EventFormValues[Key]) => EventFormValues[Key]),
  ) => {
    setValues((current) => ({
      ...current,
      [field]: typeof value === 'function'
        ? (value as (currentValue: EventFormValues[Key]) => EventFormValues[Key])(current[field])
        : value,
    }));
  };

  const handleUploadStateChange = (isUploading: boolean) => {
    setPendingUploadCount((current) => Math.max(0, current + (isUploading ? 1 : -1)));
  };

  const {
    addGalleryItem,
    markGalleryCover,
    removeGalleryItem,
    updateGalleryItem,
  } = useGalleryItems((gallery) => setFieldValue('gallery', gallery));

  const syncUploadedCoverWithGallery = (media: MediaAsset) => {
    setFieldValue('gallery', (currentGallery) => {
      const existingIndex = currentGallery.findIndex((item) => item.mediaAssetId === media.id);
      const nextGallery = currentGallery.map((item, index) => ({
        ...item,
        sortOrder: item.sortOrder ?? index,
        isCover: item.mediaAssetId === media.id,
      }));

      if (existingIndex === -1) {
        nextGallery.push({
          ...mapMediaAssetToGalleryFormValue(media, currentGallery.length),
          isCover: true,
        });
      }

      return nextGallery;
    });
  };

  const handleSubmit = async (submitEvent: React.FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    const nextErrors = validateEventForm(values);
    setErrors(nextErrors);

    if (isUploadingImage) {
      const message = 'Aguarde o envio da imagem antes de salvar o evento.';
      setFeedback({
        type: 'error',
        message,
      });
      showToast({
        type: 'error',
        title: 'Não foi possível salvar',
        message,
      });
      return;
    }

    if (Object.keys(nextErrors).length) {
      const message = getValidationSummary(nextErrors);
      setFeedback({
        type: 'error',
        message: 'Revise os campos destacados antes de salvar o evento.',
      });
      showToast({
        type: 'error',
        title: 'Campos obrigatórios pendentes',
        message,
      });
      return;
    }

    try {
      if (event) {
        await updateEvent({ eventId: event.id, values });
      } else {
        await createEvent(values);
      }

      const successMessage = event ? 'Edição realizada com sucesso.' : 'Criação de evento com sucesso.';
      setFeedback({
        type: 'success',
        message: successMessage,
      });
      showToast({
        type: 'success',
        title: successMessage,
      });
      setErrors({});

      if (!event) {
        setValues(createEmptyEventForm());
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const apiValidationErrors = getApiValidationErrors(error);
      if (Object.keys(apiValidationErrors).length > 0) {
        const message = getValidationSummary(apiValidationErrors);
        setErrors(apiValidationErrors);
        setFeedback({
          type: 'error',
          message: 'Revise os campos destacados.',
        });
        showToast({
          type: 'error',
          title: 'Campos obrigatórios pendentes',
          message,
        });
      } else {
        const message = getApiErrorMessage(error, 'Falha ao salvar o evento.');
        setFeedback({
          type: 'error',
          message,
        });
        showToast({
          type: 'error',
          title: 'Não foi possível salvar',
          message,
        });
      }
    }
  };

  if (isLoadingEvent) {
    return <div className="rounded-md border border-slate-200 bg-slate-50 px-5 py-8 text-sm text-slate-500">Carregando dados completos do evento...</div>;
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <FormAlert feedback={feedback} />

      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          error={errors.title}
          id="event-title"
          label="Título do evento"
          requiredMark
          onChange={(evt) => {
            setFieldValue('title', evt.target.value);
          }}
          placeholder="Ex.: Festival Gastronômico"
          value={values.title}
        />
        <TextInput
          error={errors.slug}
          hint="Opcional. Deixe vazio para gerar automaticamente."
          id="event-slug"
          label="Endereço amigável"
          onChange={(evt) => {
            setFieldValue('slug', evt.target.value);
          }}
          placeholder="festival-gastronomico"
          value={values.slug}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <SelectField
          error={errors.cityId}
          id="event-city"
          label="Cidade"
          requiredMark
          onChange={(evt) => {
            setFieldValue('cityId', evt.target.value);
          }}
          options={cityOptions}
          value={values.cityId}
        />
        <TextInput
          error={errors.externalUrl}
          hint="Link opcional para ingressos ou página oficial."
          id="event-external-url"
          label="Link externo"
          onChange={(evt) => {
            setFieldValue('externalUrl', evt.target.value);
          }}
          placeholder="https://..."
          type="url"
          value={values.externalUrl}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          className="admin-date-input"
          error={errors.startsAt}
          id="event-starts-at"
          label="Início"
          requiredMark
          onChange={(evt) => {
            setFieldValue('startsAt', evt.target.value);
          }}
          type="datetime-local"
          value={values.startsAt}
        />
        <TextInput
          className="admin-date-input"
          error={errors.endsAt}
          hint="Opcional. Use quando o evento tiver encerramento definido."
          id="event-ends-at"
          label="Fim"
          onChange={(evt) => {
            setFieldValue('endsAt', evt.target.value);
          }}
          type="datetime-local"
          value={values.endsAt}
        />
      </div>

      <TextareaField
        error={errors.description}
        id="event-description"
        label="Descrição"
        requiredMark
        onChange={(evt) => {
          setFieldValue('description', evt.target.value);
        }}
        placeholder="Descreva programação, público e contexto do evento."
        value={values.description}
      />

      <ImageUploadField
        error={errors.coverImage}
        hint="Informe um link ou envie uma imagem."
        id="event-cover-image"
        label="Imagem de capa"
        onChange={(value) => {
          setFieldValue('coverImage', value);
        }}
        onUpload={uploadAdminMedia}
        onUploadComplete={syncUploadedCoverWithGallery}
        onUploadStateChange={handleUploadStateChange}
        showAltText={false}
        uploadCollection="cover"
        value={values.coverImage}
      />

      <section className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-700">Galeria</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Imagens complementares</h2>
            <p className="mt-1 text-sm text-slate-500">Associe imagens, ajuste a ordem e marque a capa do evento.</p>
          </div>
          <button
            className="inline-flex h-10 items-center gap-2 self-start rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
            onClick={addGalleryItem}
            type="button"
          >
            <ImagePlus className="h-4 w-4" />
            Adicionar imagem
          </button>
        </div>

        {values.gallery.length ? (
          <div className="grid gap-4">
            {values.gallery.map((item, index) => (
              <article key={item.id} className="space-y-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Imagem {index + 1}</p>
                    <p className="text-xs text-slate-500">Controle a ordem e defina a capa editorial da galeria.</p>
                  </div>
                  <button
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 px-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                    onClick={() => {
                      removeGalleryItem(item.id);
                    }}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </button>
                </div>

                <ImageUploadField
                  allowManualUrl={false}
                  altText={item.altText}
                  error={getNestedError(errors, `gallery.${index}.mediaAssetId`)}
                  hint="Envie a imagem para usar na galeria."
                  id={`event-gallery-${item.id}`}
                  label="Arquivo da galeria"
                  onAltTextChange={(value) => {
                    updateGalleryItem(item.id, (current) => ({
                      ...current,
                      altText: value,
                    }));
                  }}
                  onChange={(value) => {
                    updateGalleryItem(item.id, (current) => ({
                      ...current,
                      url: value,
                    }));
                  }}
                  onUploadComplete={(media) => {
                    updateGalleryItem(item.id, (current) => ({
                      ...current,
                      mediaAssetId: media.id,
                      url: media.url,
                      altText: media.altText ?? current.altText,
                      originalName: media.originalName,
                      size: media.size,
                    }));
                  }}
                  onUpload={uploadAdminMedia}
                  onUploadStateChange={handleUploadStateChange}
                  uploadCollection="gallery"
                  value={item.url}
                />

                <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                  <TextInput
                    id={`event-gallery-order-${item.id}`}
                    label="Ordem"
                    min={0}
                    onChange={(evt) => {
                      updateGalleryItem(item.id, (current) => ({
                        ...current,
                        sortOrder: Number(evt.target.value || 0),
                      }));
                    }}
                    type="number"
                    value={String(item.sortOrder)}
                  />
                  <ToggleField
                    checked={item.isCover}
                    description="Quando marcada, esta mídia passa a ser a capa via galeria do evento."
                    id={`event-gallery-cover-${item.id}`}
                    label="Usar como capa"
                    onChange={() => {
                      markGalleryCover(item.id);
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500">
            Nenhuma imagem complementar adicionada.
          </div>
        )}
      </section>

      <TagMultiSelect
        hint="Selecione temas para facilitar a busca e organização."
        label="Tags de interesse"
        onChange={(nextValues) => {
          setFieldValue('interestTagIds', nextValues);
        }}
        options={tagOptions}
        selectedValues={values.interestTagIds}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ToggleField
          checked={values.isFeatured}
          description="Marca o evento como destaque no portal."
          id="event-featured"
          label="Destaque"
          onChange={(evt) => {
            setFieldValue('isFeatured', evt.target.checked);
          }}
        />
        <ToggleField
          checked={values.isPublished}
          description="Quando ativo, o evento aparece no portal público."
          id="event-published"
          label="Publicado"
          onChange={(evt) => {
            setFieldValue('isPublished', evt.target.checked);
          }}
        />
      </div>

      <FormActions>
        <button
          className={adminButtonClassName.secondary}
          onClick={() => {
            setValues(createInitialValues());
            setErrors({});
            setFeedback(null);
          }}
          type="button"
        >
          Limpar
        </button>
        <button
          className={adminButtonClassName.primary}
          disabled={isSubmitting}
          type="submit"
        >
          {isUploadingImage ? 'Enviando imagem...' : isSubmitting ? 'Salvando...' : event ? 'Atualizar evento' : 'Criar evento'}
        </button>
      </FormActions>
    </form>
  );
};
