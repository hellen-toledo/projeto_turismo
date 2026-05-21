import type { AdminValidationErrors } from '../types/admin';

const fieldLabels: Record<string, string> = {
  cityId: 'Cidade',
  coverImage: 'Imagem de capa',
  description: 'Descrição',
  endsAt: 'Fim',
  externalUrl: 'Link externo',
  name: 'Nome',
  regionId: 'Região',
  startsAt: 'Início',
  summary: 'Resumo',
  title: 'Título',
};

const getFieldLabel = (field: string) => {
  const attractionMatch = field.match(/^attractions\.(\d+)\.(.+)$/);

  if (attractionMatch) {
    const index = Number(attractionMatch[1]) + 1;
    const nestedField = attractionMatch[2];

    if (nestedField === 'name') {
      return `Atração ${index}: nome`;
    }

    if (nestedField === 'imageUrl') {
      return `Atração ${index}: imagem`;
    }
  }

  const galleryMatch = field.match(/^gallery\.(\d+)\./);

  if (galleryMatch) {
    return `Galeria ${Number(galleryMatch[1]) + 1}`;
  }

  return fieldLabels[field] ?? field;
};

export const getValidationSummary = (errors: AdminValidationErrors) => {
  const labels = Object.keys(errors)
    .filter((field) => errors[field])
    .map(getFieldLabel);

  if (labels.length === 0) {
    return 'Revise os campos destacados.';
  }

  return `Preencha ou corrija: ${labels.join(', ')}.`;
};
