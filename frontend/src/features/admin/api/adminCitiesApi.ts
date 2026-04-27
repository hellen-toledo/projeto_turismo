import { apiClient } from '../../../shared/lib/api/client';
import { apiPaths } from '../../../shared/lib/api/config';
import { mapPaginatedResponse } from '../../../shared/lib/api/mapPaginatedResponse';
import type { City, CityListParams, PaginatedResponse } from '../../../shared/types/api';
import type { CityFormValues } from '../types/admin';

export const getAdminCities = async (params: CityListParams = {}): Promise<PaginatedResponse<City>> => {
  const { data } = await apiClient.get(apiPaths.admin.cities, {
    params: {
      page: params.page,
      per_page: params.perPage,
      search: params.search ?? params.q,
      region: params.region,
      region_id: params.regionId,
      tag: params.tag,
      tag_id: params.tagId,
      published: params.published,
    },
  });

  return mapPaginatedResponse<City>(data);
};

export const createAdminCity = async (values: CityFormValues): Promise<City> => {
  const { data } = await apiClient.post(apiPaths.admin.cities, mapCityPayload(values));
  return data;
};

export const getAdminCity = async (cityId: number): Promise<City> => {
  const { data } = await apiClient.get(apiPaths.admin.city(cityId));
  return data;
};

export const updateAdminCity = async (cityId: number, values: CityFormValues): Promise<City> => {
  const { data } = await apiClient.patch(apiPaths.admin.city(cityId), mapCityPayload(values));
  return data;
};

export const deleteAdminCity = async (cityId: number) => {
  await apiClient.delete(apiPaths.admin.city(cityId));
};

const mapCityPayload = (values: CityFormValues) => ({
  name: values.name.trim(),
  slug: values.slug.trim() || null,
  summary: values.summary.trim() || null,
  description: values.description.trim(),
  coverImage: values.coverImage.trim() || null,
  regionId: Number(values.regionId),
  isPublished: values.isPublished,
  interestTagIds: values.interestTagIds.map(Number),
  gallery: values.gallery.map((item) => ({
    mediaAssetId: item.mediaAssetId,
    altText: item.altText.trim() || null,
    sortOrder: item.sortOrder,
    isCover: item.isCover,
  })),
  attractions: values.attractions.map((item) => ({
    id: item.id,
    name: item.name.trim(),
    description: item.description.trim() || null,
    imageUrl: item.imageUrl.trim() || null,
    sortOrder: item.sortOrder,
    isPublished: item.isPublished,
  })),
});
