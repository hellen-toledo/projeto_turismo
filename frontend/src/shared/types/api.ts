export interface RegionSummary {
  id: number;
  name: string;
  citiesCount?: number;
}

export interface PaginatedMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface CityListParams extends PaginationParams {
  search?: string;
  q?: string;
  region?: string;
  regionId?: number;
  tag?: string;
  tagId?: number;
  published?: boolean;
}

export interface EventListParams extends PaginationParams {
  search?: string;
  q?: string;
  city?: string;
  cityId?: number;
  tag?: string;
  tagId?: number;
  featured?: boolean;
  future?: boolean;
  published?: boolean;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface InterestTag {
  id: number;
  name: string;
  slug: string;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  description: string;
  coverImage: string | null;
  isPublished: boolean;
  region?: RegionSummary;
  interestTags?: InterestTag[];
}

export interface EventCitySummary {
  id: number;
  name: string;
  slug: string;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  startsAt: string;
  endsAt: string | null;
  coverImage: string | null;
  externalUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  city?: EventCitySummary;
  interestTags?: InterestTag[];
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: AdminUser;
}
