import { apiClient } from '../../../shared/lib/api/client';
import { apiPaths } from '../../../shared/lib/api/config';
import { mapPaginatedResponse } from '../../../shared/lib/api/mapPaginatedResponse';
import type { Event, EventListParams, PaginatedResponse } from '../../../shared/types/api';
import type { EventFormValues } from '../types/admin';

export const getAdminEvents = async (params: EventListParams = {}): Promise<PaginatedResponse<Event>> => {
  const { data } = await apiClient.get(apiPaths.admin.events, {
    params: {
      page: params.page,
      per_page: params.perPage,
      search: params.search ?? params.q,
      city: params.city,
      city_id: params.cityId,
      tag: params.tag,
      tag_id: params.tagId,
      featured: params.featured,
      future: params.future,
      published: params.published,
    },
  });

  return mapPaginatedResponse<Event>(data);
};

export const createAdminEvent = async (values: EventFormValues): Promise<Event> => {
  const { data } = await apiClient.post(apiPaths.admin.events, mapEventPayload(values));
  return data;
};

export const updateAdminEvent = async (eventId: number, values: EventFormValues): Promise<Event> => {
  const { data } = await apiClient.patch(apiPaths.admin.event(eventId), mapEventPayload(values));
  return data;
};

export const deleteAdminEvent = async (eventId: number) => {
  await apiClient.delete(apiPaths.admin.event(eventId));
};

const mapEventPayload = (values: EventFormValues) => ({
  title: values.title.trim(),
  slug: values.slug.trim() || null,
  description: values.description.trim(),
  startsAt: toIsoString(values.startsAt),
  endsAt: values.endsAt ? toIsoString(values.endsAt) : null,
  coverImage: values.coverImage.trim() || null,
  externalUrl: values.externalUrl.trim() || null,
  cityId: Number(values.cityId),
  isFeatured: values.isFeatured,
  isPublished: values.isPublished,
  interestTagIds: values.interestTagIds.map(Number),
});

const toIsoString = (value: string) => new Date(value).toISOString();
