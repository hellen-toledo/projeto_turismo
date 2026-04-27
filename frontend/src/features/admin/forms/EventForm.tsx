import { ImagePlus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Event } from '../../../shared/types/api';
import { FormActions } from '../../../shared/components/form/FormActions';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { ImageUploadField } from '../../../shared/components/form/ImageUploadField';
import { SelectField } from '../../../shared/components/form/SelectField';
import { TagMultiSelect } from '../../../shared/components/form/TagMultiSelect';
import { TextInput } from '../../../shared/components/form/TextInput';
import { TextareaField } from '../../../shared/components/form/TextareaField';
import { ToggleField } from '../../../shared/components/form/ToggleField';
import { getApiErrorMessage, getApiValidationErrors } from '../../../shared/lib/api/getApiErrorMessage';
import { useAdminEventMutations } from '../hooks/useAdminEvents';
import type { AdminFeedback, AdminOption, AdminValidationErrors, CityGalleryItemFormValue, EventFormValues } from '../types/admin';
import { createEmptyCityGalleryItem, createEmptyEventForm, mapEventToFormValues } from '../types/admin';
import { validateEventForm } from './validators';

interface EventFormProps {
  event?: Event | null;
  isLoadingEvent?: boolean;
  cityOptions: AdminOption[];
  tagOptions: AdminOption[];
}

const getNestedError = (errors: AdminValidationErrors, path: string) => errors[path];

export const EventForm = ({ cityOptions, event, isLoadingEvent = false, tagOptions }: EventFormProps) => {
  const createInitialValues = () => (event ? mapEventToFormValues(event) : createEmptyEventForm());
  const [values, setValues] = useState<EventFormValues>(createInitialValues);
  const [errors, setErrors] = useState<AdminValidationErrors>({});
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const { createEvent, updateEvent, creating, updating } = useAdminEventMutations();

  const isSubmitting = creating || updating;

  const setFieldValue = <Key extends keyof EventFormValues>(field: Key, value: EventFormValues[Key]) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateGalleryItem = (itemId: string, updater: (item: CityGalleryItemFormValue) => CityGalleryItemFormValue) => {
    setFieldValue(
      'gallery',
      values.gallery.map((item) => (item.id === itemId ? updater(item) : item)),
    );
  };

  const handleSubmit = async (submitEvent: React.FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    const nextErrors = validateEventForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setFeedback({
        type: 'error',
        message: 'Revise os campos destacados antes de salvar o evento.',
      });
      return;
    }

    try {
      if (event) {
        await updateEvent({ eventId: event.id, values });
      } else {
        await createEvent(values);
      }

      setFeedback({
        type: 'success',
        message: event ? 'Evento atualizado com sucesso.' : 'Evento criado com sucesso.',
      });
      setErrors({});

      if (!event) {
        setValues(createEmptyEventForm());
      }
    } catch (error) {
      const apiValidationErrors = getApiValidationErrors(error);
      if (Object.keys(apiValidationErrors).length > 0) {
        setErrors(apiValidationErrors);
        setFeedback({
          type: 'error',
          message: 'Há erros de validação retornados pelo servidor.',
        });
      } else {
        setFeedback({
          type: 'error',
          message: getApiErrorMessage(error, 'Falha ao salvar o evento.'),
        });
      }
    }
  };

  const addGalleryItem = () => {
    setFieldValue('gallery', [...values.gallery, createEmptyCityGalleryItem(values.gallery.length)]);
  };

  const removeGalleryItem = (itemId: string) => {
    const nextGallery = values.gallery.filter((item) => item.id !== itemId);
    const normalizedGallery = nextGallery.map((item, index) => ({
      ...item,
      sortOrder: index,
      isCover: nextGallery.length === 1 ? true : item.isCover,
    }));

    if (normalizedGallery.length > 0 && normalizedGallery.every((item) => !item.isCover)) {
      normalizedGallery[0] = {
        ...normalizedGallery[0],
        isCover: true,
      };
    }

    setFieldValue('gallery', normalizedGallery);
  };

  const markGalleryCover = (itemId: string) => {
    setFieldValue(
      'gallery',
      values.gallery.map((item) => ({
        ...item,
        isCover: item.id === itemId,
      })),
    );
  };

  if (isLoadingEvent) {
    return <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-8 text-sm text-slate-500">Carregando dados completos do evento...</div>;
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <FormAlert feedback={feedback} />

      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          error={errors.title}
          id="event-title"
          label="Título do evento"
          onChange={(evt) => {
            setFieldValue('title', evt.target.value);
          }}
          placeholder="Ex.: Festival Gastronômico"
          value={values.title}
        />
        <TextInput
          error={errors.slug}
          hint="Opcional para futura gestão de URLs amigáveis."
          id="event-slug"
          label="Slug"
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
          label="URL externa"
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
          error={errors.startsAt}
          id="event-starts-at"
          label="Início"
          onChange={(evt) => {
            setFieldValue('startsAt', evt.target.value);
          }}
          type="datetime-local"
          value={values.startsAt}
        />
        <TextInput
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
        onChange={(evt) => {
          setFieldValue('description', evt.target.value);
        }}
        placeholder="Descreva programação, público e contexto do evento."
        value={values.description}
      />

      <ImageUploadField
        altText={values.coverImageAltText}
        error={errors.coverImage}
        hint="Aceita URL manual ou upload real para o painel administrativo."
        id="event-cover-image"
        label="Imagem de capa"
        onAltTextChange={(value) => {
          setFieldValue('coverImageAltText', value);
        }}
        onChange={(value) => {
          setFieldValue('coverImage', value);
        }}
        uploadCollection="cover"
        value={values.coverImage}
      />

      <section className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50/70 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Galeria</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Imagens complementares</h2>
            <p className="mt-1 text-sm text-slate-500">Associe mídias do painel, ajuste ordem editorial e marque a capa quando desejar usar MediaAsset.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
            onClick={addGalleryItem}
            type="button"
          >
            <ImagePlus className="h-4 w-4" />
            Adicionar imagem
          </button>
        </div>

        {values.gallery.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {values.gallery.map((item, index) => (
              <article key={item.id} className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Imagem {index + 1}</p>
                    <p className="text-xs text-slate-500">Controle a ordem e defina a capa editorial da galeria.</p>
                  </div>
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
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
                  hint="Use o upload do painel para manter o vínculo com MediaAsset."
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
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500">
            Nenhuma imagem complementar adicionada.
          </div>
        )}
      </section>

      <TagMultiSelect
        hint="Estrutura pronta para filtros editoriais e curadoria posterior."
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
          description="Marca o evento como destaque para futuras vitrines editoriais."
          id="event-featured"
          label="Destaque"
          onChange={(evt) => {
            setFieldValue('isFeatured', evt.target.checked);
          }}
        />
        <ToggleField
          checked={values.isPublished}
          description="Libera o evento para consumo público quando o backend também o disponibilizar."
          id="event-published"
          label="Publicado"
          onChange={(evt) => {
            setFieldValue('isPublished', evt.target.checked);
          }}
        />
      </div>

      <FormActions>
        <button
          className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
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
          className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Salvando...' : event ? 'Atualizar evento' : 'Criar evento'}
        </button>
      </FormActions>
    </form>
  );
};
