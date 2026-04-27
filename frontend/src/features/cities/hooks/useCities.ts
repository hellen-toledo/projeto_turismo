import { useQuery } from '@tanstack/react-query';
import type { CityListParams } from '../../../shared/types/api';
import { getCities } from '../api/citiesApi';

export const useCities = (params: CityListParams = {}) => {
  return useQuery({
    queryKey: ['cities', params],
    queryFn: () => getCities(params),
  });
};
