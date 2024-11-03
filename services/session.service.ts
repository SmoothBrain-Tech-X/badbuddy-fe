import { Api } from './api';
import { CreateSessionDTO, Session, SessionFilters, SessionResponse } from './types/session';

export class SessionService {
  constructor(private api: Api) {}

  async create(data: CreateSessionDTO): Promise<Session | null> {
    return this.api.post<Session>('/sessions', data);
  }

  async getById(id: string): Promise<Session | null> {
    return this.api.get<Session>(`/sessions/${id}`);
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
}

// Example usage in a component:
/*
const handleJoinSession = async (sessionId: string) => {
  const response = await sessionService.join(sessionId);
  if (response) {
    toast.success('Successfully joined session');
    // Handle success case
  }
  // Error is already handled by API class
};

const loadSessions = async () => {
  setLoading(true);
  const response = await sessionService.list();
  if (response) {
    setSessions(response.data);
    setTotalCount(response.total);
  }
  setLoading(false);
};
*/
