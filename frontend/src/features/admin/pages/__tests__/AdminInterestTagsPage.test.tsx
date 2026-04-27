import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../test/utils';
import { AdminInterestTagsPage } from '../AdminInterestTagsPage';

const { mockDeleteInterestTag, mockConfirm, mockUseAdminInterestTags } = vi.hoisted(() => ({
  mockDeleteInterestTag: vi.fn(),
  mockConfirm: vi.fn(),
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
    mockConfirm.mockReset();
    mockUseAdminInterestTags.mockReset();
    vi.stubGlobal('confirm', mockConfirm);
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
    expect(screen.getByText('Uso não informado pela API')).toBeInTheDocument();
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
    mockConfirm.mockReturnValue(true);
    mockUseAdminInterestTags.mockReturnValue({
      data: [{ id: 2, name: 'Ecoturismo', slug: 'ecoturismo' }],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<AdminInterestTagsPage />);

    await user.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir esta tag?');
    expect(mockDeleteInterestTag).toHaveBeenCalledWith(2);
  });
});
