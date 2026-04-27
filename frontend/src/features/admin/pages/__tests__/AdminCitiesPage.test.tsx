import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminCitiesPage } from '../AdminCitiesPage';
import { renderWithProviders } from '../../../../test/utils';

const { mockDeleteCity, mockConfirm } = vi.hoisted(() => ({
  mockDeleteCity: vi.fn(),
  mockConfirm: vi.fn(),
}));

vi.mock('../../hooks/useAdminCities', () => ({
  useAdminCities: () => ({
    data: {
      data: [
        {
          id: 1,
          name: 'Porangatu',
          slug: 'porangatu',
          summary: 'Destino de lagos.',
          description: 'Descrição',
          coverImage: 'https://example.com/city.jpg',
          isPublished: true,
          region: { id: 1, name: 'Norte' },
          interestTags: [],
          gallery: [],
          attractions: [],
        },
      ],
      meta: {
        currentPage: 1,
        lastPage: 1,
        perPage: 12,
        total: 1,
        from: 1,
        to: 1,
      },
    },
    isLoading: false,
    isError: false,
  }),
  useAdminCity: () => ({
    data: null,
    isLoading: false,
  }),
  useAdminCityMutations: () => ({
    deleteCity: mockDeleteCity,
    deleting: false,
  }),
  getCityDisplayStatus: () => 'Publicado',
}));

vi.mock('../../hooks/useAdminRegions', () => ({
  useAdminRegions: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('../../hooks/useAdminInterestTags', () => ({
  useAdminInterestTags: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('../../forms/CityForm', () => ({
  CityForm: () => <div>CityForm mockado</div>,
}));

describe('AdminCitiesPage', () => {
  beforeEach(() => {
    mockDeleteCity.mockReset();
    mockDeleteCity.mockResolvedValue(undefined);
    mockConfirm.mockReset();
    vi.stubGlobal('confirm', mockConfirm);
  });

  it('confirma antes de excluir a cidade', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(true);

    renderWithProviders(<AdminCitiesPage />);

    await user.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(mockConfirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockDeleteCity).toHaveBeenCalledWith(1);
    });
  });

  it('não exclui quando a confirmação é cancelada', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(false);

    renderWithProviders(<AdminCitiesPage />);

    await user.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockDeleteCity).not.toHaveBeenCalled();
  });
});
