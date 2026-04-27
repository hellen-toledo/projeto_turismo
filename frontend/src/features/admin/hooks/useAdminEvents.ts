import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Event, EventListParams } from '../../../shared/types/api';
import { createAdminEvent, deleteAdminEvent, getAdminEvent, getAdminEvents, updateAdminEvent } from '../api/adminEventsApi';
import type { EventFormValues } from '../types/admin';

export const useAdminEvents = (params: EventListParams = {}) =>
  useQuery({
    queryKey: ['admin', 'events', params],
    queryFn: () => getAdminEvents(params),
  });

export const useAdminEvent = (eventId: number | null) =>
  useQuery({
    queryKey: ['admin', 'event', eventId],
    queryFn: () => getAdminEvent(eventId as number),
    enabled: eventId !== null,
  });

export const useAdminEventMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = async (eventId?: number) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'event'] }),
      queryClient.invalidateQueries({ queryKey: ['events'] }),
      eventId ? queryClient.invalidateQueries({ queryKey: ['event', String(eventId)] }) : Promise.resolve(),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: (values: EventFormValues) => createAdminEvent(values),
    onSuccess: async (event) => {
      await invalidate(event.id);
      queryClient.setQueryData(['admin', 'event', event.id], event);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ eventId, values }: { eventId: number; values: EventFormValues }) => updateAdminEvent(eventId, values),
    onSuccess: async (event) => {
      await invalidate(event.id);
      queryClient.setQueryData(['admin', 'event', event.id], event);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (eventId: number) => deleteAdminEvent(eventId),
    onSuccess: async (_, eventId) => {
      await invalidate(eventId);
      queryClient.removeQueries({ queryKey: ['admin', 'event', eventId] });
    },
  });

  return {
    createEvent: createMutation.mutateAsync,
    updateEvent: updateMutation.mutateAsync,
    deleteEvent: deleteMutation.mutateAsync,
    creating: createMutation.isPending,
    updating: updateMutation.isPending,
    deleting: deleteMutation.isPending,
  };
};

export const getEventDisplayStatus = (event: Event) => {
  const now = Date.now();
  const startTime = new Date(event.startsAt).getTime();
  const endTime = event.endsAt ? new Date(event.endsAt).getTime() : startTime;
  const badges = [];

  badges.push(event.isPublished ? 'Publicado' : 'Rascunho');

  if (event.isFeatured) {
    badges.push('Destaque');
  }

  badges.push(endTime < now ? 'Encerrado' : 'Futuro');

  return badges;
};
