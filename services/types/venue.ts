import { BaseEntity, PaginationParams } from './common';

export interface Venue extends BaseEntity {
  name: string;
  description: string;
  address: string;
  location: string;
  phone: string;
  email: string;
  open_time: string;
  close_time: string;
  image_urls: string;
  status: 'active' | 'inactive';
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
