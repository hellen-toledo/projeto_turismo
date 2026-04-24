import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeCity } from '../../../../test/fixtures';
import { createTestQueryClient } from '../../../../test/utils';
import { useCities } from '../useCities';
import { useCity } from '../useCity';

const { mockGetCities, mockGetCityByIdOrSlug } = vi.hoisted(() => ({
  mockGetCities: vi.fn(),
  mockGetCityByIdOrSlug: vi.fn(),
}));

vi.mock('../../api/citiesApi', () => ({
  getCities: mockGetCities,
  getCityByIdOrSlug: mockGetCityByIdOrSlug,
}));

describe('city queries', () => {
  beforeEach(() => {
    mockGetCities.mockReset();
    mockGetCityByIdOrSlug.mockReset();
  });

  it('loads the cities list through react query', async () => {
    const cities = [makeCity(), makeCity({ id: 2, slug: 'sao-jorge', name: 'Sao Jorge' })];
    mockGetCities.mockResolvedValue(cities);

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCities(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(cities);
    expect(mockGetCities).toHaveBeenCalledTimes(1);
  });

  it('loads a city by slug through react query', async () => {
    const city = makeCity({ slug: 'alto-paraiso-de-goias' });
    mockGetCityByIdOrSlug.mockResolvedValue(city);

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCity('alto-paraiso-de-goias'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(city);
    expect(mockGetCityByIdOrSlug).toHaveBeenCalledWith('alto-paraiso-de-goias');
  });

  it('does not execute the city query when the slug is empty', async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCity(''), { wrapper });

    await waitFor(() => {
      expect(result.current.fetchStatus).toBe('idle');
    });

    expect(mockGetCityByIdOrSlug).not.toHaveBeenCalled();
  });
});

