import { CalendarRange, MapPinned, PencilLine, Plus, Shapes, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { InterestTag } from '../../../shared/types/api';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { useToast } from '../../../shared/components/toast/toastContext';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import { AdminConfirmDialog, AdminDataTable, AdminKpi, AdminPage, AdminSearchToolbar, AdminSurface, AdminSideSheet } from '../components/AdminUi';
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

  return 'Sem uso informado';
};

export const AdminInterestTagsPage = () => {
  const { data: tags, isLoading, isError } = useAdminInterestTags();
  const { deleteInterestTag, deleting } = useAdminInterestTagMutations();
  const [selectedTag, setSelectedTag] = useState<InterestTag | null>(null);
  const [pendingDeleteTagId, setPendingDeleteTagId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { showToast } = useToast();

  const filteredTags = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return tags ?? [];
    }

    return (tags ?? []).filter((tag) => `${tag.name} ${tag.slug}`.toLowerCase().includes(normalizedSearch));
  }, [search, tags]);

  if (isLoading) {
    return <LoadingState label="Carregando tags..." />;
  }

  if (isError) {
    return (
      <ErrorState
        description="Tente novamente em instantes ou verifique seu acesso ao painel."
        title="Não foi possível carregar o módulo de tags"
      />
    );
  }

  const handleDelete = async (tagId: number) => {
    try {
      await deleteInterestTag(tagId);
      setFeedback({
        type: 'success',
        message: 'Tag removida com sucesso.',
      });
      showToast({
        type: 'success',
        title: 'Tag removida com sucesso.',
      });
      setPendingDeleteTagId(null);

      if (selectedTag?.id === tagId) {
        setIsFormOpen(false);
        setSelectedTag(null);
      }
    } catch (error) {
      const message = getApiErrorMessage(error, 'Falha ao remover a tag.');
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

  const handleOpenForm = (tag: InterestTag | null = null) => {
    setSelectedTag(tag);
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
          Nova tag
        </button>
      }
      description="Organize os temas usados para classificar cidades e eventos."
      eyebrow="Taxonomia editorial"
      title="Tags"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminKpi hint="Total de tags cadastradas." icon={<Shapes className="h-5 w-5" />} label="Tags carregadas" value={tags?.length ?? 0} />
        <AdminKpi hint="Tags usadas para classificar cidades." icon={<MapPinned className="h-5 w-5" />} label="Com uso em cidades" value={(tags ?? []).filter((tag) => (tag.citiesCount ?? 0) > 0).length} />
        <AdminKpi hint="Tags usadas para classificar eventos." icon={<CalendarRange className="h-5 w-5" />} label="Com uso em eventos" value={(tags ?? []).filter((tag) => (tag.eventsCount ?? 0) > 0).length} />
      </section>

      <AdminSurface description="Busque por nome ou endereço amigável e revise o uso das tags." meta={`${filteredTags.length} itens`} title="Tags cadastradas">
        <AdminSearchToolbar
          searchInput={
            <input
              className={`${adminInputClassName} pl-10`}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Buscar por nome ou endereço..."
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
              <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
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
                    setPendingDeleteTagId(tag.id);
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
                label: 'Endereço',
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

      <AdminConfirmDialog
        description="Esta ação removerá a tag cadastrada e poderá afetar classificações associadas."
        isConfirming={deleting}
        isOpen={pendingDeleteTagId !== null}
        onClose={() => setPendingDeleteTagId(null)}
        onConfirm={() => {
          if (pendingDeleteTagId !== null) {
            void handleDelete(pendingDeleteTagId);
          }
        }}
        title="Excluir tag?"
      />
    </AdminPage>
  );
};
