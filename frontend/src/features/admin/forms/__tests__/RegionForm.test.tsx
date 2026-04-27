import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RegionSummary } from '../../../../shared/types/api';
import { renderWithProviders } from '../../../../test/utils';
import { RegionForm } from '../RegionForm';

const { mockCreateRegion, mockUpdateRegion } = vi.hoisted(() => ({
  mockCreateRegion: vi.fn(),
  mockUpdateRegion: vi.fn(),
}));

vi.mock('../../hooks/useAdminRegions', () => ({
  useAdminRegionMutations: () => ({
    createRegion: mockCreateRegion,
    updateRegion: mockUpdateRegion,
    creating: false,
    updating: false,
  }),
}));

const makeRegion = (overrides: Partial<RegionSummary> = {}): RegionSummary => ({
  id: 7,
  name: 'Vale do Araguaia',
  citiesCount: 3,
  ...overrides,
});

describe('RegionForm', () => {
  beforeEach(() => {
    mockCreateRegion.mockReset();
    mockUpdateRegion.mockReset();
  });

  it('cria uma região', async () => {
    const user = userEvent.setup();
    mockCreateRegion.mockResolvedValue({});

    renderWithProviders(<RegionForm />);

    fireEvent.change(screen.getByLabelText('Nome da região'), { target: { value: 'Serra Dourada' } });

    await user.click(screen.getByRole('button', { name: 'Criar região' }));

    await waitFor(() => {
      expect(mockCreateRegion).toHaveBeenCalledWith({
        name: 'Serra Dourada',
      });
    });
  });

  it('edita uma região existente', async () => {
    const user = userEvent.setup();
    mockUpdateRegion.mockResolvedValue({});

    renderWithProviders(<RegionForm region={makeRegion()} />);

    const input = screen.getByLabelText('Nome da região');
    await user.clear(input);
    await user.type(input, 'Vale Renovado');
    await user.click(screen.getByRole('button', { name: 'Atualizar região' }));

    await waitFor(() => {
      expect(mockUpdateRegion).toHaveBeenCalledWith({
        regionId: 7,
        values: {
          name: 'Vale Renovado',
        },
      });
    });
  });
});
