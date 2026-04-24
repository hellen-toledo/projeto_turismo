import type { AdminValidationErrors, CityFormValues, EventFormValues } from '../types/admin';

const isValidUrl = (value: string) => {
  if (!value.trim()) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const validateCityForm = (values: CityFormValues): AdminValidationErrors => {
  const errors: AdminValidationErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Informe o nome da cidade.';
  }

  if (!values.description.trim()) {
    errors.description = 'Informe uma descrição.';
  }

  if (!values.regionId) {
    errors.regionId = 'Selecione uma região.';
  }

  if (values.summary.length > 500) {
    errors.summary = 'O resumo deve ter no máximo 500 caracteres.';
  }

  if (!isValidUrl(values.coverImage)) {
    errors.coverImage = 'Informe uma URL válida para a imagem.';
  }

  return errors;
};

export const validateEventForm = (values: EventFormValues): AdminValidationErrors => {
  const errors: AdminValidationErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Informe o título do evento.';
  }

  if (!values.description.trim()) {
    errors.description = 'Informe uma descrição.';
  }

  if (!values.startsAt) {
    errors.startsAt = 'Informe a data de início.';
  }

  if (!values.cityId) {
    errors.cityId = 'Selecione a cidade.';
  }

  if (values.endsAt && values.startsAt && new Date(values.endsAt) < new Date(values.startsAt)) {
    errors.endsAt = 'A data final deve ser igual ou posterior ao início.';
  }

  if (!isValidUrl(values.coverImage)) {
    errors.coverImage = 'Informe uma URL válida para a imagem.';
  }

  if (!isValidUrl(values.externalUrl)) {
    errors.externalUrl = 'Informe uma URL válida para o link externo.';
  }

  return errors;
};
