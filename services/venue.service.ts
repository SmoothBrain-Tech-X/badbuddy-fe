// src/services/venue.service.ts
import { Api } from './api';
import { SearchParams } from './types/common';
import { Venue, VenueDTO, VenueFilters } from './types/venue';

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

  async list(params?: VenueFilters): Promise<Venue[] | null> {
    return this.api.get<Venue[]>('/venues', { params });
  }

  async search(params: SearchParams): Promise<Venue[] | null> {
    return this.api.get<Venue[]>('/venues/search', { params });
  }
}
