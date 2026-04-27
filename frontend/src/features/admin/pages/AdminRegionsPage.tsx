import { PencilLine, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { RegionSummary } from '../../../shared/types/api';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import { RegionForm } from '../forms/RegionForm';
import { useAdminRegionMutations, useAdminRegions } from '../hooks/useAdminRegions';
import type { AdminFeedback } from '../types/admin';

export const AdminRegionsPage = () => {
  const { data: regions, isLoading, isError } = useAdminRegions();
  const { deleteRegion, deleting } = useAdminRegionMutations();
  const [selectedRegion, setSelectedRegion] = useState<RegionSummary | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);

  if (isLoading) {
    return <LoadingState label="Carregando base administrativa de regiões..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar o módulo de regiões"
        description="Verifique a autenticação administrativa e a disponibilidade da API."
      />
    );
  }

  const handleDelete = async (regionId: number) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta região?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteRegion(regionId);
      setFeedback({
        type: 'success',
        message: 'Região removida com sucesso.',
      });

      if (selectedRegion?.id === regionId) {
        setSelectedRegion(null);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Falha ao remover a região.'),
      });
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">Regiões</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Base territorial</h1>
            <p className="mt-2 text-sm text-slate-500">Cadastre e mantenha a divisão regional usada nas cidades.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
            onClick={() => {
              setSelectedRegion(null);
              setFeedback(null);
            }}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Nova região
          </button>
        </div>

        <div className="mt-6">
          <FormAlert feedback={feedback} />
        </div>

        <div className="mt-6">
          <RegionForm key={selectedRegion?.id ?? 'new-region'} region={selectedRegion} />
        </div>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">Lista</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Regiões cadastradas</h2>
          </div>
          <p className="text-sm text-slate-500">{regions?.length ?? 0} itens</p>
        </div>

        <div className="mt-6 space-y-4">
          {regions?.length ? (
            regions.map((region) => (
              <article key={region.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{region.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {region.citiesCount !== undefined ? `${region.citiesCount} cidades vinculadas` : 'Contagem indisponível'}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    Região
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
                    onClick={() => {
                      setSelectedRegion(region);
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
                      void handleDelete(region.id);
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
              title="Nenhuma região cadastrada"
              description="Use o formulário ao lado para iniciar a base regional."
            />
          )}
        </div>
      </section>
    </div>
  );
};
