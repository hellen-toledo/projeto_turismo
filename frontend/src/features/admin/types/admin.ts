import type { City, Event, InterestTag, RegionSummary } from '../../../shared/types/api';

export interface AdminFeedback {
  type: 'success' | 'error';
  message: string;
}

export interface AdminOption {
  value: string;
  label: string;
}

export interface AdminValidationErrors {
  [key: string]: string | undefined;
}

export interface CityFormValues {
  name: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  regionId: string;
  isPublished: boolean;
  interestTagIds: string[];
}

export interface EventFormValues {
  title: string;
  slug: string;
  description: string;
  startsAt: string;
  endsAt: string;
  coverImage: string;
  externalUrl: string;
  cityId: string;
  isFeatured: boolean;
  isPublished: boolean;
  interestTagIds: string[];
}

export const createEmptyCityForm = (): CityFormValues => ({
  name: '',
  slug: '',
  summary: '',
  description: '',
  coverImage: '',
  regionId: '',
  isPublished: false,
  interestTagIds: [],
});

export const createEmptyEventForm = (): EventFormValues => ({
  title: '',
  slug: '',
  description: '',
  startsAt: '',
  endsAt: '',
  coverImage: '',
  externalUrl: '',
  cityId: '',
  isFeatured: false,
  isPublished: false,
  interestTagIds: [],
});

export const mapCityToFormValues = (city: City): CityFormValues => ({
  name: city.name,
  slug: city.slug,
  summary: city.summary ?? '',
  description: city.description,
  coverImage: city.coverImage ?? '',
  regionId: city.region ? String(city.region.id) : '',
  isPublished: city.isPublished,
  interestTagIds: city.interestTags?.map((tag) => String(tag.id)) ?? [],
});

export const mapEventToFormValues = (event: Event): EventFormValues => ({
  title: event.title,
  slug: event.slug,
  description: event.description,
  startsAt: toDatetimeLocalValue(event.startsAt),
  endsAt: toDatetimeLocalValue(event.endsAt),
  coverImage: event.coverImage ?? '',
  externalUrl: event.externalUrl ?? '',
  cityId: event.city ? String(event.city.id) : '',
  isFeatured: event.isFeatured,
  isPublished: event.isPublished,
  interestTagIds: event.interestTags?.map((tag) => String(tag.id)) ?? [],
});

export const mapRegionsToOptions = (regions: RegionSummary[] = []): AdminOption[] =>
  regions.map((region) => ({
    value: String(region.id),
    label: region.name,
  }));

export const mapCitiesToOptions = (cities: City[] = []): AdminOption[] =>
  cities.map((city) => ({
    value: String(city.id),
    label: city.name,
  }));

export const mapTagsToOptions = (tags: InterestTag[] = []): AdminOption[] =>
  tags.map((tag) => ({
    value: String(tag.id),
    label: tag.name,
  }));

const toDatetimeLocalValue = (value: string | null | undefined) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 16);
};
