import { useQuery } from '@tanstack/react-query';
import { getEventos } from '../services/api';

export const useEventos = () => {
  return useQuery({
    queryKey: ['eventos'],
    queryFn: getEventos,
  });
};