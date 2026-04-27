import type { City, CityAttraction, Event, InterestTag, MediaAsset, RegionSummary } from '../../../shared/types/api';

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

export interface RegionFormValues {
  name: string;
}

export interface InterestTagFormValues {
  name: string;
  slug: string;
}

export interface CityFormValues {
  name: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  coverImageAltText: string;
  regionId: string;
  isPublished: boolean;
  interestTagIds: string[];
  gallery: CityGalleryItemFormValue[];
  attractions: CityAttractionFormValue[];
}

export interface EventFormValues {
  title: string;
  slug: string;
  description: string;
  startsAt: string;
  endsAt: string;
  coverImage: string;
  coverImageAltText: string;
  externalUrl: string;
  cityId: string;
  isFeatured: boolean;
  isPublished: boolean;
  interestTagIds: string[];
  gallery: CityGalleryItemFormValue[];
}

export interface CityGalleryItemFormValue {
  id: string;
  mediaAssetId: number | null;
  url: string;
  altText: string;
  sortOrder: number;
  isCover: boolean;
  originalName?: string;
  size?: number;
}

export interface CityAttractionFormValue {
  id?: number;
  tempId: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  isPublished: boolean;
}

export const createEmptyCityForm = (): CityFormValues => ({
  name: '',
  slug: '',
  summary: '',
  description: '',
  coverImage: '',
  coverImageAltText: '',
  regionId: '',
  isPublished: false,
  interestTagIds: [],
  gallery: [],
  attractions: [],
});

export const createEmptyRegionForm = (): RegionFormValues => ({
  name: '',
});

export const createEmptyInterestTagForm = (): InterestTagFormValues => ({
  name: '',
  slug: '',
});

export const createEmptyEventForm = (): EventFormValues => ({
  title: '',
  slug: '',
  description: '',
  startsAt: '',
  endsAt: '',
  coverImage: '',
  coverImageAltText: '',
  externalUrl: '',
  cityId: '',
  isFeatured: false,
  isPublished: false,
  interestTagIds: [],
  gallery: [],
});

export const mapCityToFormValues = (city: City): CityFormValues => ({
  name: city.name,
  slug: city.slug,
  summary: city.summary ?? '',
  description: city.description,
  coverImage: city.coverImage ?? '',
  coverImageAltText: city.gallery?.find((item) => item.isCover)?.altText ?? '',
  regionId: city.region ? String(city.region.id) : '',
  isPublished: city.isPublished,
  interestTagIds: city.interestTags?.map((tag) => String(tag.id)) ?? [],
  gallery: city.gallery?.map((item, index) => mapMediaAssetToGalleryFormValue(item, index)) ?? [],
  attractions: city.attractions?.map((item, index) => mapAttractionToFormValue(item, index)) ?? [],
});

export const mapEventToFormValues = (event: Event): EventFormValues => ({
  title: event.title,
  slug: event.slug,
  description: event.description,
  startsAt: toDatetimeLocalValue(event.startsAt),
  endsAt: toDatetimeLocalValue(event.endsAt),
  coverImage: event.coverImage ?? '',
  coverImageAltText: event.gallery?.find((item) => item.isCover)?.altText ?? '',
  externalUrl: event.externalUrl ?? '',
  cityId: event.city ? String(event.city.id) : '',
  isFeatured: event.isFeatured,
  isPublished: event.isPublished,
  interestTagIds: event.interestTags?.map((tag) => String(tag.id)) ?? [],
  gallery: event.gallery?.map((item, index) => mapMediaAssetToGalleryFormValue(item, index)) ?? [],
});

export const mapRegionToFormValues = (region: RegionSummary): RegionFormValues => ({
  name: region.name,
});

export const mapInterestTagToFormValues = (tag: InterestTag): InterestTagFormValues => ({
  name: tag.name,
  slug: tag.slug,
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

export const createEmptyCityGalleryItem = (sortOrder = 0): CityGalleryItemFormValue => ({
  id: `gallery-${crypto.randomUUID()}`,
  mediaAssetId: null,
  url: '',
  altText: '',
  sortOrder,
  isCover: false,
});

export const createEmptyCityAttraction = (sortOrder = 0): CityAttractionFormValue => ({
  tempId: `attraction-${crypto.randomUUID()}`,
  name: '',
  description: '',
  imageUrl: '',
  sortOrder,
  isPublished: true,
});

export const mapMediaAssetToGalleryFormValue = (asset: MediaAsset, index: number): CityGalleryItemFormValue => ({
  id: `gallery-${asset.id}`,
  mediaAssetId: asset.id,
  url: asset.url,
  altText: asset.altText ?? '',
  sortOrder: asset.sortOrder ?? index,
  isCover: asset.isCover ?? false,
  originalName: asset.originalName,
  size: asset.size,
});

export const mapAttractionToFormValue = (attraction: CityAttraction, index: number): CityAttractionFormValue => ({
  id: attraction.id,
  tempId: `attraction-${attraction.id}`,
  name: attraction.name,
  description: attraction.description ?? '',
  imageUrl: attraction.imageUrl ?? '',
  sortOrder: attraction.sortOrder ?? index,
  isPublished: attraction.isPublished ?? true,
});
