export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiPaths = {
  public: {
    regions: '/regions',
    cities: '/cities',
    city: (idOrSlug: string) => `/cities/${idOrSlug}`,
    events: '/events',
    event: (idOrSlug: string) => `/events/${idOrSlug}`,
    interestTags: '/interest-tags',
  },
  admin: {
    auth: {
      login: '/admin/auth/login',
      me: '/admin/auth/me',
      logout: '/admin/auth/logout',
    },
    cities: '/admin/cities',
    city: (cityId: number) => `/admin/cities/${cityId}`,
    events: '/admin/events',
    event: (eventId: number) => `/admin/events/${eventId}`,
    regions: '/admin/regions',
    interestTags: '/admin/interest-tags',
  },
} as const;
