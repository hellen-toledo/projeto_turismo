import { ImagePlus, ListOrdered, Plus, Trash2 } from 'lucide-react';
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
import { uploadAdminMedia } from '../api/adminMediaApi';
import { adminButtonClassName } from '../components/adminUiStyles';
import { useAdminCityMutations } from '../hooks/useAdminCities';
import type {
  AdminFeedback,
  AdminOption,
  AdminValidationErrors,
  CityAttractionFormValue,
  CityFormValues,
} from '../types/admin';
import {
  createEmptyCityAttraction,
  createEmptyCityForm,
  mapCityToFormValues,
} from '../types/admin';
import { useGalleryItems } from './useGalleryItems';
import { validateCityForm } from './validators';

interface CityFormProps {
  city?: City | null;
  isLoadingCity?: boolean;
  regionOptions: AdminOption[];
  tagOptions: AdminOption[];
  onSuccess?: () => void;
}

const getNestedError = (errors: AdminValidationErrors, path: string) => errors[path];

export const CityForm = ({ city, isLoadingCity = false, regionOptions, tagOptions, onSuccess }: CityFormProps) => {
  const createInitialValues = () => (city ? mapCityToFormValues(city) : createEmptyCityForm());
  const [values, setValues] = useState<CityFormValues>(createInitialValues);
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

  const {
    addGalleryItem,
    markGalleryCover,
    removeGalleryItem,
    updateGalleryItem,
  } = useGalleryItems(values.gallery, (gallery) => setFieldValue('gallery', gallery));

  const updateAttraction = (tempId: string, updater: (item: CityAttractionFormValue) => CityAttractionFormValue) => {
    setFieldValue(
      'attractions',
      values.attractions.map((item) => (item.tempId === tempId ? updater(item) : item)),
    );
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
          message: getApiErrorMessage(error, 'Falha ao salvar a cidade.'),
        });
      }
    }
  };

  const addAttraction = () => {
    setFieldValue('attractions', [...values.attractions, createEmptyCityAttraction(values.attractions.length)]);
  };

  const removeAttraction = (tempId: string) => {
    setFieldValue(
      'attractions',
      values.attractions
        .filter((item) => item.tempId !== tempId)
        .map((item, index) => ({
          ...item,
          sortOrder: index,
        })),
    );
  };

  if (isLoadingCity) {
    return <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-8 text-sm text-slate-500">Carregando dados completos da cidade...</div>;
  }

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
        hint="Aceita URL manual ou upload real para o painel administrativo."
        id="city-cover-image"
        label="Imagem de capa"
        onChange={(value) => {
          setFieldValue('coverImage', value);
        }}
        onUpload={uploadAdminMedia}
        showAltText={false}
        uploadCollection="cover"
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

      <section className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50/70 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Galeria</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Imagens complementares</h2>
            <p className="mt-1 text-sm text-slate-500">Envie múltiplas imagens, ajuste textos alternativos e escolha a capa editorial.</p>
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
                    <p className="text-xs text-slate-500">Controle a ordem e marque qual será a capa.</p>
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
                  hint="Use o upload do painel para manter a mídia rastreável."
                  id={`city-gallery-${item.id}`}
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
                  uploadCollection="gallery"
                  value={item.url}
                />

                <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                  <TextInput
                    id={`city-gallery-order-${item.id}`}
                    label="Ordem"
                    min={0}
                    onChange={(event) => {
                      updateGalleryItem(item.id, (current) => ({
                        ...current,
                        sortOrder: Number(event.target.value || 0),
                      }));
                    }}
                    type="number"
                    value={String(item.sortOrder)}
                  />
                  <ToggleField
                    checked={item.isCover}
                    description="Ao marcar, esta imagem passa a ser a capa principal da cidade."
                    id={`city-gallery-cover-${item.id}`}
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

      <section className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50/70 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Atrações</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Pontos turísticos e experiências</h2>
            <p className="mt-1 text-sm text-slate-500">Cadastre atrações publicáveis com ordem editorial e imagem opcional.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
            onClick={addAttraction}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Nova atração
          </button>
        </div>

        {values.attractions.length ? (
          <div className="space-y-4">
            {values.attractions.map((attraction, index) => (
              <article key={attraction.tempId} className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <ListOrdered className="h-5 w-5 text-emerald-700" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Atração {index + 1}</p>
                      <p className="text-xs text-slate-500">Ordem de exibição e publicação são controladas aqui.</p>
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center gap-2 self-start rounded-full border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                    onClick={() => {
                      removeAttraction(attraction.tempId);
                    }}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_120px]">
                  <TextInput
                    error={getNestedError(errors, `attractions.${index}.name`)}
                    id={`city-attraction-name-${attraction.tempId}`}
                    label="Nome da atração"
                    onChange={(event) => {
                      updateAttraction(attraction.tempId, (current) => ({
                        ...current,
                        name: event.target.value,
                      }));
                    }}
                    placeholder="Ex.: Mirante do pôr do sol"
                    value={attraction.name}
                  />
                  <TextInput
                    id={`city-attraction-order-${attraction.tempId}`}
                    label="Ordem"
                    min={0}
                    onChange={(event) => {
                      updateAttraction(attraction.tempId, (current) => ({
                        ...current,
                        sortOrder: Number(event.target.value || 0),
                      }));
                    }}
                    type="number"
                    value={String(attraction.sortOrder)}
                  />
                </div>

                <TextareaField
                  id={`city-attraction-description-${attraction.tempId}`}
                  label="Descrição"
                  onChange={(event) => {
                    updateAttraction(attraction.tempId, (current) => ({
                      ...current,
                      description: event.target.value,
                    }));
                  }}
                  placeholder="Descreva rapidamente a experiência da atração."
                  value={attraction.description}
                />

                <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                  <ImageUploadField
                    error={getNestedError(errors, `attractions.${index}.imageUrl`)}
                    hint="A imagem da atração pode ser uma URL manual ou um upload do painel."
                    id={`city-attraction-image-${attraction.tempId}`}
                    label="Imagem da atração"
                    onChange={(value) => {
                      updateAttraction(attraction.tempId, (current) => ({
                        ...current,
                        imageUrl: value,
                      }));
                    }}
                    onUpload={uploadAdminMedia}
                    showAltText={false}
                    uploadCollection="gallery"
                    value={attraction.imageUrl}
                  />
                  <ToggleField
                    checked={attraction.isPublished}
                    description="Quando desativada, a atração permanece em rascunho e não aparece publicamente."
                    id={`city-attraction-published-${attraction.tempId}`}
                    label="Atração publicada"
                    onChange={(event) => {
                      updateAttraction(attraction.tempId, (current) => ({
                        ...current,
                        isPublished: event.target.checked,
                      }));
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500">
            Nenhuma atração cadastrada. Use o botão acima para adicionar.
          </div>
        )}
      </section>

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
          {isSubmitting ? 'Salvando...' : city ? 'Atualizar cidade' : 'Criar cidade'}
        </button>
      </FormActions>
    </form>
  );
};
