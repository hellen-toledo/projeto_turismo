import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Event } from '../../../shared/types/api';
import { createAdminEvent, deleteAdminEvent, getAdminEvents, updateAdminEvent } from '../api/adminEventsApi';
import type { EventFormValues } from '../types/admin';

export const useAdminEvents = () =>
  useQuery({
    queryKey: ['admin', 'events'],
    queryFn: getAdminEvents,
  });

export const useAdminEventMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] }),
      queryClient.invalidateQueries({ queryKey: ['events'] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: (values: EventFormValues) => createAdminEvent(values),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ eventId, values }: { eventId: number; values: EventFormValues }) => updateAdminEvent(eventId, values),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (eventId: number) => deleteAdminEvent(eventId),
    onSuccess: invalidate,
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
  if (!event.isPublished) {
    return 'Rascunho';
  }

  return event.isFeatured ? 'Destaque' : 'Publicado';
};
