import type { AdminValidationErrors, CityFormValues, EventFormValues } from '../types/admin';

const isValidUrl = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return true;
  }

  if (trimmedValue.startsWith('/storage/tourism/media/')) {
    return true;
  }

  try {
    new URL(trimmedValue);
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
    errors.coverImage = 'Informe um link válido para a imagem.';
  }

  values.attractions.forEach((attraction, index) => {
    if (!attraction.name.trim() && !attraction.description.trim() && !attraction.imageUrl.trim()) {
      errors[`attractions.${index}.name`] = 'Informe o nome da atração ou remova o bloco vazio.';
      return;
    }

    if (!attraction.name.trim()) {
      errors[`attractions.${index}.name`] = 'Informe o nome da atração.';
    }

    if (!isValidUrl(attraction.imageUrl)) {
      errors[`attractions.${index}.imageUrl`] = 'Informe um link válido para a imagem da atração.';
    }
  });

  values.gallery.forEach((item, index) => {
    if (!item.mediaAssetId || !item.url.trim()) {
      errors[`gallery.${index}.mediaAssetId`] = 'Envie uma imagem para a galeria ou remova o bloco.';
    }
  });

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
    errors.coverImage = 'Informe um link válido para a imagem.';
  }

  if (!isValidUrl(values.externalUrl)) {
    errors.externalUrl = 'Informe um link externo válido.';
  }

  values.gallery.forEach((item, index) => {
    if (!item.mediaAssetId || !item.url.trim()) {
      errors[`gallery.${index}.mediaAssetId`] = 'Envie uma imagem para a galeria ou remova o bloco.';
    }
  });

  return errors;
};
