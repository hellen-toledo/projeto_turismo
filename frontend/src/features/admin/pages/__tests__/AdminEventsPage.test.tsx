import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../test/utils';
import { AdminEventsPage } from '../AdminEventsPage';

const {
  mockDeleteEvent,
  mockUseAdminEvents,
  mockUseAdminEvent,
  mockUseAdminCities,
  mockUseAdminInterestTags,
  mockConfirm,
} = vi.hoisted(() => ({
  mockDeleteEvent: vi.fn(),
  mockUseAdminEvents: vi.fn(),
  mockUseAdminEvent: vi.fn(),
  mockUseAdminCities: vi.fn(),
  mockUseAdminInterestTags: vi.fn(),
  mockConfirm: vi.fn(),
}));

vi.mock('../../hooks/useAdminEvents', () => ({
  getEventDisplayStatus: () => ['Publicado', 'Futuro'],
  useAdminEvents: (filters: unknown) => mockUseAdminEvents(filters),
  useAdminEvent: (eventId: number | null) => mockUseAdminEvent(eventId),
  useAdminEventMutations: () => ({
    deleteEvent: mockDeleteEvent,
    deleting: false,
  }),
}));

vi.mock('../../hooks/useAdminCities', () => ({
  useAdminCities: (filters: unknown) => mockUseAdminCities(filters),
}));

vi.mock('../../hooks/useAdminInterestTags', () => ({
  useAdminInterestTags: () => mockUseAdminInterestTags(),
}));

vi.mock('../../forms/EventForm', () => ({
  EventForm: ({ event }: { event?: { id: number } | null }) => <div>Formulário de evento {event?.id ?? 'novo'}</div>,
}));

describe('AdminEventsPage', () => {
  beforeEach(() => {
    mockDeleteEvent.mockReset();
    mockDeleteEvent.mockResolvedValue(undefined);
    mockUseAdminEvent.mockReset();
    mockUseAdminEvents.mockReset();
    mockUseAdminCities.mockReset();
    mockUseAdminInterestTags.mockReset();

    mockUseAdminEvents.mockReturnValue({
      data: {
        data: [
          {
            id: 22,
            title: 'Festival Gastronômico',
            description: 'Programação especial',
            startsAt: '2026-05-10T18:00:00.000Z',
            endsAt: null,
            isPublished: true,
            isFeatured: true,
            city: { id: 1, name: 'Porangatu', slug: 'porangatu' },
          },
        ],
        meta: { total: 1, currentPage: 1, lastPage: 1, perPage: 12, from: 1, to: 1 },
      },
      isLoading: false,
      isError: false,
    });

    mockUseAdminEvent.mockReturnValue({
      data: null,
      isLoading: false,
    });

    mockUseAdminCities.mockReturnValue({
      data: {
        data: [{ id: 1, name: 'Porangatu', slug: 'porangatu' }],
        meta: { total: 1, currentPage: 1, lastPage: 1, perPage: 50, from: 1, to: 1 },
      },
      isLoading: false,
      isError: false,
    });

    mockUseAdminInterestTags.mockReturnValue({
      data: [{ id: 2, name: 'Gastronomia', slug: 'gastronomia' }],
      isLoading: false,
      isError: false,
    });

    mockConfirm.mockReset();
    vi.stubGlobal('confirm', mockConfirm);
  });

  it('confirma antes de excluir o evento', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(true);

    renderWithProviders(<AdminEventsPage />, { route: '/admin/events' });

    await user.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.');
    await waitFor(() => {
      expect(mockDeleteEvent).toHaveBeenCalledWith(22);
    });
  });

  it('não exclui o evento quando a confirmação é cancelada', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(false);

    renderWithProviders(<AdminEventsPage />, { route: '/admin/events' });

    await user.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(mockDeleteEvent).not.toHaveBeenCalled();
  });
});
