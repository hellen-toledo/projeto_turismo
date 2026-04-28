import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MediaAsset, PaginatedResponse } from '../../../shared/types/api';
import { deleteAdminMedia, listAdminMedia, uploadAdminMedia } from '../api/adminMediaApi';

interface AdminMediaFilters {
  collection?: MediaAsset['collection'];
  page?: number;
  perPage?: number;
}

interface UploadAdminMediaValues {
  file: File;
  altText?: string;
  collection?: MediaAsset['collection'];
}

export const useAdminMedia = (filters: AdminMediaFilters = {}) =>
  useQuery<PaginatedResponse<MediaAsset>>({
    queryKey: ['admin', 'media', filters],
    queryFn: () => listAdminMedia(filters),
  });

export const useAdminMediaMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
  };

  const uploadMutation = useMutation({
    mutationFn: ({ file, altText, collection }: UploadAdminMediaValues) => uploadAdminMedia(file, {
      altText,
      collection,
    }),
    onSuccess: async () => {
      await invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (mediaId: number) => deleteAdminMedia(mediaId),
    onSuccess: async () => {
      await invalidate();
    },
  });

  return {
    uploadMedia: uploadMutation.mutateAsync,
    deleteMedia: deleteMutation.mutateAsync,
    uploading: uploadMutation.isPending,
    deleting: deleteMutation.isPending,
  };
};
