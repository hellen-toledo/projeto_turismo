import { CalendarRange, Clock3, Images, MapPinned, Shapes, Shield, Waypoints } from 'lucide-react';
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
        description="Verifique a autenticação administrativa, o backend e a disponibilidade da API."
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
          <Link className={adminButtonClassName.primary} to="/admin/events">
            Novo fluxo de agenda
          </Link>
        </>
      }
      description="Acompanhe publicações, organize cidades e regiões e mantenha a vitrine turística sempre atualizada sem sair da área administrativa."
      eyebrow="Administração turística"
      title="Painel do Turismo Norte-Goiano"
    >
      {isStillLoadingAny ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Parte dos dados ainda está carregando. Se isso persistir, verifique se a API administrativa está respondendo.
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminKpi hint={`${publishedEvents} publicados entre os registros carregados agora.`} icon={<CalendarRange className="h-5 w-5" />} label="Eventos cadastrados" value={totalEvents} />
        <AdminKpi hint="Municípios disponíveis no catálogo administrativo." icon={<MapPinned className="h-5 w-5" />} label="Cidades mapeadas" value={totalCities} />
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
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-base font-semibold text-slate-950">Nenhum evento em destaque</p>
                <p className="mt-2 text-sm text-slate-500">Marque eventos como destaque para que apareçam nesta seção.</p>
              </div>
            }
            getRowKey={(event) => event.id}
            rows={highlightedEvents ? featuredEvents : events.slice(0, 3)}
          />
        </AdminSurface>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-2xl bg-slate-50 p-3 text-emerald-700 w-fit">
            <Images className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">Biblioteca visual</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Centralize capas, galerias e mídia reutilizável para manter consistência visual na operação editorial.</p>
          <Link className="mt-5 inline-flex text-sm font-semibold text-emerald-700" to="/admin/media">
            Abrir mídia
          </Link>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-2xl bg-slate-50 p-3 text-emerald-700 w-fit">
            <Clock3 className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">Curadoria contínua</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Use cidades, eventos, regiões e tags no mesmo fluxo para reduzir retrabalho e manter contexto entre módulos.</p>
          <Link className="mt-5 inline-flex text-sm font-semibold text-emerald-700" to="/admin/events">
            Revisar agenda
          </Link>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 text-emerald-700" />
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Base pronta para crescer</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">O visual foi aproximado da referência sem quebrar a separação atual por rotas, hooks, actions e formulários reais do projeto.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
};
