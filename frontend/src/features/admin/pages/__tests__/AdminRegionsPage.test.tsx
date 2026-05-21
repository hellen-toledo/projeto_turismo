import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../test/utils';
import { AdminRegionsPage } from '../AdminRegionsPage';

const { mockDeleteRegion, mockUseAdminRegions } = vi.hoisted(() => ({
  mockDeleteRegion: vi.fn(),
  mockUseAdminRegions: vi.fn(),
}));

vi.mock('../../hooks/useAdminRegions', () => ({
  useAdminRegions: () => mockUseAdminRegions(),
  useAdminRegionMutations: () => ({
    deleteRegion: mockDeleteRegion,
    deleting: false,
  }),
}));

vi.mock('../../forms/RegionForm', () => ({
  RegionForm: () => <div>RegionForm mockado</div>,
}));

describe('AdminRegionsPage', () => {
  beforeEach(() => {
    mockDeleteRegion.mockReset();
    mockDeleteRegion.mockResolvedValue(undefined);
    mockUseAdminRegions.mockReset();
  });

  it('renderiza a listagem de regiões', () => {
    mockUseAdminRegions.mockReturnValue({
      data: [{ id: 1, name: 'Norte', citiesCount: 4 }],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<AdminRegionsPage />);

    expect(screen.getByText('Regiões cadastradas')).toBeInTheDocument();
    expect(screen.getByText('Norte')).toBeInTheDocument();
    expect(screen.getByText('4 cidades vinculadas')).toBeInTheDocument();
  });

  it('mostra empty state quando não há regiões', () => {
    mockUseAdminRegions.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<AdminRegionsPage />);

    expect(screen.getByText('Nenhuma região cadastrada')).toBeInTheDocument();
  });

  it('confirma antes de excluir a região', async () => {
    const user = userEvent.setup();
    mockUseAdminRegions.mockReturnValue({
      data: [{ id: 1, name: 'Norte', citiesCount: 4 }],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<AdminRegionsPage />);

    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    const dialog = screen.getByRole('dialog');

    expect(within(dialog).getByText('Excluir região?')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }));
    expect(mockDeleteRegion).toHaveBeenCalledWith(1);
  });
});
