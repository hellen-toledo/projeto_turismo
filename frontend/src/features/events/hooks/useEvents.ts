import { useQuery } from '@tanstack/react-query';
import type { EventListParams } from '../../../shared/types/api';
import { getEvents } from '../api/eventsApi';

export const useEvents = (params: EventListParams = {}) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => getEvents(params),
  });
};
