import { CalendarRange, Eye, PencilLine, Plus, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { useToast } from '../../../shared/components/toast/toastContext';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import { AdminConfirmDialog, AdminDataTable, AdminKpi, AdminPage, AdminSearchToolbar, AdminSelectFilter, AdminStatusBadge, AdminSurface, AdminSideSheet } from '../components/AdminUi';
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
  const [pendingDeleteEventId, setPendingDeleteEventId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { showToast } = useToast();

  const events = eventsResponse?.data ?? [];
  const cities = citiesResponse?.data ?? [];
  const publishedCount = events.filter((event) => event.isPublished).length;
  const featuredCount = events.filter((event) => event.isFeatured).length;

  if (loadingEvents || loadingCities || loadingTags) {
    return <LoadingState label="Carregando eventos..." />;
  }

  if (eventsError || citiesError || tagsError) {
    return (
      <ErrorState
        description="Tente novamente em instantes ou verifique seu acesso ao painel."
        title="Não foi possível carregar o módulo de eventos"
      />
    );
  }

  const handleDelete = async (eventId: number) => {
    try {
      await deleteEvent(eventId);
      setFeedback({
        type: 'success',
        message: 'Evento removido com sucesso.',
      });
      showToast({
        type: 'success',
        title: 'Evento removido com sucesso.',
      });
      setPendingDeleteEventId(null);

      if (selectedEventId === eventId) {
        setIsFormOpen(false);
        setSelectedEventId(null);
      }
    } catch (error) {
      const message = getApiErrorMessage(error, 'Falha ao remover o evento.');
      setFeedback({
        type: 'error',
        message,
      });
      showToast({
        type: 'error',
        title: 'Não foi possível remover',
        message,
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
          className={adminButtonClassName.primaryAction}
          onClick={() => handleOpenForm(null)}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Novo evento
        </button>
      }
      description="Filtre a agenda, revise os estados de publicação e abra um item para edição."
      eyebrow="Gestão de eventos"
      title="Eventos"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminKpi hint="Total de eventos encontrados." icon={<CalendarRange className="h-5 w-5" />} label="Eventos carregados" value={eventsResponse?.meta.total ?? 0} />
        <AdminKpi hint="Eventos visíveis na agenda pública." icon={<Eye className="h-5 w-5" />} label="Publicados" value={publishedCount} />
        <AdminKpi hint="Eventos marcados para destaque." icon={<Star className="h-5 w-5" />} label="Em destaque" value={featuredCount} />
      </section>

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
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
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
              <div className="flex min-w-max items-center justify-end gap-2">
                <button
                  className={`${adminButtonClassName.secondary} min-w-24`}
                  onClick={() => handleOpenForm(event.id)}
                  type="button"
                >
                  <PencilLine className="h-4 w-4" />
                  Editar
                </button>
                <button
                  className={`${adminButtonClassName.danger} min-w-24`}
                  disabled={deleting}
                  onClick={() => {
                    setPendingDeleteEventId(event.id);
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
                  <div className="flex flex-wrap items-center gap-2">
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
        description="Cadastre, edite e publique eventos da agenda."
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

      <AdminConfirmDialog
        description="Esta ação não pode ser desfeita e removerá o evento da agenda administrativa."
        isConfirming={deleting}
        isOpen={pendingDeleteEventId !== null}
        onClose={() => setPendingDeleteEventId(null)}
        onConfirm={() => {
          if (pendingDeleteEventId !== null) {
            void handleDelete(pendingDeleteEventId);
          }
        }}
        title="Excluir evento?"
      />
    </AdminPage>
  );
};
