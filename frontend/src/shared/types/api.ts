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
  citiesCount?: number;
  eventsCount?: number;
  usageCount?: number;
}

export interface MediaAsset {
  id: number;
  url: string;
  path?: string;
  originalName?: string;
  mimeType?: string;
  size: number;
  collection?: 'cover' | 'gallery' | 'general' | null;
  altText?: string | null;
  sortOrder?: number;
  isCover?: boolean;
  createdAt?: string;
}

export interface CityAttraction {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
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
  gallery?: MediaAsset[];
  attractions?: CityAttraction[];
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
  gallery?: MediaAsset[];
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: AdminUser;
}
