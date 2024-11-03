export interface Court {
  id: string;
  venue_id: string;
  name: string;
  description: string;
  price_per_hour: number;
  status: 'available' | 'unavailable';
  created_at: string;
  updated_at: string;
}

export interface CreateCourtRequest {
  name: string;
  description: string;
  price_per_hour: number;
}

export interface UpdateCourtRequest {
  name?: string;
  description?: string;
  price_per_hour?: number;
  status?: 'available' | 'unavailable';
}
