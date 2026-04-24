import { useQuery } from '@tanstack/react-query';
import { getAdminInterestTags } from '../api/adminMetaApi';

export const useAdminInterestTags = () =>
  useQuery({
    queryKey: ['admin', 'interest-tags'],
    queryFn: getAdminInterestTags,
  });
