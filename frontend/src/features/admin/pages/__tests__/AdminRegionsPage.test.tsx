import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../test/utils';
import { AdminRegionsPage } from '../AdminRegionsPage';

const { mockDeleteRegion, mockConfirm, mockUseAdminRegions } = vi.hoisted(() => ({
  mockDeleteRegion: vi.fn(),
  mockConfirm: vi.fn(),
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
    mockConfirm.mockReset();
    mockUseAdminRegions.mockReset();
    vi.stubGlobal('confirm', mockConfirm);
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
    mockConfirm.mockReturnValue(true);
    mockUseAdminRegions.mockReturnValue({
      data: [{ id: 1, name: 'Norte', citiesCount: 4 }],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<AdminRegionsPage />);

    await user.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir esta região?');
    expect(mockDeleteRegion).toHaveBeenCalledWith(1);
  });
});
