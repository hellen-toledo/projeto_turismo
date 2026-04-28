import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { EventDetailsContent } from '../features/events/components/EventDetailsContent';
import { useEvent } from '../features/events/hooks/useEvents';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';

export const EventDetailsPage = () => {
  const { idOrSlug = '' } = useParams<{ idOrSlug: string }>();
  const { data: event, isLoading, isError, error } = useEvent(idOrSlug);

  if (isLoading) {
    return <LoadingState label="Carregando detalhes do evento..." />;
  }

  if (isError || !event) {
    const status = error instanceof AxiosError ? error.response?.status : undefined;

    return (
      <ErrorState
        title={status === 404 ? 'Evento não encontrado' : 'Erro ao carregar o evento'}
        description={
          status === 404
            ? 'O evento solicitado não existe ou não está disponível.'
            : 'Tente novamente mais tarde para visualizar os detalhes do evento.'
        }
        actionLabel="Ver todos os eventos"
        actionTo="/eventos"
      />
    );
  }

  return <EventDetailsContent event={event} />;
};
