import { useState } from 'react';
import type { City } from '../../../shared/types/api';
import { FormActions } from '../../../shared/components/form/FormActions';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { ImageUploadField } from '../../../shared/components/form/ImageUploadField';
import { SelectField } from '../../../shared/components/form/SelectField';
import { TagMultiSelect } from '../../../shared/components/form/TagMultiSelect';
import { TextInput } from '../../../shared/components/form/TextInput';
import { TextareaField } from '../../../shared/components/form/TextareaField';
import { ToggleField } from '../../../shared/components/form/ToggleField';
import { getApiErrorMessage, getApiValidationErrors } from '../../../shared/lib/api/getApiErrorMessage';
import { useAdminCityMutations } from '../hooks/useAdminCities';
import type { AdminFeedback, AdminOption, AdminValidationErrors, CityFormValues } from '../types/admin';
import { createEmptyCityForm, mapCityToFormValues } from '../types/admin';
import { validateCityForm } from './validators';

interface CityFormProps {
  city?: City | null;
  regionOptions: AdminOption[];
  tagOptions: AdminOption[];
}

export const CityForm = ({ city, regionOptions, tagOptions }: CityFormProps) => {
  const [values, setValues] = useState<CityFormValues>(city ? mapCityToFormValues(city) : createEmptyCityForm());
  const [errors, setErrors] = useState<AdminValidationErrors>({});
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const { createCity, updateCity, creating, updating } = useAdminCityMutations();

  const isSubmitting = creating || updating;

  const setFieldValue = <Key extends keyof CityFormValues>(field: Key, value: CityFormValues[Key]) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateCityForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setFeedback({
        type: 'error',
        message: 'Revise os campos destacados antes de salvar a cidade.',
      });
      return;
    }

    try {
      if (city) {
        await updateCity({ cityId: city.id, values });
      } else {
        await createCity(values);
      }

      setFeedback({
        type: 'success',
        message: city ? 'Cidade atualizada com sucesso.' : 'Cidade criada com sucesso.',
      });
      setErrors({});

      if (!city) {
        setValues(createEmptyCityForm());
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
          message: getApiErrorMessage(error, 'Falha ao salvar a cidade.'),
        });
      }
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <FormAlert feedback={feedback} />

      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          error={errors.name}
          id="city-name"
          label="Nome da cidade"
          onChange={(event) => {
            setFieldValue('name', event.target.value);
          }}
          placeholder="Ex.: Porangatu"
          value={values.name}
        />
        <TextInput
          error={errors.slug}
          hint="Opcional. Pode ficar vazio para o backend gerar ou tratar depois."
          id="city-slug"
          label="Slug"
          onChange={(event) => {
            setFieldValue('slug', event.target.value);
          }}
          placeholder="porangatu"
          value={values.slug}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-[1.3fr_0.7fr]">
        <TextareaField
          error={errors.summary}
          hint="Resumo curto para cards e listagens."
          id="city-summary"
          label="Resumo"
          maxLength={500}
          onChange={(event) => {
            setFieldValue('summary', event.target.value);
          }}
          placeholder="Resumo institucional e turístico da cidade."
          value={values.summary}
        />
        <div className="space-y-4">
          <SelectField
            error={errors.regionId}
            id="city-region"
            label="Região"
            onChange={(event) => {
              setFieldValue('regionId', event.target.value);
            }}
            options={regionOptions}
            value={values.regionId}
          />
          <ToggleField
            checked={values.isPublished}
            description="Quando ativo, a cidade fica pronta para aparecer nas rotas públicas."
            id="city-published"
            label="Publicada"
            onChange={(event) => {
              setFieldValue('isPublished', event.target.checked);
            }}
          />
        </div>
      </div>

      <TextareaField
        error={errors.description}
        hint="Campo principal com descrição rica da cidade."
        id="city-description"
        label="Descrição"
        onChange={(event) => {
          setFieldValue('description', event.target.value);
        }}
        placeholder="Descreva atrativos, contexto regional e diferenciais turísticos."
        value={values.description}
      />

      <ImageUploadField
        error={errors.coverImage}
        hint="Pronto para evoluir para upload real sem alterar o contrato do formulário."
        id="city-cover-image"
        label="Imagem de capa"
        onChange={(value) => {
          setFieldValue('coverImage', value);
        }}
        value={values.coverImage}
      />

      <TagMultiSelect
        hint="Selecione tags temáticas para filtros futuros."
        label="Tags de interesse"
        onChange={(nextValues) => {
          setFieldValue('interestTagIds', nextValues);
        }}
        options={tagOptions}
        selectedValues={values.interestTagIds}
      />

      <FormActions>
        <button
          className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
          onClick={() => {
            setValues(city ? mapCityToFormValues(city) : createEmptyCityForm());
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
          {isSubmitting ? 'Salvando...' : city ? 'Atualizar cidade' : 'Criar cidade'}
        </button>
      </FormActions>
    </form>
  );
};
