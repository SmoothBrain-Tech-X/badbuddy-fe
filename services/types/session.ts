import { User } from './auth';
import { BaseEntity, PaginationParams } from './common';

export interface Session extends BaseEntity {
  id: string;
  title: string;
  description: string;
  venue_name: string;
  venue_location: string;
  host_name: string;
  host_level: string;
  session_date: string;
  start_time: string;
  end_time: string;
  player_level: string;
  max_participants: number;
  cost_per_person: number;
  status: string;
  allow_cancellation: boolean;
  cancellation_deadline_hours?: number; // Optional field
  confirmed_players: number;
  pending_players: number;
}

export interface CreateSessionDTO {
  venue_id: string;
  court_ids: string[];
  title: string;
  description: string;
  session_date: string;
  start_time: string;
  end_time: string;
  player_level: User['play_level'];
  max_participants: number;
  cost_per_person: number;
  allow_cancellation: boolean;
  cancellation_deadline_hours: number;
  rules: string[];
}

export interface SessionFilters extends PaginationParams {
  q?: string;
  limit?: number;
  offset?: number;
  player_level?: User['play_level'];
  date?: string;
}

export interface SessionResponse {
  sessions: Session[];
  total: number;
}
