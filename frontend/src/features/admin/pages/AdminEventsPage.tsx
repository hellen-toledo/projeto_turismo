import { PencilLine, Plus, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import { AdminDataTable, AdminPage, AdminSearchToolbar, AdminSelectFilter, AdminStatusBadge, AdminSurface, AdminSideSheet } from '../components/AdminUi';
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
  const [isFormOpen, setIsFormOpen] = useState(false);

  const events = eventsResponse?.data ?? [];
  const cities = citiesResponse?.data ?? [];
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
        setIsFormOpen(false);
        setSelectedEventId(null);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Falha ao remover o evento.'),
      });
    }
  };

  const handleOpenForm = (eventId: number | null = null) => {
    setSelectedEventId(eventId);
    setFeedback(null);
    setIsFormOpen(true);
  };

  return (
    <AdminPage
      actions={
        <button
          className={adminButtonClassName.primary}
          onClick={() => handleOpenForm(null)}
          type="button"
        >
          <Plus className="h-5 w-5" />
          Novo Evento
        </button>
      }
      description="Filtre a agenda, revise os estados de publicação e abra um item para edição."
      eyebrow="Gestão de eventos"
      title="Listagem de Eventos"
    >
      <AdminSurface
        meta={`${eventsResponse?.meta.total ?? 0} itens`}
        title="Eventos cadastrados"
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
          <FormAlert feedback={feedback} />
        </div>

        <div className="mt-6">
          <AdminDataTable
            actions={(event) => (
              <div className="flex justify-end gap-2">
                <button
                  className={adminButtonClassName.secondary}
                  onClick={() => handleOpenForm(event.id)}
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
                render: (event) => (
                  <div className="flex items-center gap-2 font-semibold text-teal-800">
                    {event.isFeatured ? <Star className="h-5 w-5 fill-teal-700 text-teal-700" /> : null}
                    {event.isFeatured ? 'SIM' : 'NÃO'}
                  </div>
                ),
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

      <AdminSideSheet
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedEventId ? 'Editar evento' : 'Novo evento'}
        description="Fluxo real de criação, edição e curadoria da agenda."
      >
        <EventForm
          cityOptions={mapCitiesToOptions(cities)}
          event={selectedEvent}
          isLoadingEvent={loadingSelectedEvent}
          key={selectedEvent?.id ?? 'new-event'}
          tagOptions={mapTagsToOptions(tags)}
          onSuccess={() => setIsFormOpen(false)}
        />
      </AdminSideSheet>
    </AdminPage>
  );
};
