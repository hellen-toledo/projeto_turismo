import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { City, CityListParams } from '../../../shared/types/api';
import { createAdminCity, deleteAdminCity, getAdminCities, updateAdminCity } from '../api/adminCitiesApi';
import type { CityFormValues } from '../types/admin';

export const useAdminCities = (params: CityListParams = {}) =>
  useQuery({
    queryKey: ['admin', 'cities', params],
    queryFn: () => getAdminCities(params),
  });

export const useAdminCityMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'cities'] }),
      queryClient.invalidateQueries({ queryKey: ['cities'] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: (values: CityFormValues) => createAdminCity(values),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ cityId, values }: { cityId: number; values: CityFormValues }) => updateAdminCity(cityId, values),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (cityId: number) => deleteAdminCity(cityId),
    onSuccess: invalidate,
  });

  return {
    createCity: createMutation.mutateAsync,
    updateCity: updateMutation.mutateAsync,
    deleteCity: deleteMutation.mutateAsync,
    creating: createMutation.isPending,
    updating: updateMutation.isPending,
    deleting: deleteMutation.isPending,
  };
};

export const getCityDisplayStatus = (city: City) => (city.isPublished ? 'Publicado' : 'Rascunho');
