import { Api } from './api';
import {
  CreateSessionDTO,
  Session,
  SessionFilters,
  SessionResponse,
  sessionResponseDTO,
} from './types/session';

export class SessionService {
  constructor(private api: Api) {}

  async create(data: CreateSessionDTO): Promise<Session | null> {
    return this.api.post<Session>('/sessions', data);
  }

  async getById(id: string): Promise<sessionResponseDTO | null> {
    return this.api.get<sessionResponseDTO>(`/sessions/${id}/status`);
  }

  //get me
  async getMe(): Promise<sessionResponseDTO | null> {
    return this.api.get<sessionResponseDTO>('/sessions/user/me?include_history=false');
  }

  async search(params?: SessionFilters): Promise<SessionResponse | null> {
    return this.api.get<SessionResponse>('/sessions/search', { params });
  }

  async join(sessionId: string, message?: string): Promise<Session | null> {
    return this.api.post<Session>(`/sessions/${sessionId}/join`, { message });
  }

  async leave(sessionId: string): Promise<Session | null> {
    return this.api.post<Session>(`/sessions/${sessionId}/leave`);
  }

  async cancel(sessionId: string): Promise<Session | null> {
    return this.api.post<Session>(`/sessions/${sessionId}/cancel`);
  }

  async getUserSessions(includeHistory = false): Promise<Session[] | null> {
    return this.api.get<Session[]>('/sessions/user/me', {
      params: { include_history: includeHistory },
    });
  }

  async getHostedSessions(): Promise<sessionResponseDTO | null> {
    return this.api.get<sessionResponseDTO>('/sessions/host/me');
  }

  async getJoinedSessions(): Promise<sessionResponseDTO | null> {
    return this.api.get<sessionResponseDTO>('/sessions/join/me');
  }
}
