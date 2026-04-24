import { apiClient } from '../../../shared/lib/api/client';
import type { Event } from '../../../shared/types/api';

export const getEvents = async (): Promise<Event[]> => {
  const { data } = await apiClient.get('/events');
  return data;
};

export const getEventByIdOrSlug = async (idOrSlug: string): Promise<Event> => {
  const { data } = await apiClient.get(`/events/${idOrSlug}`);
  return data;
};
