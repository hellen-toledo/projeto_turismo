import { apiClient } from '../../../shared/lib/api/client';
import type { City } from '../../../shared/types/api';

export const getCities = async (): Promise<City[]> => {
  const { data } = await apiClient.get('/cities');
  return data;
};

export const getCityByIdOrSlug = async (idOrSlug: string): Promise<City> => {
  const { data } = await apiClient.get(`/cities/${idOrSlug}`);
  return data;
};
