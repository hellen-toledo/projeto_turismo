import { PencilLine, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { InterestTag } from '../../../shared/types/api';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import { InterestTagForm } from '../forms/InterestTagForm';
import { useAdminInterestTagMutations, useAdminInterestTags } from '../hooks/useAdminInterestTags';
import type { AdminFeedback } from '../types/admin';

const getTagUsageLabel = (tag: InterestTag) => {
  if (typeof tag.usageCount === 'number') {
    return `${tag.usageCount} usos cadastrados`;
  }

  if (typeof tag.citiesCount === 'number' || typeof tag.eventsCount === 'number') {
    return `${tag.citiesCount ?? 0} cidades • ${tag.eventsCount ?? 0} eventos`;
  }

  return 'Uso não informado pela API';
};

export const AdminInterestTagsPage = () => {
  const { data: tags, isLoading, isError } = useAdminInterestTags();
  const { deleteInterestTag, deleting } = useAdminInterestTagMutations();
  const [selectedTag, setSelectedTag] = useState<InterestTag | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);

  if (isLoading) {
    return <LoadingState label="Carregando base administrativa de tags..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar o módulo de tags"
        description="Verifique a autenticação administrativa e a disponibilidade da API."
      />
    );
  }

  const handleDelete = async (tagId: number) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta tag?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteInterestTag(tagId);
      setFeedback({
        type: 'success',
        message: 'Tag removida com sucesso.',
      });

      if (selectedTag?.id === tagId) {
        setSelectedTag(null);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Falha ao remover a tag.'),
      });
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">Tags</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Vocabulário de interesse</h1>
            <p className="mt-2 text-sm text-slate-500">Mantenha as tags usadas na curadoria de cidades e eventos.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
            onClick={() => {
              setSelectedTag(null);
              setFeedback(null);
            }}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Nova tag
          </button>
        </div>

        <div className="mt-6">
          <FormAlert feedback={feedback} />
        </div>

        <div className="mt-6">
          <InterestTagForm key={selectedTag?.id ?? 'new-tag'} tag={selectedTag} />
        </div>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">Lista</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Tags cadastradas</h2>
          </div>
          <p className="text-sm text-slate-500">{tags?.length ?? 0} itens</p>
        </div>

        <div className="mt-6 space-y-4">
          {tags?.length ? (
            tags.map((tag) => (
              <article key={tag.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{tag.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{tag.slug}</p>
                    <p className="mt-2 text-sm text-slate-500">{getTagUsageLabel(tag)}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    Tag
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
                    onClick={() => {
                      setSelectedTag(tag);
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
                      void handleDelete(tag.id);
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
              title="Nenhuma tag cadastrada"
              description="Use o formulário ao lado para iniciar a taxonomia editorial."
            />
          )}
        </div>
      </section>
    </div>
  );
};
