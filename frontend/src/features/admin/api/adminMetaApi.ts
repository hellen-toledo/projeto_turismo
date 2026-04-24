import { adminApiClient } from './adminClient';
import type { InterestTag, RegionSummary } from '../../../shared/types/api';

export const getAdminRegions = async (): Promise<RegionSummary[]> => {
  const { data } = await adminApiClient.get('/admin/v1/regions');
  return data;
};

export const getAdminInterestTags = async (): Promise<InterestTag[]> => {
  const { data } = await adminApiClient.get('/admin/v1/interest-tags');
  return data;
};
