import { apiClient } from '../../../shared/lib/api/client';
import { apiPaths } from '../../../shared/lib/api/config';
import { mapPaginatedResponse } from '../../../shared/lib/api/mapPaginatedResponse';
import type { City, CityListParams, PaginatedResponse } from '../../../shared/types/api';

export const getCities = async (params: CityListParams = {}): Promise<PaginatedResponse<City>> => {
  const { data } = await apiClient.get(apiPaths.public.cities, {
    params: mapCityListParams(params),
  });

  return mapPaginatedResponse<City>(data);
};

export const getCityByIdOrSlug = async (idOrSlug: string): Promise<City> => {
  const { data } = await apiClient.get(apiPaths.public.city(idOrSlug));
  return data;
};

const mapCityListParams = (params: CityListParams) => ({
  page: params.page,
  per_page: params.perPage,
  search: params.search ?? params.q,
  region: params.region,
  region_id: params.regionId,
  tag: params.tag,
  tag_id: params.tagId,
  published: params.published,
});
