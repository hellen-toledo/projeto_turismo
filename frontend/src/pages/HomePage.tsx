import { CityCard } from '../features/cities/components/CityCard';
import { useCities } from '../features/cities/hooks/useCities';
import { EventCard } from '../features/events/components/EventCard';
import { useEvents } from '../features/events/hooks/useEvents';
import { HeroSection } from '../features/home/components/HeroSection';
import { EmptyState } from '../shared/components/EmptyState';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';
import { SectionHeader } from '../shared/components/SectionHeader';

export const HomePage = () => {
  const { data: cities, isLoading: loadingCities, isError: citiesError } = useCities();
  const { data: events, isLoading: loadingEvents, isError: eventsError } = useEvents();

  const featuredCities = cities?.slice(0, 4) ?? [];
  const upcomingEvents = events?.slice(0, 3) ?? [];

  return (
    <>
      <HeroSection />

      <section className="mb-20">
        <SectionHeader
          title="Cidades Incríveis"
          description="Explore destinos divididos por macrorregiões do Norte Goiano."
          actionLabel="Ver todas as cidades"
          actionTo="/cidades"
        />

        {loadingCities ? (
          <LoadingState label="Carregando destinos..." />
        ) : citiesError ? (
          <ErrorState
            title="Não foi possível carregar as cidades"
            description="Tente novamente em instantes para visualizar os destinos disponíveis."
            actionLabel="Ver eventos"
            actionTo="/eventos"
          />
        ) : featuredCities.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma cidade publicada"
            description="Assim que novos destinos forem cadastrados, eles aparecerão aqui."
          />
        )}
      </section>

      <section className="mb-20">
        <div className="rounded-3xl bg-green-50 p-8 md:p-12">
          <SectionHeader
            title="Próximos Eventos"
            actionLabel="Ver agenda completa"
            actionTo="/eventos"
          />

          {loadingEvents ? (
            <LoadingState label="Carregando eventos do Norte Goiano..." />
          ) : eventsError ? (
            <ErrorState
              title="Não foi possível carregar os eventos"
              description="A agenda está temporariamente indisponível. Tente novamente mais tarde."
              actionLabel="Ver cidades"
              actionTo="/cidades"
            />
          ) : upcomingEvents.length ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum evento disponível"
              description="A agenda será exibida aqui quando houver eventos publicados."
            />
          )}
        </div>
      </section>

      <section className="mb-12 rounded-3xl border border-gray-100 bg-white py-16 text-center shadow-sm">
        <h2 className="mb-4 text-3xl font-bold text-gray-800">Guia do Visitante</h2>
        <p className="text-lg font-medium italic text-green-700">
          Em breve: dicas de hospedagem, gastronomia local e muito mais.
        </p>
      </section>
    </>
  );
};
