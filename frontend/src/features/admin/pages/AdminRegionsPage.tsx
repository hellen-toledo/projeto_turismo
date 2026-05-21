import { MapPinned, PencilLine, Plus, Trash2, Waypoints } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { RegionSummary } from '../../../shared/types/api';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { useToast } from '../../../shared/components/toast/toastContext';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import { AdminConfirmDialog, AdminDataTable, AdminKpi, AdminPage, AdminSearchToolbar, AdminSurface, AdminSideSheet } from '../components/AdminUi';
import { adminButtonClassName, adminInputClassName } from '../components/adminUiStyles';
import { RegionForm } from '../forms/RegionForm';
import { useAdminRegionMutations, useAdminRegions } from '../hooks/useAdminRegions';
import type { AdminFeedback } from '../types/admin';

export const AdminRegionsPage = () => {
  const { data: regions, isLoading, isError } = useAdminRegions();
  const { deleteRegion, deleting } = useAdminRegionMutations();
  const [selectedRegion, setSelectedRegion] = useState<RegionSummary | null>(null);
  const [pendingDeleteRegionId, setPendingDeleteRegionId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { showToast } = useToast();

  const filteredRegions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return regions ?? [];
    }

    return (regions ?? []).filter((region) =>
      `${region.name} ${region.citiesCount ?? ''}`.toLowerCase().includes(normalizedSearch),
    );
  }, [regions, search]);

  if (isLoading) {
    return <LoadingState label="Carregando regiões..." />;
  }

  if (isError) {
    return (
      <ErrorState
        description="Tente novamente em instantes ou verifique seu acesso ao painel."
        title="Não foi possível carregar o módulo de regiões"
      />
    );
  }

  const handleDelete = async (regionId: number) => {
    try {
      await deleteRegion(regionId);
      setFeedback({
        type: 'success',
        message: 'Região removida com sucesso.',
      });
      showToast({
        type: 'success',
        title: 'Região removida com sucesso.',
      });
      setPendingDeleteRegionId(null);

      if (selectedRegion?.id === regionId) {
        setIsFormOpen(false);
        setSelectedRegion(null);
      }
    } catch (error) {
      const message = getApiErrorMessage(error, 'Falha ao remover a região.');
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

  const handleOpenForm = (region: RegionSummary | null = null) => {
    setSelectedRegion(region);
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
          Nova região
        </button>
      }
      description="Agrupe municípios em regiões turísticas para organizar o catálogo."
      eyebrow="Gestão regional"
      title="Regiões e rotas"
    >
      <section className="grid gap-4 md:grid-cols-2">
        <AdminKpi hint="Total de regiões disponíveis." icon={<Waypoints className="h-5 w-5" />} label="Regiões carregadas" value={regions?.length ?? 0} />
        <AdminKpi hint="Total de cidades vinculadas às regiões." icon={<MapPinned className="h-5 w-5" />} label="Cidades vinculadas" value={(regions ?? []).reduce((acc, region) => acc + (region.citiesCount ?? 0), 0)} />
      </section>

      <AdminSurface description="Busque regiões por nome e revise os vínculos existentes." meta={`${filteredRegions.length} itens`} title="Regiões cadastradas">
        <AdminSearchToolbar
          searchInput={
            <input
              className={`${adminInputClassName} pl-10`}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Buscar por nome da região..."
              type="text"
              value={search}
            />
          }
        />

        <div className="mt-6">
          <FormAlert feedback={feedback} />
        </div>

        <div className="mt-6">
          <AdminDataTable
            actions={(region) => (
              <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
                <button
                  className={adminButtonClassName.secondary}
                  onClick={() => handleOpenForm(region)}
                  type="button"
                >
                  <PencilLine className="h-4 w-4" />
                  Editar
                </button>
                <button
                  className={adminButtonClassName.danger}
                  disabled={deleting}
                  onClick={() => {
                    setPendingDeleteRegionId(region.id);
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
                label: 'Região',
                render: (region) => <p className="font-semibold text-slate-950">{region.name}</p>,
              },
              {
                key: 'citiesCount',
                label: 'Cidades',
                render: (region) => region.citiesCount ?? 'Indisponível',
              },
              {
                key: 'summary',
                label: 'Observação',
                render: (region) =>
                  region.citiesCount !== undefined ? `${region.citiesCount} cidades vinculadas` : 'Sem contagem informada',
              },
            ]}
            emptyState={
              <EmptyState
                description="Cadastre uma região ou rota turística para organizar melhor as cidades do portal."
                title="Nenhuma região cadastrada"
              />
            }
            getRowKey={(region) => region.id}
            rows={filteredRegions}
          />
        </div>
      </AdminSurface>

      <AdminSideSheet
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedRegion ? 'Editar região' : 'Nova região'}
        description="Cadastre e mantenha a divisão regional usada nas cidades."
      >
        <RegionForm key={selectedRegion?.id ?? 'new-region'} region={selectedRegion} onSuccess={() => setIsFormOpen(false)} />
      </AdminSideSheet>

      <AdminConfirmDialog
        description="Esta ação removerá a região cadastrada. Verifique os vínculos antes de confirmar."
        isConfirming={deleting}
        isOpen={pendingDeleteRegionId !== null}
        onClose={() => setPendingDeleteRegionId(null)}
        onConfirm={() => {
          if (pendingDeleteRegionId !== null) {
            void handleDelete(pendingDeleteRegionId);
          }
        }}
        title="Excluir região?"
      />
    </AdminPage>
  );
};
