import type { City, Event, InterestTag, RegionSummary } from '../shared/types/api';

export const makeRegion = (overrides: Partial<RegionSummary> = {}): RegionSummary => ({
  id: 1,
  name: 'Chapada dos Veadeiros',
  citiesCount: 2,
  ...overrides,
});

export const makeTag = (overrides: Partial<InterestTag> = {}): InterestTag => ({
  id: 1,
  name: 'Ecoturismo',
  slug: 'ecoturismo',
  ...overrides,
});

export const makeCity = (overrides: Partial<City> = {}): City => ({
  id: 1,
  name: 'Alto Paraiso de Goias',
  slug: 'alto-paraiso-de-goias',
  summary: 'Base da Chapada.',
  description: 'Destino de ecoturismo com trilhas e cachoeiras.',
  coverImage: 'https://example.com/city.jpg',
  isPublished: true,
  region: makeRegion(),
  interestTags: [makeTag()],
  ...overrides,
});

export const makeEvent = (overrides: Partial<Event> = {}): Event => ({
  id: 1,
  title: 'Festival do Lago',
  slug: 'festival-do-lago',
  description: 'Evento cultural no Norte Goiano.',
  startsAt: '2026-09-10T09:00:00.000Z',
  endsAt: '2026-09-10T18:00:00.000Z',
  coverImage: 'https://example.com/event.jpg',
  externalUrl: 'https://example.com/festival',
  isFeatured: true,
  isPublished: true,
  city: {
    id: 1,
    name: 'Minacu',
    slug: 'minacu',
  },
  interestTags: [makeTag()],
  ...overrides,
});

