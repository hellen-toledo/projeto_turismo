import { PencilLine, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import { CityForm } from '../forms/CityForm';
import { getCityDisplayStatus, useAdminCities, useAdminCityMutations } from '../hooks/useAdminCities';
import { useAdminInterestTags } from '../hooks/useAdminInterestTags';
import { useAdminRegions } from '../hooks/useAdminRegions';
import { mapRegionsToOptions, mapTagsToOptions, type AdminFeedback } from '../types/admin';
import type { City } from '../../../shared/types/api';

export const AdminCitiesPage = () => {
  const { data: cities, isLoading: loadingCities, isError: citiesError } = useAdminCities();
  const { data: regions, isLoading: loadingRegions, isError: regionsError } = useAdminRegions();
  const { data: tags, isLoading: loadingTags, isError: tagsError } = useAdminInterestTags();
  const { deleteCity, deleting } = useAdminCityMutations();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);

  if (loadingCities || loadingRegions || loadingTags) {
    return <LoadingState label="Carregando base administrativa de cidades..." />;
  }

  if (citiesError || regionsError || tagsError) {
    return (
      <ErrorState
        title="Não foi possível carregar o módulo de cidades"
        description="Verifique a autenticação administrativa e a disponibilidade da API."
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

      if (selectedCity?.id === cityId) {
        setSelectedCity(null);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Falha ao remover a cidade.'),
      });
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">Cidades</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Formulário base</h1>
            <p className="mt-2 text-sm text-slate-500">Estrutura reutilizável para cadastro e edição.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
            onClick={() => {
              setSelectedCity(null);
              setFeedback(null);
            }}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Nova cidade
          </button>
        </div>

        <div className="mt-6">
          <FormAlert feedback={feedback} />
        </div>

        <div className="mt-6">
          <CityForm
            city={selectedCity}
            key={selectedCity?.id ?? 'new-city'}
            regionOptions={mapRegionsToOptions(regions)}
            tagOptions={mapTagsToOptions(tags)}
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">Lista</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Cidades cadastradas</h2>
          </div>
          <p className="text-sm text-slate-500">{cities?.length ?? 0} itens</p>
        </div>

        <div className="mt-6 space-y-4">
          {cities?.length ? (
            cities.map((city) => (
              <article key={city.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{city.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{city.region?.name ?? 'Sem região'}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {getCityDisplayStatus(city)}
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 text-sm text-slate-600">{city.summary || city.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
                    onClick={() => {
                      setSelectedCity(city);
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
                      void handleDelete(city.id);
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
              title="Nenhuma cidade cadastrada"
              description="Use o formulário ao lado para iniciar a operação administrativa."
            />
          )}
        </div>
      </section>
    </div>
  );
};
