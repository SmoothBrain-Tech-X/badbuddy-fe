// src/services/venue.service.ts
import { Api } from './api';
import { SearchParams } from './types/common';
import {
  CreateReviewDTO,
  Review,
  ReviewDTO,
  Venue,
  VenueDTO,
  VenueFilters,
  VenueListDTO,
} from './types/venue';

export class VenueService {
  constructor(private api: Api) {}

  async create(data: VenueDTO): Promise<Venue | null> {
    return this.api.post<Venue>('/venues', data);
  }

  async getById(id: string): Promise<Venue | null> {
    return this.api.get<Venue>(`/venues/${id}`);
  }

  async update(id: string, data: Partial<VenueDTO>): Promise<Venue | null> {
    return this.api.put<Venue>(`/venues/${id}`, data);
  }

  async list(params?: VenueFilters): Promise<VenueListDTO | null> {
    return this.api.get<VenueListDTO>('/venues', { params });
  }

  async search(params: SearchParams): Promise<Venue[] | null> {
    return this.api.get<Venue[]>('/venues/search', { params });
  }

  //get reviews for a venue
  async getReviews(venueId: string): Promise<ReviewDTO | null> {
    return this.api.get<ReviewDTO>(`/venues/${venueId}/reviews`);
  }

  //add review for a venue
  async addReview(venueId: string, data: CreateReviewDTO): Promise<Review | null> {
    return this.api.post<Review>(`/venues/${venueId}/reviews`, data);
  }
}
