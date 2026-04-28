import { MapPinned, PencilLine, Plus, Trash2 } from 'lucide-react';
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
import { CityForm } from '../forms/CityForm';
import { getCityDisplayStatus, useAdminCities, useAdminCity, useAdminCityMutations } from '../hooks/useAdminCities';
import { useAdminInterestTags } from '../hooks/useAdminInterestTags';
import { useAdminRegions } from '../hooks/useAdminRegions';
import { mapRegionsToOptions, mapTagsToOptions, type AdminFeedback } from '../types/admin';

const publishedOptions = [
  { label: 'Todos os status', value: '' },
  { label: 'Publicados', value: '1' },
  { label: 'Rascunhos', value: '0' },
];

export const AdminCitiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    page: Number(searchParams.get('page') || '1'),
    perPage: 12,
    search: searchParams.get('q') || undefined,
    published: searchParams.get('published') === '1' ? true : searchParams.get('published') === '0' ? false : undefined,
  };
  const { data: citiesResponse, isLoading: loadingCities, isError: citiesError } = useAdminCities(filters);
  const { data: regions, isLoading: loadingRegions, isError: regionsError } = useAdminRegions();
  const { data: tags, isLoading: loadingTags, isError: tagsError } = useAdminInterestTags();
  const { deleteCity, deleting } = useAdminCityMutations();
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const { data: selectedCity, isLoading: loadingSelectedCity } = useAdminCity(selectedCityId);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const cities = citiesResponse?.data ?? [];
  const publishedCount = cities.filter((city) => city.isPublished).length;
  const withRegionCount = cities.filter((city) => city.region?.name).length;

  if (loadingCities || loadingRegions || loadingTags) {
    return <LoadingState label="Carregando base administrativa de cidades..." />;
  }

  if (citiesError || regionsError || tagsError) {
    return (
      <ErrorState
        description="Verifique a autenticação administrativa e a disponibilidade da API."
        title="Não foi possível carregar o módulo de cidades"
      />
    );
  }

  const handleDelete = async (cityId: number) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta cidade? Esta ação não pode ser desfeita.');

    if (!confirmed) {
      return;
    }

    try {
      await deleteCity(cityId);
      setFeedback({
        type: 'success',
        message: 'Cidade removida com sucesso.',
      });

      if (selectedCityId === cityId) {
        setSelectedCityId(null);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Falha ao remover a cidade.'),
      });
    }
  };

  return (
    <AdminPage
      actions={
        <button
          className={adminButtonClassName.primary}
          onClick={() => {
            setSelectedCityId(null);
            setFeedback(null);
          }}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Nova cidade
        </button>
      }
      description="Controle o catálogo de cidades, regiões associadas e conteúdo editorial do destino sem alterar o fluxo atual de desenvolvimento."
      eyebrow="Gestão territorial"
      title="Cidades"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminKpi hint="Total retornado na consulta atual." icon={<MapPinned className="h-5 w-5" />} label="Cidades carregadas" value={citiesResponse?.meta.total ?? 0} />
        <AdminKpi hint="Registros com publicação ativa no recorte carregado." icon={<Plus className="h-5 w-5" />} label="Publicadas" value={publishedCount} />
        <AdminKpi hint="Cidades já vinculadas a uma região." icon={<PencilLine className="h-5 w-5" />} label="Com região" value={withRegionCount} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminSurface
          description="Fluxo real para cadastro e edição do catálogo de cidades."
          meta={selectedCity ? 'Edição ativa' : 'Novo cadastro'}
          title="Nova cidade"
        >
          <FormAlert feedback={feedback} />

          <div className="mt-6">
            <CityForm
              city={selectedCity}
              isLoadingCity={loadingSelectedCity}
              key={selectedCity?.id ?? 'new-city'}
              regionOptions={mapRegionsToOptions(regions)}
              tagOptions={mapTagsToOptions(tags)}
            />
          </div>
        </AdminSurface>

        <AdminSurface
          description="Busque cidades por nome, resumo ou estado de publicação."
          meta={`${citiesResponse?.meta.total ?? 0} itens`}
          title="Listagem de cidades"
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const next = new URLSearchParams(searchParams);
              const q = String(formData.get('q') || '').trim();
              const published = String(formData.get('published') || '');

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

              next.set('page', '1');
              setSearchParams(next);
            }}
          >
            <AdminSearchToolbar
              filterInput={
                <div className="flex flex-wrap gap-2">
                  <AdminSelectFilter defaultValue={searchParams.get('published') ?? ''} name="published" options={publishedOptions} />
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
                  placeholder="Buscar por nome, resumo ou descrição..."
                  type="text"
                />
              }
            />
          </form>

          <div className="mt-6">
            <AdminDataTable
              actions={(city) => (
                <div className="flex justify-end gap-2">
                  <button
                    className={adminButtonClassName.secondary}
                    onClick={() => {
                      setSelectedCityId(city.id);
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
                      void handleDelete(city.id);
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
                  key: 'name',
                  label: 'Cidade',
                  render: (city) => (
                    <div>
                      <p className="font-semibold text-slate-950">{city.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{city.summary || 'Sem resumo curto'}</p>
                    </div>
                  ),
                },
                {
                  key: 'region',
                  label: 'Região',
                  render: (city) => city.region?.name ?? 'Sem região',
                },
                {
                  key: 'description',
                  label: 'Descrição',
                  render: (city) => (
                    <p className="line-clamp-2 max-w-xs text-sm text-slate-500">{city.description}</p>
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (city) => <AdminStatusBadge status={getCityDisplayStatus(city)} />,
                },
              ]}
              emptyState={
                <EmptyState
                  description="Tente outra busca ou cadastre uma cidade para ampliar a cobertura turística."
                  title="Nenhuma cidade encontrada"
                />
              }
              getRowKey={(city) => city.id}
              rows={cities}
            />
          </div>

          <PaginationControls
            currentPage={citiesResponse?.meta.currentPage ?? 1}
            lastPage={citiesResponse?.meta.lastPage ?? 1}
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
