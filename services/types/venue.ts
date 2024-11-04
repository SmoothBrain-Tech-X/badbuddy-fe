import { BaseEntity, PaginationParams } from './common';

export interface OpenRange {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  is_open: boolean;
  open_time: string; // ISO 8601 datetime string
  close_time: string; // ISO 8601 datetime string
}

// Individual court information
export interface Court {
  id: string;
  name: string;
  description: string;
  price_per_hour: number;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface rule {
  rule: string;
}

export interface facility {
  id: string;
  name: string;
}

export interface Venue extends BaseEntity {
  id: string;
  name: string;
  description: string;
  address: string;
  location: string;
  phone: string;
  email: string;
  open_range: OpenRange[];
  image_urls: string;
  status: 'active' | 'inactive';
  rating: number;
  total_reviews: number;
  courts: Court[];
  facilities: facility[];
  rules: rule[];
  latitude: number;
  longitude: number;
}

export interface VenueDTO {
  name: string;
  description: string;
  address: string;
  location: string;
  phone: string;
  email: string;
  open_time: string;
  close_time: string;
  image_urls: string;
}

export interface VenueFilters extends PaginationParams {
  location?: string;
  status?: Venue['status'];
}
export interface Reviewer {
  first_name: string;
  last_name: string;
  avatar_url: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: Reviewer;
}

export interface ReviewDTO {
  reviews: Review[];
}

export interface CreateReviewDTO {
  rating: number;
  comment: string;
}

export interface VenueList {
  id: string;
  name: string;
}

export interface VenueListDTO {
  venues: VenueList[];
}
