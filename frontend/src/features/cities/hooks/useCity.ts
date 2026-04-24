import { useQuery } from '@tanstack/react-query';
import { getCityByIdOrSlug } from '../api/citiesApi';

export const useCity = (idOrSlug: string) => {
  return useQuery({
    queryKey: ['city', idOrSlug],
    queryFn: () => getCityByIdOrSlug(idOrSlug),
    enabled: !!idOrSlug,
  });
};
