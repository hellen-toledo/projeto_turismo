import { adminApiClient } from './adminClient';
import type { City } from '../../../shared/types/api';
import type { CityFormValues } from '../types/admin';

export const getAdminCities = async (): Promise<City[]> => {
  const { data } = await adminApiClient.get('/admin/v1/cities');
  return data;
};

export const createAdminCity = async (values: CityFormValues): Promise<City> => {
  const { data } = await adminApiClient.post('/admin/v1/cities', mapCityPayload(values));
  return data;
};

export const updateAdminCity = async (cityId: number, values: CityFormValues): Promise<City> => {
  const { data } = await adminApiClient.patch(`/admin/v1/cities/${cityId}`, mapCityPayload(values));
  return data;
};

export const deleteAdminCity = async (cityId: number) => {
  await adminApiClient.delete(`/admin/v1/cities/${cityId}`);
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
});
