import { useState } from 'react';
import type { InterestTag } from '../../../shared/types/api';
import { FormActions } from '../../../shared/components/form/FormActions';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { TextInput } from '../../../shared/components/form/TextInput';
import { getApiErrorMessage, getApiValidationErrors } from '../../../shared/lib/api/getApiErrorMessage';
import { adminButtonClassName } from '../components/adminUiStyles';
import { useAdminInterestTagMutations } from '../hooks/useAdminInterestTags';
import type { AdminFeedback, AdminValidationErrors, InterestTagFormValues } from '../types/admin';
import { createEmptyInterestTagForm, mapInterestTagToFormValues } from '../types/admin';

interface InterestTagFormProps {
  tag?: InterestTag | null;
  onSuccess?: () => void;
}

export const InterestTagForm = ({ tag, onSuccess }: InterestTagFormProps) => {
  const createInitialValues = () => (tag ? mapInterestTagToFormValues(tag) : createEmptyInterestTagForm());
  const [values, setValues] = useState<InterestTagFormValues>(createInitialValues);
  const [errors, setErrors] = useState<AdminValidationErrors>({});
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const { createInterestTag, updateInterestTag, creating, updating } = useAdminInterestTagMutations();

  const isSubmitting = creating || updating;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: AdminValidationErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Informe o nome da tag.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setFeedback({
        type: 'error',
        message: 'Revise os campos destacados antes de salvar a tag.',
      });
      return;
    }

    try {
      if (tag) {
        await updateInterestTag({ tagId: tag.id, values });
      } else {
        await createInterestTag(values);
      }

      setFeedback({
        type: 'success',
        message: tag ? 'Tag atualizada com sucesso.' : 'Tag criada com sucesso.',
      });
      setErrors({});

      if (!tag) {
        setValues(createEmptyInterestTagForm());
      }
      
      if (onSuccess) {
        onSuccess();
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
          message: getApiErrorMessage(error, 'Falha ao salvar a tag.'),
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
          id="interest-tag-name"
          label="Nome da tag"
          onChange={(event) => {
            setValues((current) => ({
              ...current,
              name: event.target.value,
            }));
          }}
          placeholder="Ex.: Ecoturismo"
          value={values.name}
        />

        <TextInput
          error={errors.slug}
          hint="Opcional. O backend aceita valor vazio."
          id="interest-tag-slug"
          label="Slug"
          onChange={(event) => {
            setValues((current) => ({
              ...current,
              slug: event.target.value,
            }));
          }}
          placeholder="ecoturismo"
          value={values.slug}
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
          {isSubmitting ? 'Salvando...' : tag ? 'Atualizar tag' : 'Criar tag'}
        </button>
      </FormActions>
    </form>
  );
};
