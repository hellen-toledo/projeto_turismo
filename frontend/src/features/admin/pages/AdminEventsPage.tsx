import { PencilLine, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Event } from '../../../shared/types/api';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import { EventForm } from '../forms/EventForm';
import { useAdminCities } from '../hooks/useAdminCities';
import { useAdminEvents, useAdminEventMutations, getEventDisplayStatus } from '../hooks/useAdminEvents';
import { useAdminInterestTags } from '../hooks/useAdminInterestTags';
import { mapCitiesToOptions, mapTagsToOptions, type AdminFeedback } from '../types/admin';

export const AdminEventsPage = () => {
  const { data: events, isLoading: loadingEvents, isError: eventsError } = useAdminEvents();
  const { data: cities, isLoading: loadingCities, isError: citiesError } = useAdminCities();
  const { data: tags, isLoading: loadingTags, isError: tagsError } = useAdminInterestTags();
  const { deleteEvent, deleting } = useAdminEventMutations();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);

  if (loadingEvents || loadingCities || loadingTags) {
    return <LoadingState label="Carregando base administrativa de eventos..." />;
  }

  if (eventsError || citiesError || tagsError) {
    return (
      <ErrorState
        title="Não foi possível carregar o módulo de eventos"
        description="Verifique a autenticação administrativa e a disponibilidade da API."
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

      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Falha ao remover o evento.'),
      });
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">Eventos</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Formulário base</h1>
            <p className="mt-2 text-sm text-slate-500">Fluxo inicial para criação, edição e curadoria.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
            onClick={() => {
              setSelectedEvent(null);
              setFeedback(null);
            }}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Novo evento
          </button>
        </div>

        <div className="mt-6">
          <FormAlert feedback={feedback} />
        </div>

        <div className="mt-6">
          <EventForm
            cityOptions={mapCitiesToOptions(cities)}
            event={selectedEvent}
            key={selectedEvent?.id ?? 'new-event'}
            tagOptions={mapTagsToOptions(tags)}
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">Lista</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Eventos cadastrados</h2>
          </div>
          <p className="text-sm text-slate-500">{events?.length ?? 0} itens</p>
        </div>

        <div className="mt-6 space-y-4">
          {events?.length ? (
            events.map((event) => (
              <article key={event.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{event.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{event.city?.name ?? 'Sem cidade'} • {new Date(event.startsAt).toLocaleString('pt-BR')}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {getEventDisplayStatus(event)}
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 text-sm text-slate-600">{event.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
                    onClick={() => {
                      setSelectedEvent(event);
                      setFeedback(null);
                    }}
                    type="button"
                  >
                    <PencilLine className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
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
              </article>
            ))
          ) : (
            <EmptyState
              title="Nenhum evento cadastrado"
              description="Use o formulário ao lado para iniciar a base operacional da agenda."
            />
          )}
        </div>
      </section>
    </div>
  );
};
