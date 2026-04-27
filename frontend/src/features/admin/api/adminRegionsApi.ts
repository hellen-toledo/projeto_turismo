import { apiClient } from '../../../shared/lib/api/client';
import { apiPaths } from '../../../shared/lib/api/config';
import type { RegionSummary } from '../../../shared/types/api';
import type { RegionFormValues } from '../types/admin';

export const getAdminRegions = async (): Promise<RegionSummary[]> => {
  const { data } = await apiClient.get(apiPaths.admin.regions);
  return data;
};

export const createAdminRegion = async (values: RegionFormValues): Promise<RegionSummary> => {
  const { data } = await apiClient.post(apiPaths.admin.regions, {
    name: values.name.trim(),
  });

  return data;
};

export const updateAdminRegion = async (regionId: number, values: RegionFormValues): Promise<RegionSummary> => {
  const { data } = await apiClient.patch(apiPaths.admin.region(regionId), {
    name: values.name.trim(),
  });

  return data;
};

export const deleteAdminRegion = async (regionId: number) => {
  await apiClient.delete(apiPaths.admin.region(regionId));
};
