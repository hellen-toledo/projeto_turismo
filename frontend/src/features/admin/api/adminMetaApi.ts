import { apiClient } from '../../../shared/lib/api/client';
import { apiPaths } from '../../../shared/lib/api/config';
import type { InterestTag, RegionSummary } from '../../../shared/types/api';

export const getAdminRegions = async (): Promise<RegionSummary[]> => {
  const { data } = await apiClient.get(apiPaths.admin.regions);
  return data;
};

export const getAdminInterestTags = async (): Promise<InterestTag[]> => {
  const { data } = await apiClient.get(apiPaths.admin.interestTags);
  return data;
};
