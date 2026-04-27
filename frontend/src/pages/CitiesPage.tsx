import { useSearchParams } from 'react-router-dom';
import { CityCard } from '../features/cities/components/CityCard';
import { useCities } from '../features/cities/hooks/useCities';
import { EmptyState } from '../shared/components/EmptyState';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';
import { PaginationControls } from '../shared/components/PaginationControls';
import { SectionHeader } from '../shared/components/SectionHeader';

export const CitiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    page: Number(searchParams.get('page') || '1'),
    perPage: 9,
    search: searchParams.get('q') || undefined,
    region: searchParams.get('region') || undefined,
    tag: searchParams.get('tag') || undefined,
  };
  const { data: response, isLoading, isError } = useCities(filters);
  const cities = response?.data ?? [];

  return (
    <section>
      <SectionHeader
        title="Cidades"
        description="Conheça os principais destinos turísticos da região."
      />

      <form
        className="mb-8 grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const next = new URLSearchParams(searchParams);
          const entries = [
            ['q', String(formData.get('q') || '').trim()],
            ['region', String(formData.get('region') || '').trim()],
            ['tag', String(formData.get('tag') || '').trim()],
          ];

          entries.forEach(([key, value]) => {
            if (value) {
              next.set(key, value);
            } else {
              next.delete(key);
            }
          });

          next.set('page', '1');
          setSearchParams(next);
        }}
      >
        <input
          className="rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder-gray-500"
          defaultValue={filters.search ?? ''}
          name="q"
          placeholder="Buscar cidade, descrição ou resumo"
          type="text"
        />
        <input
          className="rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder-gray-500"
          defaultValue={filters.region ?? ''}
          name="region"
          placeholder="Filtrar por região"
          type="text"
        />
        <input
          className="rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder-gray-500"
          defaultValue={filters.tag ?? ''}
          name="tag"
          placeholder="Filtrar por tag"
          type="text"
        />
        <button className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white" type="submit">
          Aplicar
        </button>
      </form>

      {isLoading ? (
        <LoadingState label="Carregando cidades..." />
      ) : isError ? (
        <ErrorState
          title="Não foi possível carregar as cidades"
          description="Tente novamente mais tarde para ver os destinos publicados."
        />
      ) : cities?.length ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
          <PaginationControls
            currentPage={response?.meta.currentPage ?? 1}
            lastPage={response?.meta.lastPage ?? 1}
            onPageChange={(page) => {
              const next = new URLSearchParams(searchParams);
              next.set('page', String(page));
              setSearchParams(next);
            }}
          />
        </>
      ) : (
        <EmptyState
          title="Nenhuma cidade disponível"
          description="Ainda não há destinos publicados para listar."
        />
      )}
    </section>
  );
};
