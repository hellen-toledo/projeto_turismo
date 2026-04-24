import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { makeCity } from '../../test/fixtures';
import { renderWithProviders } from '../../test/utils';
import { CityDetailsPage } from '../CityDetailsPage';

const { mockUseCity } = vi.hoisted(() => ({
  mockUseCity: vi.fn(),
}));

vi.mock('../../features/cities/hooks/useCity', () => ({
  useCity: mockUseCity,
}));

const createQueryState = <T,>(
  overrides: Partial<{ data: T; isLoading: boolean; isError: boolean; error: unknown }> = {},
) =>
  ({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    ...overrides,
  }) as const;

const makeAxiosError = (status: number) =>
  new AxiosError(
    'Request failed',
    'ERR_BAD_REQUEST',
    undefined,
    undefined,
    {
      status,
      statusText: String(status),
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: {},
    } as AxiosResponse,
  );

describe('CityDetailsPage', () => {
  beforeEach(() => {
    mockUseCity.mockReset();
  });

  it('renders a loading state while the city is being fetched', () => {
    mockUseCity.mockReturnValue(createQueryState({ isLoading: true }));

    renderWithProviders(<CityDetailsPage />, {
      route: '/cidades/alto-paraiso-de-goias',
    });

    expect(screen.getByText('Carregando detalhes da cidade...')).toBeInTheDocument();
  });

  it('renders a not found state for 404 responses', () => {
    mockUseCity.mockReturnValue(
      createQueryState({
        isError: true,
        error: makeAxiosError(404),
      }),
    );

    renderWithProviders(<CityDetailsPage />, {
      route: '/cidades/inexistente',
    });

    expect(screen.getByText('Cidade não encontrada')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todas as cidades' })).toHaveAttribute('href', '/cidades');
  });

  it('renders a generic error state for unexpected failures', () => {
    mockUseCity.mockReturnValue(
      createQueryState({
        isError: true,
        error: new Error('Network error'),
      }),
    );

    renderWithProviders(<CityDetailsPage />, {
      route: '/cidades/alto-paraiso-de-goias',
    });

    expect(screen.getByText('Erro ao carregar a cidade')).toBeInTheDocument();
  });

  it('renders the city details when the query succeeds', () => {
    mockUseCity.mockReturnValue(
      createQueryState({
        data: makeCity({
          name: 'Alto Paraiso de Goias',
          summary: 'Porta de entrada da Chapada.',
          interestTags: [
            { id: 1, name: 'Ecoturismo', slug: 'ecoturismo' },
            { id: 2, name: 'Trilhas', slug: 'trilhas' },
          ],
        }),
      }),
    );

    renderWithProviders(<CityDetailsPage />, {
      route: '/cidades/alto-paraiso-de-goias',
    });

    expect(screen.getByRole('heading', { name: 'Alto Paraiso de Goias' })).toBeInTheDocument();
    expect(screen.getByText('Região: Chapada dos Veadeiros')).toBeInTheDocument();
    expect(screen.getByText('Porta de entrada da Chapada.')).toBeInTheDocument();
    expect(screen.getByText('Ecoturismo')).toBeInTheDocument();
    expect(screen.getByText('Trilhas')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← Voltar para cidades' })).toHaveAttribute('href', '/cidades');
  });
});

