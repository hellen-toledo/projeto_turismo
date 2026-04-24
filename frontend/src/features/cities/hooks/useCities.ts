import { useQuery } from '@tanstack/react-query';
import { getCities } from '../api/citiesApi';

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });
};
