import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminCitiesPage } from '../AdminCitiesPage';
import { renderWithProviders } from '../../../../test/utils';

const { mockDeleteCity } = vi.hoisted(() => ({
  mockDeleteCity: vi.fn(),
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
  });

  it('confirma antes de excluir a cidade', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminCitiesPage />);

    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    const dialog = screen.getByRole('dialog');

    expect(within(dialog).getByText('Excluir cidade?')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }));

    await waitFor(() => {
      expect(mockDeleteCity).toHaveBeenCalledWith(1);
    });
  });

  it('não exclui quando a confirmação é cancelada', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminCitiesPage />);

    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' }));

    expect(mockDeleteCity).not.toHaveBeenCalled();
  });
});
