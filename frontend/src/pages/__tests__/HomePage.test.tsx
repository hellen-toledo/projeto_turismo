import { screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { makeCity, makeEvent } from '../../test/fixtures';
import { renderWithProviders } from '../../test/utils';
import { HomePage } from '../HomePage';

const { mockUseCities, mockUseEvents } = vi.hoisted(() => ({
  mockUseCities: vi.fn(),
  mockUseEvents: vi.fn(),
}));

vi.mock('../../features/cities/hooks/useCities', () => ({
  useCities: mockUseCities,
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

describe('HomePage', () => {
  beforeEach(() => {
    mockUseCities.mockReset();
    mockUseEvents.mockReset();
  });

  it('renders loading states while data is being fetched', () => {
    mockUseCities.mockReturnValue(createQueryState({ isLoading: true }));
    mockUseEvents.mockReturnValue(createQueryState({ isLoading: true }));

    renderWithProviders(<HomePage />);

    expect(screen.getByText('Carregando destinos...')).toBeInTheDocument();
    expect(screen.getByText('Carregando eventos do Norte Goiano...')).toBeInTheDocument();
  });

  it('renders error states when city and event queries fail', () => {
    mockUseCities.mockReturnValue(createQueryState({ isError: true }));
    mockUseEvents.mockReturnValue(createQueryState({ isError: true }));

    renderWithProviders(<HomePage />);

    expect(screen.getByText('Não foi possível carregar as cidades')).toBeInTheDocument();
    expect(screen.getByText('Não foi possível carregar os eventos')).toBeInTheDocument();
  });

  it('renders empty states when there are no published resources', () => {
    mockUseCities.mockReturnValue(createQueryState({ data: [] }));
    mockUseEvents.mockReturnValue(createQueryState({ data: [] }));

    renderWithProviders(<HomePage />);

    expect(screen.getByText('Nenhuma cidade publicada')).toBeInTheDocument();
    expect(screen.getByText('Nenhum evento disponível')).toBeInTheDocument();
  });

  it('renders featured cities and upcoming events from the query data', () => {
    mockUseCities.mockReturnValue(
      createQueryState({
        data: [
          makeCity({ id: 1, name: 'Alto Paraiso de Goias' }),
          makeCity({ id: 2, name: 'Sao Jorge', slug: 'sao-jorge' }),
        ],
      }),
    );
    mockUseEvents.mockReturnValue(
      createQueryState({
        data: [
          makeEvent({ id: 1, title: 'Festival do Lago' }),
          makeEvent({ id: 2, title: 'Circuito do Cerrado', slug: 'circuito-do-cerrado' }),
        ],
      }),
    );

    renderWithProviders(<HomePage />);

    expect(screen.getByRole('link', { name: /Destino: Alto Paraiso de Goias/i })).toHaveAttribute(
      'href',
      '/cidades/alto-paraiso-de-goias',
    );
    expect(screen.getByRole('link', { name: /Destino: Sao Jorge/i })).toHaveAttribute('href', '/cidades/sao-jorge');
    expect(screen.getByText('Festival do Lago')).toBeInTheDocument();
    expect(screen.getByText('Circuito do Cerrado')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todas as cidades' })).toHaveAttribute('href', '/cidades');
    expect(screen.getByRole('link', { name: 'Ver agenda completa' })).toHaveAttribute('href', '/eventos');
  });
});

