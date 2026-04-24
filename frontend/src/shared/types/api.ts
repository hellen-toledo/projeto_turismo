export interface RegionSummary {
  id: number;
  name: string;
  citiesCount?: number;
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
