import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../test/utils';
import { AdminInterestTagsPage } from '../AdminInterestTagsPage';

const { mockDeleteInterestTag, mockUseAdminInterestTags } = vi.hoisted(() => ({
  mockDeleteInterestTag: vi.fn(),
  mockUseAdminInterestTags: vi.fn(),
}));

vi.mock('../../hooks/useAdminInterestTags', () => ({
  useAdminInterestTags: () => mockUseAdminInterestTags(),
  useAdminInterestTagMutations: () => ({
    deleteInterestTag: mockDeleteInterestTag,
    deleting: false,
  }),
}));

vi.mock('../../forms/InterestTagForm', () => ({
  InterestTagForm: () => <div>InterestTagForm mockado</div>,
}));

describe('AdminInterestTagsPage', () => {
  beforeEach(() => {
    mockDeleteInterestTag.mockReset();
    mockDeleteInterestTag.mockResolvedValue(undefined);
    mockUseAdminInterestTags.mockReset();
  });

  it('renderiza a listagem de tags', () => {
    mockUseAdminInterestTags.mockReturnValue({
      data: [{ id: 2, name: 'Ecoturismo', slug: 'ecoturismo' }],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<AdminInterestTagsPage />);

    expect(screen.getByText('Tags cadastradas')).toBeInTheDocument();
    expect(screen.getByText('Ecoturismo')).toBeInTheDocument();
    expect(screen.getByText('Sem uso informado')).toBeInTheDocument();
  });

  it('mostra empty state quando não há tags', () => {
    mockUseAdminInterestTags.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<AdminInterestTagsPage />);

    expect(screen.getByText('Nenhuma tag cadastrada')).toBeInTheDocument();
  });

  it('confirma antes de excluir a tag', async () => {
    const user = userEvent.setup();
    mockUseAdminInterestTags.mockReturnValue({
      data: [{ id: 2, name: 'Ecoturismo', slug: 'ecoturismo' }],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<AdminInterestTagsPage />);

    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    const dialog = screen.getByRole('dialog');

    expect(within(dialog).getByText('Excluir tag?')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }));
    expect(mockDeleteInterestTag).toHaveBeenCalledWith(2);
  });
});
