import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { City, CityListParams } from '../../../shared/types/api';
import { createAdminCity, deleteAdminCity, getAdminCities, getAdminCity, updateAdminCity } from '../api/adminCitiesApi';
import type { CityFormValues } from '../types/admin';

export const useAdminCities = (params: CityListParams = {}) =>
  useQuery({
    queryKey: ['admin', 'cities', params],
    queryFn: () => getAdminCities(params),
  });

export const useAdminCity = (cityId: number | null) =>
  useQuery({
    queryKey: ['admin', 'city', cityId],
    queryFn: () => getAdminCity(cityId as number),
    enabled: cityId !== null,
  });

export const useAdminCityMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = async (cityId?: number) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'cities'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'city'] }),
      queryClient.invalidateQueries({ queryKey: ['cities'] }),
      queryClient.invalidateQueries({ queryKey: ['city'] }),
      cityId ? queryClient.removeQueries({ queryKey: ['city', String(cityId)] }) : Promise.resolve(),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: (values: CityFormValues) => createAdminCity(values),
    onSuccess: async (city) => {
      await invalidate(city.id);
      queryClient.setQueryData(['admin', 'city', city.id], city);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ cityId, values }: { cityId: number; values: CityFormValues }) => updateAdminCity(cityId, values),
    onSuccess: async (city) => {
      await invalidate(city.id);
      queryClient.setQueryData(['admin', 'city', city.id], city);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (cityId: number) => deleteAdminCity(cityId),
    onSuccess: async (_, cityId) => {
      await invalidate(cityId);
      queryClient.removeQueries({ queryKey: ['admin', 'city', cityId] });
    },
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
