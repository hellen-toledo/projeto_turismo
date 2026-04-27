import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAdminRegion, deleteAdminRegion, getAdminRegions, updateAdminRegion } from '../api/adminRegionsApi';
import type { RegionFormValues } from '../types/admin';

export const useAdminRegions = () =>
  useQuery({
    queryKey: ['admin', 'regions'],
    queryFn: getAdminRegions,
  });

export const useAdminRegionMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'regions'] }),
      queryClient.invalidateQueries({ queryKey: ['regions'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'cities'] }),
      queryClient.invalidateQueries({ queryKey: ['cities'] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: (values: RegionFormValues) => createAdminRegion(values),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ regionId, values }: { regionId: number; values: RegionFormValues }) => updateAdminRegion(regionId, values),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (regionId: number) => deleteAdminRegion(regionId),
    onSuccess: invalidate,
  });

  return {
    createRegion: createMutation.mutateAsync,
    updateRegion: updateMutation.mutateAsync,
    deleteRegion: deleteMutation.mutateAsync,
    creating: createMutation.isPending,
    updating: updateMutation.isPending,
    deleting: deleteMutation.isPending,
  };
};
