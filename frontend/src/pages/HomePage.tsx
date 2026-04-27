import { CityCard } from '../features/cities/components/CityCard';
import { useCities } from '../features/cities/hooks/useCities';
import { EventCard } from '../features/events/components/EventCard';
import { useEvents } from '../features/events/hooks/useEvents';
import { HeroSection } from '../features/home/components/HeroSection';
import { EmptyState } from '../shared/components/EmptyState';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';
import { SectionHeader } from '../shared/components/SectionHeader';
import type { City } from '../shared/types/api';

export const HomePage = () => {
  const { data: citiesResponse, isLoading: loadingCities, isError: citiesError } = useCities({ perPage: 12 });
  const { data: eventsResponse, isLoading: loadingEvents, isError: eventsError } = useEvents({ perPage: 3, future: true });

  const cities = citiesResponse?.data ?? [];
  const upcomingEvents = eventsResponse?.data ?? [];

  // Group cities by region
  const citiesByRegion = cities.reduce((acc, city) => {
    const regionName = city.region?.name ?? 'Outras Regiões';
    if (!acc[regionName]) {
      acc[regionName] = [];
    }
    acc[regionName].push(city);
    return acc;
  }, {} as Record<string, City[]>);

  return (
    <>
      <HeroSection />

      <section className="mb-20">
        <SectionHeader
          title="Destinos por Região"
          description="Explore as cidades divididas pelas principais rotas turísticas."
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
        ) : cities.length ? (
          <div className="space-y-12">
            {Object.entries(citiesByRegion).map(([region, regionCities]) => (
              <div key={region}>
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-2">{region}</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {regionCities.map((city) => (
                    <CityCard key={city.id} city={city} />
                  ))}
                </div>
              </div>
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
        <div className="rounded-3xl border border-gray-800 bg-gray-900/50 p-8 md:p-12 shadow-sm">
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
    </>
  );
};
