import { useQuery } from '@tanstack/react-query';
import type { EventListParams } from '../../../shared/types/api';
import { getEventByIdOrSlug, getEvents } from '../api/eventsApi';

export const useEvents = (params: EventListParams = {}) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => getEvents(params),
  });
};

export const useEvent = (idOrSlug: string) =>
  useQuery({
    queryKey: ['event', idOrSlug],
    queryFn: () => getEventByIdOrSlug(idOrSlug),
    enabled: idOrSlug.length > 0,
  });
