import { useState } from 'react';
import type { RegionSummary } from '../../../shared/types/api';
import { FormActions } from '../../../shared/components/form/FormActions';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { TextInput } from '../../../shared/components/form/TextInput';
import { getApiErrorMessage, getApiValidationErrors } from '../../../shared/lib/api/getApiErrorMessage';
import { useAdminRegionMutations } from '../hooks/useAdminRegions';
import type { AdminFeedback, AdminValidationErrors, RegionFormValues } from '../types/admin';
import { createEmptyRegionForm, mapRegionToFormValues } from '../types/admin';

interface RegionFormProps {
  region?: RegionSummary | null;
}

export const RegionForm = ({ region }: RegionFormProps) => {
  const createInitialValues = () => (region ? mapRegionToFormValues(region) : createEmptyRegionForm());
  const [values, setValues] = useState<RegionFormValues>(createInitialValues);
  const [errors, setErrors] = useState<AdminValidationErrors>({});
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const { createRegion, updateRegion, creating, updating } = useAdminRegionMutations();

  const isSubmitting = creating || updating;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: AdminValidationErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Informe o nome da região.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setFeedback({
        type: 'error',
        message: 'Revise os campos destacados antes de salvar a região.',
      });
      return;
    }

    try {
      if (region) {
        await updateRegion({ regionId: region.id, values });
      } else {
        await createRegion(values);
      }

      setFeedback({
        type: 'success',
        message: region ? 'Região atualizada com sucesso.' : 'Região criada com sucesso.',
      });
      setErrors({});

      if (!region) {
        setValues(createEmptyRegionForm());
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
          message: getApiErrorMessage(error, 'Falha ao salvar a região.'),
        });
      }
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <FormAlert feedback={feedback} />

      <TextInput
        error={errors.name}
        id="region-name"
        label="Nome da região"
        onChange={(event) => {
          setValues((current) => ({
            ...current,
            name: event.target.value,
          }));
        }}
        placeholder="Ex.: Vale do Araguaia"
        value={values.name}
      />

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
          {isSubmitting ? 'Salvando...' : region ? 'Atualizar região' : 'Criar região'}
        </button>
      </FormActions>
    </form>
  );
};
