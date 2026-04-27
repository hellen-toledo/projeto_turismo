import { apiClient } from '../../../shared/lib/api/client';
import { apiPaths } from '../../../shared/lib/api/config';
import { mapPaginatedResponse } from '../../../shared/lib/api/mapPaginatedResponse';
import type { Event, EventListParams, PaginatedResponse } from '../../../shared/types/api';

export const getEvents = async (params: EventListParams = {}): Promise<PaginatedResponse<Event>> => {
  const { data } = await apiClient.get(apiPaths.public.events, {
    params: mapEventListParams(params),
  });

  return mapPaginatedResponse<Event>(data);
};

export const getEventByIdOrSlug = async (idOrSlug: string): Promise<Event> => {
  const { data } = await apiClient.get(apiPaths.public.event(idOrSlug));
  return data;
};

const mapEventListParams = (params: EventListParams) => ({
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
});
