export type MessageStatus = 'sent' | 'delivered' | 'read' | 'error';
export type MessageType = 'text' | 'image' | 'system';
export type ContactType = 'user' | 'venue';
export type FilterType = 'all' | 'users' | 'venues';

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status: MessageStatus;
  type: MessageType;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  isPinned: boolean;
  type: ContactType;
}

export interface ChatState {
  searchQuery: string;
  selectedChat: string | null;
  messageInput: string;
  filterType: FilterType | null;
  contacts: ChatContact[];
  messages: Record<string, ChatMessage[]>;
}

export interface ChatResponse {
  messages: string;
  data: {
    chat_message: ChatMessage[];
  };
}
