import { useQuery } from '@tanstack/react-query';
import { getAdminRegions } from '../api/adminMetaApi';

export const useAdminRegions = () =>
  useQuery({
    queryKey: ['admin', 'regions'],
    queryFn: getAdminRegions,
  });
