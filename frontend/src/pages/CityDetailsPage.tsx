import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { CityDetailsContent } from '../features/cities/components/CityDetailsContent';
import { useCity } from '../features/cities/hooks/useCity';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';

export const CityDetailsPage = () => {
  const { idOrSlug = '' } = useParams<{ idOrSlug: string }>();
  const { data: city, isLoading, isError, error } = useCity(idOrSlug);

  if (isLoading) {
    return <LoadingState label="Carregando detalhes da cidade..." />;
  }

  if (isError || !city) {
    const status = error instanceof AxiosError ? error.response?.status : undefined;

    return (
      <ErrorState
        title={status === 404 ? 'Cidade não encontrada' : 'Erro ao carregar a cidade'}
        description={
          status === 404
            ? 'O destino solicitado não existe ou não está disponível.'
            : 'Tente novamente mais tarde para visualizar os detalhes da cidade.'
        }
        actionLabel="Ver todas as cidades"
        actionTo="/cidades"
      />
    );
  }

  return <CityDetailsContent city={city} />;
};
