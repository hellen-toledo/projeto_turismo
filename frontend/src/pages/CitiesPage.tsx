import { CityCard } from '../features/cities/components/CityCard';
import { useCities } from '../features/cities/hooks/useCities';
import { EmptyState } from '../shared/components/EmptyState';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';
import { SectionHeader } from '../shared/components/SectionHeader';

export const CitiesPage = () => {
  const { data: cities, isLoading, isError } = useCities();

  return (
    <section>
      <SectionHeader
        title="Cidades"
        description="Conheça os principais destinos turísticos da região."
      />

      {isLoading ? (
        <LoadingState label="Carregando cidades..." />
      ) : isError ? (
        <ErrorState
          title="Não foi possível carregar as cidades"
          description="Tente novamente mais tarde para ver os destinos publicados."
        />
      ) : cities?.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhuma cidade disponível"
          description="Ainda não há destinos publicados para listar."
        />
      )}
    </section>
  );
};
