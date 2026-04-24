import { EventCard } from '../features/events/components/EventCard';
import { useEvents } from '../features/events/hooks/useEvents';
import { EmptyState } from '../shared/components/EmptyState';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';
import { SectionHeader } from '../shared/components/SectionHeader';

export const EventsPage = () => {
  const { data: events, isLoading, isError } = useEvents();

  return (
    <section>
      <SectionHeader
        title="Eventos"
        description="Acompanhe a agenda cultural e turística do Norte Goiano."
      />

      {isLoading ? (
        <LoadingState label="Carregando eventos..." />
      ) : isError ? (
        <ErrorState
          title="Não foi possível carregar os eventos"
          description="Tente novamente mais tarde para consultar a agenda."
        />
      ) : events?.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum evento disponível"
          description="A agenda será exibida aqui quando houver eventos cadastrados."
        />
      )}
    </section>
  );
};
