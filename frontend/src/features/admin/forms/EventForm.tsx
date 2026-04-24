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
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import { useAdminEventMutations } from '../hooks/useAdminEvents';
import type { AdminFeedback, AdminOption, AdminValidationErrors, EventFormValues } from '../types/admin';
import { createEmptyEventForm, mapEventToFormValues } from '../types/admin';
import { validateEventForm } from './validators';

interface EventFormProps {
  event?: Event | null;
  cityOptions: AdminOption[];
  tagOptions: AdminOption[];
}

export const EventForm = ({ cityOptions, event, tagOptions }: EventFormProps) => {
  const [values, setValues] = useState<EventFormValues>(event ? mapEventToFormValues(event) : createEmptyEventForm());
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

      if (!event) {
        setValues(createEmptyEventForm());
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Falha ao salvar o evento.'),
      });
    }
  };

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
        error={errors.coverImage}
        hint="Usa URL pública no momento, mas o componente já isola a futura troca para upload real."
        id="event-cover-image"
        label="Imagem de capa"
        onChange={(value) => {
          setFieldValue('coverImage', value);
        }}
        value={values.coverImage}
      />

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
            setValues(event ? mapEventToFormValues(event) : createEmptyEventForm());
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
