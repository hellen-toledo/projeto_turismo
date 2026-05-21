import { useState } from 'react';
import type { RegionSummary } from '../../../shared/types/api';
import { FormActions } from '../../../shared/components/form/FormActions';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { TextInput } from '../../../shared/components/form/TextInput';
import { useToast } from '../../../shared/components/toast/toastContext';
import { getApiErrorMessage, getApiValidationErrors } from '../../../shared/lib/api/getApiErrorMessage';
import { adminButtonClassName } from '../components/adminUiStyles';
import { useAdminRegionMutations } from '../hooks/useAdminRegions';
import type { AdminFeedback, AdminValidationErrors, RegionFormValues } from '../types/admin';
import { createEmptyRegionForm, mapRegionToFormValues } from '../types/admin';
import { getValidationSummary } from './validationSummary';

interface RegionFormProps {
  region?: RegionSummary | null;
  onSuccess?: () => void;
}

export const RegionForm = ({ region, onSuccess }: RegionFormProps) => {
  const createInitialValues = () => (region ? mapRegionToFormValues(region) : createEmptyRegionForm());
  const [values, setValues] = useState<RegionFormValues>(createInitialValues);
  const [errors, setErrors] = useState<AdminValidationErrors>({});
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const { createRegion, updateRegion, creating, updating } = useAdminRegionMutations();
  const { showToast } = useToast();

  const isSubmitting = creating || updating;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: AdminValidationErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Informe o nome da região.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      const message = getValidationSummary(nextErrors);
      setFeedback({
        type: 'error',
        message: 'Revise os campos destacados antes de salvar a região.',
      });
      showToast({
        type: 'error',
        title: 'Campos obrigatórios pendentes',
        message,
      });
      return;
    }

    try {
      if (region) {
        await updateRegion({ regionId: region.id, values });
      } else {
        await createRegion(values);
      }

      const successMessage = region ? 'Edição realizada com sucesso.' : 'Criação de região com sucesso.';
      setFeedback({
        type: 'success',
        message: successMessage,
      });
      showToast({
        type: 'success',
        title: successMessage,
      });
      setErrors({});

      if (!region) {
        setValues(createEmptyRegionForm());
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
        const message = getApiErrorMessage(error, 'Falha ao salvar a região.');
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

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <FormAlert feedback={feedback} />

      <TextInput
        error={errors.name}
        id="region-name"
        label="Nome da região"
        requiredMark
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
          {isSubmitting ? 'Salvando...' : region ? 'Atualizar região' : 'Criar região'}
        </button>
      </FormActions>
    </form>
  );
};
