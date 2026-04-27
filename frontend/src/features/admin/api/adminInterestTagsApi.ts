import { apiClient } from '../../../shared/lib/api/client';
import { apiPaths } from '../../../shared/lib/api/config';
import type { InterestTag } from '../../../shared/types/api';
import type { InterestTagFormValues } from '../types/admin';

export const getAdminInterestTags = async (): Promise<InterestTag[]> => {
  const { data } = await apiClient.get(apiPaths.admin.interestTags);
  return data;
};

export const createAdminInterestTag = async (values: InterestTagFormValues): Promise<InterestTag> => {
  const { data } = await apiClient.post(apiPaths.admin.interestTags, {
    name: values.name.trim(),
    slug: values.slug.trim() || null,
  });

  return data;
};

export const updateAdminInterestTag = async (tagId: number, values: InterestTagFormValues): Promise<InterestTag> => {
  const { data } = await apiClient.patch(apiPaths.admin.interestTag(tagId), {
    name: values.name.trim(),
    slug: values.slug.trim() || null,
  });

  return data;
};

export const deleteAdminInterestTag = async (tagId: number) => {
  await apiClient.delete(apiPaths.admin.interestTag(tagId));
};
