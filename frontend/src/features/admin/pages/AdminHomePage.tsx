import { CalendarRange, MapPinned, Shapes, Waypoints } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ErrorState } from '../../../shared/components/ErrorState';
import { AdminDataTable, AdminKpi, AdminPage, AdminStatusBadge, AdminSurface } from '../components/AdminUi';
import { adminButtonClassName } from '../components/adminUiStyles';
import { useAdminCities } from '../hooks/useAdminCities';
import { useAdminEvents } from '../hooks/useAdminEvents';
import { useAdminInterestTags } from '../hooks/useAdminInterestTags';
import { useAdminRegions } from '../hooks/useAdminRegions';

export const AdminHomePage = () => {
  const { data: eventsResponse, isLoading: loadingEvents, isError: eventsError } = useAdminEvents({ perPage: 6 });
  const { data: featuredEventsResponse, isLoading: loadingFeatured, isError: featuredError } = useAdminEvents({ perPage: 3, featured: true });
  const { data: citiesResponse, isLoading: loadingCities, isError: citiesError } = useAdminCities({ perPage: 1 });
  const { data: regions, isLoading: loadingRegions, isError: regionsError } = useAdminRegions();
  const { data: tags, isLoading: loadingTags, isError: tagsError } = useAdminInterestTags();

  if (eventsError && featuredError && citiesError && regionsError && tagsError) {
    return (
      <ErrorState
        description="Tente novamente em instantes ou verifique seu acesso ao painel."
        title="Não foi possível carregar a visão geral"
      />
    );
  }

  const events = eventsResponse?.data ?? [];
  const featuredEvents = featuredEventsResponse?.data ?? [];
  const totalEvents = eventsResponse?.meta.total ?? 0;
  const totalCities = citiesResponse?.meta.total ?? 0;
  const totalRegions = regions?.length ?? 0;
  const totalTags = tags?.length ?? 0;
  const publishedEvents = events.filter((event) => event.isPublished).length;
  const highlightedEvents = featuredEvents.length;
  const isStillLoadingAny = loadingEvents || loadingFeatured || loadingCities || loadingRegions || loadingTags;

  return (
    <AdminPage
      actions={
        <>
          <Link className={adminButtonClassName.secondary} to="/admin/cities">
            Abrir cidades
          </Link>
          <Link className={adminButtonClassName.primaryAction} to="/admin/events">
            Novo evento
          </Link>
        </>
      }
      description="Acompanhe publicações, organize cidades e regiões e mantenha a vitrine turística sempre atualizada sem sair da área administrativa."
      eyebrow="Administração turística"
      title="Painel do Turismo Norte-Goiano"
    >
      {isStillLoadingAny ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Algumas informações ainda estão carregando.
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminKpi hint={`${publishedEvents} publicados entre os registros carregados agora.`} icon={<CalendarRange className="h-5 w-5" />} label="Eventos cadastrados" value={totalEvents} />
        <AdminKpi hint="Municípios disponíveis no catálogo." icon={<MapPinned className="h-5 w-5" />} label="Cidades mapeadas" value={totalCities} />
        <AdminKpi hint="Rotas, regiões e agrupamentos territoriais ativos." icon={<Waypoints className="h-5 w-5" />} label="Regiões ativas" value={totalRegions} />
        <AdminKpi hint="Vocabulário editorial disponível para classificação." icon={<Shapes className="h-5 w-5" />} label="Tags cadastradas" value={totalTags} />
      </section>

      <div className="grid gap-5">
        <AdminSurface
          actions={
            <Link className={adminButtonClassName.secondary} to="/admin/events">
              Ver agenda
            </Link>
          }
          description="Conteúdos que aparecem com prioridade e merecem revisão frequente."
          title="Eventos em destaque"
        >
          <AdminDataTable
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
                render: (event) => new Date(event.startsAt).toLocaleDateString('pt-BR'),
              },
              {
                key: 'status',
                label: 'Status',
                render: (event) => <AdminStatusBadge status={event.isPublished ? 'Publicado' : 'Rascunho'} />,
              },
            ]}
            emptyState={
              <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-base font-semibold text-slate-950">Nenhum evento em destaque</p>
                <p className="mt-2 text-sm text-slate-500">Marque eventos como destaque para que apareçam nesta seção.</p>
              </div>
            }
            getRowKey={(event) => event.id}
            rows={highlightedEvents ? featuredEvents : events.slice(0, 3)}
          />
        </AdminSurface>
      </div>
    </AdminPage>
  );
};
