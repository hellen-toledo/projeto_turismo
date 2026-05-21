import { apiClient } from '../../../shared/lib/api/client';
import { apiPaths } from '../../../shared/lib/api/config';
import { mapPaginatedResponse } from '../../../shared/lib/api/mapPaginatedResponse';
import type { MediaAsset, PaginatedResponse } from '../../../shared/types/api';

interface UploadAdminMediaMetadata {
  altText?: string;
  collection?: MediaAsset['collection'];
}

interface ListAdminMediaParams {
  collection?: MediaAsset['collection'];
  page?: number;
  perPage?: number;
}

export const uploadAdminMedia = async (file: File, metadata: UploadAdminMediaMetadata = {}): Promise<MediaAsset> => {
  const formData = new FormData();

  formData.append('file', file);

  if (metadata.collection) {
    formData.append('collection', metadata.collection);
  }

  if (metadata.altText?.trim()) {
    formData.append('altText', metadata.altText.trim());
  }

  const { data } = await apiClient.post(apiPaths.admin.media, formData);

  return data;
};

export const listAdminMedia = async (params: ListAdminMediaParams = {}): Promise<PaginatedResponse<MediaAsset>> => {
  const { data } = await apiClient.get(apiPaths.admin.media, {
    params: {
      collection: params.collection,
      page: params.page,
      per_page: params.perPage,
    },
  });

  return mapPaginatedResponse<MediaAsset>(data);
};

export const deleteAdminMedia = async (mediaId: number) => {
  await apiClient.delete(apiPaths.admin.mediaItem(mediaId));
};
