import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAdminInterestTag, deleteAdminInterestTag, getAdminInterestTags, updateAdminInterestTag } from '../api/adminInterestTagsApi';
import type { InterestTagFormValues } from '../types/admin';

export const useAdminInterestTags = () =>
  useQuery({
    queryKey: ['admin', 'interest-tags'],
    queryFn: getAdminInterestTags,
  });

export const useAdminInterestTagMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'interest-tags'] }),
      queryClient.invalidateQueries({ queryKey: ['interest-tags'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'cities'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] }),
      queryClient.invalidateQueries({ queryKey: ['cities'] }),
      queryClient.invalidateQueries({ queryKey: ['events'] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: (values: InterestTagFormValues) => createAdminInterestTag(values),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ tagId, values }: { tagId: number; values: InterestTagFormValues }) => updateAdminInterestTag(tagId, values),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (tagId: number) => deleteAdminInterestTag(tagId),
    onSuccess: invalidate,
  });

  return {
    createInterestTag: createMutation.mutateAsync,
    updateInterestTag: updateMutation.mutateAsync,
    deleteInterestTag: deleteMutation.mutateAsync,
    creating: createMutation.isPending,
    updating: updateMutation.isPending,
    deleting: deleteMutation.isPending,
  };
};
