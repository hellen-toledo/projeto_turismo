import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeEvent } from '../../test/fixtures';
import { renderWithProviders } from '../../test/utils';
import { EventDetailsPage } from '../EventDetailsPage';

const { mockUseEvent } = vi.hoisted(() => ({
  mockUseEvent: vi.fn(),
}));

vi.mock('../../features/events/hooks/useEvents', () => ({
  useEvent: mockUseEvent,
  useEvents: vi.fn(),
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

describe('EventDetailsPage', () => {
  beforeEach(() => {
    mockUseEvent.mockReset();
  });

  it('renders a loading state while the event is being fetched', () => {
    mockUseEvent.mockReturnValue(createQueryState({ isLoading: true }));

    renderWithProviders(<EventDetailsPage />, {
      route: '/eventos/festival-do-lago',
    });

    expect(screen.getByText('Carregando detalhes do evento...')).toBeInTheDocument();
  });

  it('renders a not found state for 404 responses', () => {
    mockUseEvent.mockReturnValue(
      createQueryState({
        isError: true,
        error: makeAxiosError(404),
      }),
    );

    renderWithProviders(<EventDetailsPage />, {
      route: '/eventos/inexistente',
    });

    expect(screen.getByText('Evento não encontrado')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todos os eventos' })).toHaveAttribute('href', '/eventos');
  });

  it('renders the event details when the query succeeds', () => {
    mockUseEvent.mockReturnValue(
      createQueryState({
        data: makeEvent({
          title: 'Festival do Lago',
          description: 'Programação cultural ao longo do dia.',
          gallery: [
            {
              id: 10,
              url: 'https://example.com/gallery-1.jpg',
              altText: 'Palco principal',
              size: 1234,
            },
          ],
        }),
      }),
    );

    renderWithProviders(<EventDetailsPage />, {
      route: '/eventos/festival-do-lago',
    });

    expect(screen.getByRole('heading', { name: 'Festival do Lago' })).toBeInTheDocument();
    expect(screen.getByText('Cidade: Minacu')).toBeInTheDocument();
    expect(screen.getByText('Programação cultural ao longo do dia.')).toBeInTheDocument();
    expect(screen.getByText('Ecoturismo')).toBeInTheDocument();
    expect(screen.getByAltText('Palco principal')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar para a listagem de eventos' })).toHaveAttribute('href', '/eventos');
    expect(screen.getByRole('link', { name: 'Acessar página oficial' })).toHaveAttribute('href', 'https://turismo.go.gov.br/festival-do-lago');
  });

  it('renders fallbacks when the event has no gallery, no cover and no external url', () => {
    mockUseEvent.mockReturnValue(
      createQueryState({
        data: makeEvent({
          coverImage: null,
          externalUrl: null,
          gallery: [],
        }),
      }),
    );

    renderWithProviders(<EventDetailsPage />, {
      route: '/eventos/festival-do-lago',
    });

    expect(screen.getByAltText('Imagem ilustrativa do evento Festival do Lago')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Acessar página oficial' })).not.toBeInTheDocument();
    expect(screen.getByText('Este evento ainda não possui imagens complementares.')).toBeInTheDocument();
  });
});
