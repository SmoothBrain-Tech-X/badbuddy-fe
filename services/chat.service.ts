import { Api } from './api';
import { ChatResponse } from './types/chat';

export class ChatService {
  constructor(private api: Api) {}

  async getMessages(chatId: string): Promise<ChatResponse> {
    return this.api.get<ChatResponse>(`/chats/${chatId}/messages`);
  }
}
