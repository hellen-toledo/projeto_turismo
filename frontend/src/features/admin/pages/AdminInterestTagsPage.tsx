import { PencilLine, Plus, Search, Shapes, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { InterestTag } from '../../../shared/types/api';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import { AdminDataTable, AdminKpi, AdminPage, AdminSearchToolbar, AdminSurface, AdminSideSheet } from '../components/AdminUi';
import { adminButtonClassName, adminInputClassName } from '../components/adminUiStyles';
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
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredTags = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return tags ?? [];
    }

    return (tags ?? []).filter((tag) => `${tag.name} ${tag.slug}`.toLowerCase().includes(normalizedSearch));
  }, [search, tags]);

  if (isLoading) {
    return <LoadingState label="Carregando base administrativa de tags..." />;
  }

  if (isError) {
    return (
      <ErrorState
        description="Verifique a autenticação administrativa e a disponibilidade da API."
        title="Não foi possível carregar o módulo de tags"
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
        setIsFormOpen(false);
        setSelectedTag(null);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Falha ao remover a tag.'),
      });
    }
  };

  const handleOpenForm = (tag: InterestTag | null = null) => {
    setSelectedTag(tag);
    setFeedback(null);
    setIsFormOpen(true);
  };

  return (
    <AdminPage
      actions={
        <button
          className={adminButtonClassName.primary}
          onClick={() => handleOpenForm(null)}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Nova tag
        </button>
      }
      description="Mantenha o vocabulário editorial com uma leitura mais parecida com a referência, mas usando a mesma base real de tags do sistema."
      eyebrow="Taxonomia editorial"
      title="Tags"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminKpi hint="Total de tags cadastradas." icon={<Shapes className="h-5 w-5" />} label="Tags carregadas" value={tags?.length ?? 0} />
        <AdminKpi hint="Base disponível para classificação de cidades." icon={<Search className="h-5 w-5" />} label="Com uso em cidades" value={(tags ?? []).filter((tag) => (tag.citiesCount ?? 0) > 0).length} />
        <AdminKpi hint="Base disponível para classificação de eventos." icon={<PencilLine className="h-5 w-5" />} label="Com uso em eventos" value={(tags ?? []).filter((tag) => (tag.eventsCount ?? 0) > 0).length} />
      </section>

      <AdminSurface description="Busque por nome ou slug e revise o uso das tags na base." meta={`${filteredTags.length} itens`} title="Tags cadastradas">
        <AdminSearchToolbar
          searchInput={
            <input
              className={`${adminInputClassName} pl-10`}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Buscar por nome ou slug..."
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
            actions={(tag) => (
              <div className="flex justify-end gap-2">
                <button
                  className={adminButtonClassName.secondary}
                  onClick={() => handleOpenForm(tag)}
                  type="button"
                >
                  <PencilLine className="h-4 w-4" />
                  Editar
                </button>
                <button
                  className={adminButtonClassName.danger}
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
            )}
            columns={[
              {
                key: 'name',
                label: 'Tag',
                render: (tag) => <p className="font-semibold text-slate-950">{tag.name}</p>,
              },
              {
                key: 'slug',
                label: 'Slug',
                render: (tag) => tag.slug,
              },
              {
                key: 'usage',
                label: 'Uso',
                render: (tag) => getTagUsageLabel(tag),
              },
            ]}
            emptyState={
              <EmptyState
                description="Cadastre uma tag para ampliar a taxonomia editorial do portal."
                title="Nenhuma tag cadastrada"
              />
            }
            getRowKey={(tag) => tag.id}
            rows={filteredTags}
          />
        </div>
      </AdminSurface>

      <AdminSideSheet
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedTag ? 'Editar tag' : 'Nova tag'}
        description="Mantenha as tags usadas na curadoria de cidades e eventos."
      >
        <InterestTagForm key={selectedTag?.id ?? 'new-tag'} tag={selectedTag} onSuccess={() => setIsFormOpen(false)} />
      </AdminSideSheet>
    </AdminPage>
  );
};
