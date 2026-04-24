import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../api/eventsApi';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });
};
