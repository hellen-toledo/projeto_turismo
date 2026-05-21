import { Eye, MapPinned, PencilLine, Plus, Trash2, Waypoints } from 'lucide-react';
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
  const [pendingDeleteCityId, setPendingDeleteCityId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { showToast } = useToast();
  
  const cities = citiesResponse?.data ?? [];
  const publishedCount = cities.filter((city) => city.isPublished).length;
  const withRegionCount = cities.filter((city) => city.region?.name).length;

  if (loadingCities || loadingRegions || loadingTags) {
    return <LoadingState label="Carregando cidades..." />;
  }

  if (citiesError || regionsError || tagsError) {
    return (
      <ErrorState
        description="Tente novamente em instantes ou verifique seu acesso ao painel."
        title="Não foi possível carregar o módulo de cidades"
      />
    );
  }

  const handleDelete = async (cityId: number) => {
    try {
      await deleteCity(cityId);
      setFeedback({
        type: 'success',
        message: 'Cidade removida com sucesso.',
      });
      showToast({
        type: 'success',
        title: 'Cidade removida com sucesso.',
      });
      setPendingDeleteCityId(null);

      if (selectedCityId === cityId) {
        setIsFormOpen(false);
        setSelectedCityId(null);
      }
    } catch (error) {
      const message = getApiErrorMessage(error, 'Falha ao remover a cidade.');
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

  const handleOpenForm = (cityId: number | null = null) => {
    setSelectedCityId(cityId);
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
          Nova cidade
        </button>
      }
      description="Controle cidades, regiões associadas e conteúdo editorial dos destinos."
      eyebrow="Gestão territorial"
      title="Cidades"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminKpi hint="Total de cidades encontradas." icon={<MapPinned className="h-5 w-5" />} label="Cidades carregadas" value={citiesResponse?.meta.total ?? 0} />
        <AdminKpi hint="Cidades visíveis no portal público." icon={<Eye className="h-5 w-5" />} label="Publicadas" value={publishedCount} />
        <AdminKpi hint="Cidades já vinculadas a uma região." icon={<Waypoints className="h-5 w-5" />} label="Com região" value={withRegionCount} />
      </section>

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
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
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
          <FormAlert feedback={feedback} />
        </div>

        <div className="mt-6">
          <AdminDataTable
            actions={(city) => (
              <div className="flex min-w-max items-center justify-end gap-2">
                <button
                  className={`${adminButtonClassName.secondary} min-w-24`}
                  onClick={() => handleOpenForm(city.id)}
                  type="button"
                >
                  <PencilLine className="h-4 w-4" />
                  Editar
                </button>
                <button
                  className={`${adminButtonClassName.danger} min-w-24`}
                  disabled={deleting}
                  onClick={() => {
                    setPendingDeleteCityId(city.id);
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

      <AdminSideSheet
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedCityId ? 'Editar cidade' : 'Nova cidade'}
        description="Cadastre e edite as informações da cidade."
      >
        <CityForm
          city={selectedCity}
          isLoadingCity={loadingSelectedCity}
          key={selectedCity?.id ?? 'new-city'}
          regionOptions={mapRegionsToOptions(regions)}
          tagOptions={mapTagsToOptions(tags)}
          onSuccess={() => setIsFormOpen(false)}
        />
      </AdminSideSheet>

      <AdminConfirmDialog
        description="Esta ação não pode ser desfeita e removerá a cidade do catálogo administrativo."
        isConfirming={deleting}
        isOpen={pendingDeleteCityId !== null}
        onClose={() => setPendingDeleteCityId(null)}
        onConfirm={() => {
          if (pendingDeleteCityId !== null) {
            void handleDelete(pendingDeleteCityId);
          }
        }}
        title="Excluir cidade?"
      />
    </AdminPage>
  );
};
