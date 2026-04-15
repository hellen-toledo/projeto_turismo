import { useQuery } from '@tanstack/react-query';
import { getCidadeById } from '../services/api';

export const useCidade = (id: string) => {
  return useQuery({
    queryKey: ['cidade', id],
    queryFn: () => getCidadeById(id),
    enabled: !!id, // Só executa se houver um ID
  });
};