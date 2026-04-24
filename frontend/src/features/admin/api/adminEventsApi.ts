import { adminApiClient } from './adminClient';
import type { Event } from '../../../shared/types/api';
import type { EventFormValues } from '../types/admin';

export const getAdminEvents = async (): Promise<Event[]> => {
  const { data } = await adminApiClient.get('/admin/v1/events');
  return data;
};

export const createAdminEvent = async (values: EventFormValues): Promise<Event> => {
  const { data } = await adminApiClient.post('/admin/v1/events', mapEventPayload(values));
  return data;
};

export const updateAdminEvent = async (eventId: number, values: EventFormValues): Promise<Event> => {
  const { data } = await adminApiClient.patch(`/admin/v1/events/${eventId}`, mapEventPayload(values));
  return data;
};

export const deleteAdminEvent = async (eventId: number) => {
  await adminApiClient.delete(`/admin/v1/events/${eventId}`);
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
