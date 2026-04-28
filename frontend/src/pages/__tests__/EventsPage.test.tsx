import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeEvent, makePaginatedResponse } from '../../test/fixtures';
import { renderWithProviders } from '../../test/utils';
import { EventsPage } from '../EventsPage';

const { mockUseEvents } = vi.hoisted(() => ({
  mockUseEvents: vi.fn(),
}));

vi.mock('../../features/events/hooks/useEvents', () => ({
  useEvents: mockUseEvents,
}));

const createQueryState = <T,>(overrides: Partial<{ data: T; isLoading: boolean; isError: boolean }> = {}) =>
  ({
    data: undefined,
    isLoading: false,
    isError: false,
    ...overrides,
  }) as const;

describe('EventsPage', () => {
  beforeEach(() => {
    mockUseEvents.mockReset();
  });

  it('renders a loading state while events are being fetched', () => {
    mockUseEvents.mockReturnValue(createQueryState({ isLoading: true }));

    renderWithProviders(<EventsPage />);

    expect(screen.getByText('Carregando eventos...')).toBeInTheDocument();
  });

  it('renders an error state when the query fails', () => {
    mockUseEvents.mockReturnValue(createQueryState({ isError: true }));

    renderWithProviders(<EventsPage />);

    expect(screen.getByText('Não foi possível carregar os eventos')).toBeInTheDocument();
    expect(screen.getByText('Tente novamente mais tarde para consultar a agenda.')).toBeInTheDocument();
  });

  it('renders an empty state when there are no events', () => {
    mockUseEvents.mockReturnValue(createQueryState({ data: makePaginatedResponse([]) }));

    renderWithProviders(<EventsPage />);

    expect(screen.getByText('Nenhum evento disponível')).toBeInTheDocument();
  });

  it('renders the event list when data is available', () => {
    mockUseEvents.mockReturnValue(
      createQueryState({
        data: makePaginatedResponse([
          makeEvent({ id: 1, title: 'Festival do Lago', coverImage: 'https://example.com/festival.jpg' }),
          makeEvent({ id: 2, title: 'Feira do Cerrado', slug: 'feira-do-cerrado', externalUrl: null }),
        ]),
      }),
    );

    renderWithProviders(<EventsPage />);

    expect(screen.getByRole('heading', { name: 'Eventos' })).toBeInTheDocument();
    expect(screen.getByText('Festival do Lago')).toBeInTheDocument();
    expect(screen.getByText('Feira do Cerrado')).toBeInTheDocument();
    expect(screen.getByAltText('Imagem do evento Festival do Lago')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Abrir detalhes externos do evento Festival do Lago/i })).toHaveAttribute('href', 'https://turismo.go.gov.br/festival-do-lago');
    expect(screen.getByRole('link', { name: /Abrir detalhes do evento Feira do Cerrado/i })).toHaveAttribute('href', '/eventos/feira-do-cerrado');
  });

  it('uses the internal details route when there is no usable external url', () => {
    mockUseEvents.mockReturnValue(
      createQueryState({
        data: makePaginatedResponse([
          makeEvent({ id: 1, title: 'Festival Placeholder', externalUrl: 'https://example.com/festival' }),
        ]),
      }),
    );

    renderWithProviders(<EventsPage />);

    expect(screen.getByText('Festival Placeholder')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Abrir detalhes externos do evento/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Abrir detalhes do evento Festival Placeholder/i })).toHaveAttribute('href', '/eventos/festival-do-lago');
  });
});
