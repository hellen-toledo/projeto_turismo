import { useSearchParams } from 'react-router-dom';
import { EventCard } from '../features/events/components/EventCard';
import { useEvents } from '../features/events/hooks/useEvents';
import { EmptyState } from '../shared/components/EmptyState';
import { ErrorState } from '../shared/components/ErrorState';
import { LoadingState } from '../shared/components/LoadingState';
import { PaginationControls } from '../shared/components/PaginationControls';
import { SectionHeader } from '../shared/components/SectionHeader';

export const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    page: Number(searchParams.get('page') || '1'),
    perPage: 9,
    search: searchParams.get('q') || undefined,
    city: searchParams.get('city') || undefined,
    tag: searchParams.get('tag') || undefined,
    featured: searchParams.get('featured') === '1' ? true : undefined,
    future: searchParams.get('future') === '0' ? undefined : true,
  };
  const { data: response, isLoading, isError } = useEvents(filters);
  const events = response?.data ?? [];

  return (
    <section>
      <SectionHeader
        title="Eventos"
        description="Acompanhe a agenda cultural e turística do Norte Goiano."
      />

      <form
        className="mb-8 grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto_auto_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const next = new URLSearchParams(searchParams);
          const entries = [
            ['q', String(formData.get('q') || '').trim()],
            ['city', String(formData.get('city') || '').trim()],
            ['tag', String(formData.get('tag') || '').trim()],
          ];

          entries.forEach(([key, value]) => {
            if (value) {
              next.set(key, value);
            } else {
              next.delete(key);
            }
          });

          if (formData.get('featured') === 'on') {
            next.set('featured', '1');
          } else {
            next.delete('featured');
          }

          if (formData.get('future') === 'on') {
            next.delete('future');
          } else {
            next.set('future', '0');
          }

          next.set('page', '1');
          setSearchParams(next);
        }}
      >
        <input
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
          defaultValue={filters.search ?? ''}
          name="q"
          placeholder="Buscar evento ou descrição"
          type="text"
        />
        <input
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
          defaultValue={filters.city ?? ''}
          name="city"
          placeholder="Filtrar por cidade"
          type="text"
        />
        <input
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
          defaultValue={filters.tag ?? ''}
          name="tag"
          placeholder="Filtrar por tag"
          type="text"
        />
        <label className="flex items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-gray-300">
          <input defaultChecked={filters.featured === true} name="featured" type="checkbox" />
          Destaques
        </label>
        <label className="flex items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-gray-300">
          <input defaultChecked={searchParams.get('future') !== '0'} name="future" type="checkbox" />
          Futuros
        </label>
        <button className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white" type="submit">
          Aplicar
        </button>
      </form>

      {isLoading ? (
        <LoadingState label="Carregando eventos..." />
      ) : isError ? (
        <ErrorState
          title="Não foi possível carregar os eventos"
          description="Tente novamente mais tarde para consultar a agenda."
        />
      ) : events?.length ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
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
          title="Nenhum evento disponível"
          description="A agenda será exibida aqui quando houver eventos cadastrados."
        />
      )}
    </section>
  );
};
