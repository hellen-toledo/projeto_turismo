import { PencilLine, Plus, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import { AdminDataTable, AdminKpi, AdminPage, AdminSearchToolbar, AdminSelectFilter, AdminStatusBadge, AdminSurface } from '../components/AdminUi';
import { adminButtonClassName, adminInputClassName } from '../components/adminUiStyles';
import { EventForm } from '../forms/EventForm';
import { useAdminCities } from '../hooks/useAdminCities';
import { getEventDisplayStatus, useAdminEvent, useAdminEventMutations, useAdminEvents } from '../hooks/useAdminEvents';
import { useAdminInterestTags } from '../hooks/useAdminInterestTags';
import { mapCitiesToOptions, mapTagsToOptions, type AdminFeedback } from '../types/admin';

const publishedOptions = [
  { label: 'Todos os status', value: '' },
  { label: 'Publicados', value: '1' },
  { label: 'Rascunhos', value: '0' },
];

const featuredOptions = [
  { label: 'Todos os destaques', value: '' },
  { label: 'Somente destaque', value: '1' },
  { label: 'Sem destaque', value: '0' },
];

export const AdminEventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    page: Number(searchParams.get('page') || '1'),
    perPage: 12,
    search: searchParams.get('q') || undefined,
    published: searchParams.get('published') === '1' ? true : searchParams.get('published') === '0' ? false : undefined,
    featured: searchParams.get('featured') === '1' ? true : searchParams.get('featured') === '0' ? false : undefined,
  };
  const { data: eventsResponse, isLoading: loadingEvents, isError: eventsError } = useAdminEvents(filters);
  const { data: citiesResponse, isLoading: loadingCities, isError: citiesError } = useAdminCities({ perPage: 50 });
  const { data: tags, isLoading: loadingTags, isError: tagsError } = useAdminInterestTags();
  const { deleteEvent, deleting } = useAdminEventMutations();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const { data: selectedEvent, isLoading: loadingSelectedEvent } = useAdminEvent(selectedEventId);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const events = eventsResponse?.data ?? [];
  const cities = citiesResponse?.data ?? [];
  const featuredCount = events.filter((event) => event.isFeatured).length;
  const publishedCount = events.filter((event) => event.isPublished).length;

  if (loadingEvents || loadingCities || loadingTags) {
    return <LoadingState label="Carregando base administrativa de eventos..." />;
  }

  if (eventsError || citiesError || tagsError) {
    return (
      <ErrorState
        description="Verifique a autenticação administrativa e a disponibilidade da API."
        title="Não foi possível carregar o módulo de eventos"
      />
    );
  }

  const handleDelete = async (eventId: number) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.');

    if (!confirmed) {
      return;
    }

    try {
      await deleteEvent(eventId);
      setFeedback({
        type: 'success',
        message: 'Evento removido com sucesso.',
      });

      if (selectedEventId === eventId) {
        setSelectedEventId(null);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Falha ao remover o evento.'),
      });
    }
  };

  return (
    <AdminPage
      actions={
        <button
          className={adminButtonClassName.primary}
          onClick={() => {
            setSelectedEventId(null);
            setFeedback(null);
          }}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Novo evento
        </button>
      }
      description="Cadastre, revise e destaque eventos turísticos usando a mesma base de dados e formulários já existentes no projeto."
      eyebrow="Gestão de eventos"
      title="Eventos turísticos"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminKpi hint="Total exibido na consulta atual." icon={<Star className="h-5 w-5" />} label="Eventos carregados" value={eventsResponse?.meta.total ?? 0} />
        <AdminKpi hint="Registros em destaque na listagem atual." icon={<PencilLine className="h-5 w-5" />} label="Com destaque" value={featuredCount} />
        <AdminKpi hint="Publicações ativas neste recorte." icon={<Plus className="h-5 w-5" />} label="Publicados" value={publishedCount} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminSurface
          description="Fluxo real de criação, edição e curadoria da agenda."
          meta={selectedEvent ? 'Edição ativa' : 'Novo cadastro'}
          title="Novo evento"
        >
          <FormAlert feedback={feedback} />

          <div className="mt-6">
            <EventForm
              cityOptions={mapCitiesToOptions(cities)}
              event={selectedEvent}
              isLoadingEvent={loadingSelectedEvent}
              key={selectedEvent?.id ?? 'new-event'}
              tagOptions={mapTagsToOptions(tags)}
            />
          </div>
        </AdminSurface>

        <AdminSurface
          description="Filtre a agenda, revise os estados de publicação e abra um item para edição."
          meta={`${eventsResponse?.meta.total ?? 0} itens`}
          title="Listagem de eventos"
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const next = new URLSearchParams(searchParams);
              const q = String(formData.get('q') || '').trim();
              const published = String(formData.get('published') || '');
              const featured = String(formData.get('featured') || '');

              if (q) {
                next.set('q', q);
              } else {
                next.delete('q');
              }

              if (published) {
                next.set('published', published);
              } else {
                next.delete('published');
              }

              if (featured) {
                next.set('featured', featured);
              } else {
                next.delete('featured');
              }

              next.set('page', '1');
              setSearchParams(next);
            }}
          >
            <AdminSearchToolbar
              filterInput={
                <div className="flex flex-wrap gap-2">
                  <AdminSelectFilter defaultValue={searchParams.get('published') ?? ''} name="published" options={publishedOptions} />
                  <AdminSelectFilter defaultValue={searchParams.get('featured') ?? ''} name="featured" options={featuredOptions} />
                  <button className={adminButtonClassName.primary} type="submit">
                    Aplicar
                  </button>
                </div>
              }
              searchInput={
                <input
                  className={`${adminInputClassName} pl-10`}
                  defaultValue={filters.search ?? ''}
                  name="q"
                  placeholder="Buscar por título, cidade ou descrição..."
                  type="text"
                />
              }
            />
          </form>

          <div className="mt-6">
            <AdminDataTable
              actions={(event) => (
                <div className="flex justify-end gap-2">
                  <button
                    className={adminButtonClassName.secondary}
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setFeedback(null);
                    }}
                    type="button"
                  >
                    <PencilLine className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    className={adminButtonClassName.danger}
                    disabled={deleting}
                    onClick={() => {
                      void handleDelete(event.id);
                    }}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </div>
              )}
              columns={[
                {
                  key: 'title',
                  label: 'Evento',
                  render: (event) => (
                    <div>
                      <p className="font-semibold text-slate-950">{event.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{event.city?.name ?? 'Sem cidade'}</p>
                    </div>
                  ),
                },
                {
                  key: 'startsAt',
                  label: 'Data',
                  render: (event) => new Date(event.startsAt).toLocaleString('pt-BR'),
                },
                {
                  key: 'featured',
                  label: 'Destaque',
                  render: (event) => (event.isFeatured ? 'Sim' : 'Não'),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (event) => (
                    <div className="flex flex-wrap gap-2">
                      {getEventDisplayStatus(event).map((status) => (
                        <AdminStatusBadge key={`${event.id}-${status}`} status={status} />
                      ))}
                    </div>
                  ),
                },
              ]}
              emptyState={
                <EmptyState
                  description="Ajuste os filtros ou cadastre um novo evento para exibição no painel."
                  title="Nenhum evento encontrado"
                />
              }
              getRowKey={(event) => event.id}
              rows={events}
            />
          </div>

          <PaginationControls
            currentPage={eventsResponse?.meta.currentPage ?? 1}
            lastPage={eventsResponse?.meta.lastPage ?? 1}
            onPageChange={(page) => {
              const next = new URLSearchParams(searchParams);
              next.set('page', String(page));
              setSearchParams(next);
            }}
          />
        </AdminSurface>
      </div>
    </AdminPage>
  );
};
