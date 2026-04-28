import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeEvent, makePaginatedResponse } from '../../../../test/fixtures';
import { createTestQueryClient } from '../../../../test/utils';
import { useEvent, useEvents } from '../useEvents';

const { mockGetEventByIdOrSlug, mockGetEvents } = vi.hoisted(() => ({
  mockGetEventByIdOrSlug: vi.fn(),
  mockGetEvents: vi.fn(),
}));

vi.mock('../../api/eventsApi', () => ({
  getEvents: mockGetEvents,
  getEventByIdOrSlug: mockGetEventByIdOrSlug,
}));

describe('event queries', () => {
  beforeEach(() => {
    mockGetEvents.mockReset();
    mockGetEventByIdOrSlug.mockReset();
  });

  it('loads the events list through react query', async () => {
    const events = [makeEvent(), makeEvent({ id: 2, slug: 'feira-do-cerrado', title: 'Feira do Cerrado' })];
    const response = makePaginatedResponse(events);
    mockGetEvents.mockResolvedValue(response);

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(response);
    expect(mockGetEvents).toHaveBeenCalledTimes(1);
  });

  it('loads an event detail through react query', async () => {
    const event = makeEvent({ slug: 'festival-do-lago' });
    mockGetEventByIdOrSlug.mockResolvedValue(event);

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useEvent('festival-do-lago'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(event);
    expect(mockGetEventByIdOrSlug).toHaveBeenCalledWith('festival-do-lago');
  });
});
