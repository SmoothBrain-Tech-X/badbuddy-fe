'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IconBlockquote,
  IconDotsVertical,
  IconFilter,
  IconFlag,
  IconMoodSmile,
  IconPaperclip,
  IconPinned,
  IconSearch,
  IconSend,
  IconVolume3,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Menu,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { chatService } from '@/services';
import { ChatService } from '@/services/chat.service';
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import ContactList from './components/ContactList';
import MessageList from './components/MessageList';
import { useWebSocket } from './hooks/useWebSocket';
import { transformApiMessages } from './utils/transformApiMessages';

// ============================================================================
// Types
// ============================================================================

type MessageStatus = 'sent' | 'delivered' | 'read' | 'error';
type MessageType = 'text' | 'image' | 'system';
type ContactType = 'user' | 'venue';
type FilterType = 'all' | 'users' | 'venues';

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status: MessageStatus;
  type: MessageType;
}

interface ChatContact {
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

interface ChatState {
  searchQuery: string;
  selectedChat: string | null;
  messageInput: string;
  filterType: FilterType | null;
  contacts: ChatContact[];
  messages: Record<string, ChatMessage[]>;
}

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  API_BASE_URL: 'https://general-badbuddy-be.tu4rl4.easypanel.host',
  WS_BASE_URL: 'wss://general-badbuddy-be.tu4rl4.easypanel.host',
  CURRENT_USER_ID: '4bce920d-9350-42fd-b9ce-9ea2ddf2fe24',
} as const;

// ============================================================================
// Services
// ============================================================================

const getAuthToken = () => {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzA3NjkwNDgsImlhdCI6MTczMDY4MjY0OCwidXNlcl9pZCI6IjRiY2U5MjBkLTkzNTAtNDJmZC1iOWNlLTllYTJkZGYyZmUyNCJ9.vMx4Oaz76b_Wa9bTAKRAEuWOsVY0BlFaYKTUtTHRcIc';
};
const chatApi = {
  async getMessages(chatId: string): Promise<ChatMessage[]> {
    try {
      console.log('Fetching messages for chat:', chatId);
      const response = await chatService.getMessages(chatId);

      if (!response) {
        return [];
      }
      console.log('Received messages:', response);
      return transformApiMessages(response);
    } catch (error) {
      console.error('Error in getMessages:', error);
      return []; // Return empty array instead of throwing
    }
  },

  async sendMessage(chatId: string, content: string): Promise<ChatMessage> {
    try {
      console.log('Sending message:', { chatId, content });

      const response = await fetch(`${CONFIG.API_BASE_URL}/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Send message response:', data);

      // Create a message object with fallback values
      return {
        id: data?.id || String(Date.now()),
        content: content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isOwn: true,
        status: 'sent',
        type: 'text',
      };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      // Return a fallback message object instead of throwing
      return {
        id: String(Date.now()),
        content: content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isOwn: true,
        status: 'error',
        type: 'text',
      };
    }
  },
};

// ============================================================================
// Main Component
// ============================================================================

const initialState: ChatState = {
  searchQuery: '',
  selectedChat: null,
  messageInput: '',
  filterType: 'all',
  contacts: [
    {
      id: 'dceb617b-6d1b-4fe2-89e2-93b273e5e9d8',
      name: 'John Doe',
      avatar: '/api/placeholder/32/32',
      lastMessage: 'Hey, are you available for a game?',
      timestamp: '10:30 AM',
      unread: 2,
      online: true,
      isPinned: true,
      type: 'user',
    },
  ],
  messages: {},
};
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! This is a test message.',
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    isOwn: false,
    status: 'delivered',
    type: 'text',
  },
];

const ChatInterface = () => {
  const [state, setState] = useState<ChatState>(initialState);
  const { isConnected, sendMessage } = useWebSocket(state.selectedChat);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.selectedChat) {
      setState((prev) => ({
        ...prev,
        messages: {
          ...prev.messages,
          [state.selectedChat!]: [], // Clear messages while loading
        },
      }));

      chatApi
        .getMessages(state.selectedChat)
        .then((messages) => {
          console.log('Received messages:', messages);

          setState((prev) => ({
            ...prev,
            messages: {
              ...prev.messages,
              [state.selectedChat!]: messages.length > 0 ? messages : mockMessages,
            },
          }));

          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        })
        .catch((error) => {
          console.error('Error loading messages:', error);
          // Use mock data on error
          setState((prev) => ({
            ...prev,
            messages: {
              ...prev.messages,
              [state.selectedChat!]: mockMessages,
            },
          }));
        });
    }
  }, [state.selectedChat]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const handleSearchChange = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const handleFilterChange = useCallback((filter: FilterType | null) => {
    setState((prev) => ({ ...prev, filterType: filter }));
  }, []);

  const handleContactSelect = useCallback((chatId: string) => {
    setState((prev) => ({ ...prev, selectedChat: chatId }));
  }, []);

  const handleMessageChange = useCallback((message: string) => {
    setState((prev) => ({ ...prev, messageInput: message }));
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!state.messageInput.trim() || !state.selectedChat) return;

    try {
      const newMessage = await chatApi.sendMessage(state.selectedChat, state.messageInput);
      sendMessage(state.messageInput);

      setState((prev) => ({
        ...prev,
        messageInput: '',
        messages: {
          ...prev.messages,
          [state.selectedChat!]: [...(prev.messages[state.selectedChat!] || []), newMessage],
        },
      }));

      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [state.messageInput, state.selectedChat, sendMessage]);

  return (
    <Box bg="gray.0" mih="100vh">
      <Container size="xl" py="xl">
        <Paper
          radius="lg"
          withBorder
          style={{
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Grid h={700} style={{ overflow: 'hidden' }} p={0}>
            {/* Contacts sidebar */}
            <Grid.Col
              h={700}
              span={{ base: 12, sm: 4 }}
              p={0}
              style={{
                borderRight: '1px solid var(--mantine-color-gray-3)',
                backgroundColor: '#ffffff',
              }}
            >
              <ContactList
                contacts={state.contacts}
                selectedChat={state.selectedChat}
                searchQuery={state.searchQuery}
                filterType={state.filterType}
                onContactSelect={handleContactSelect}
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
              />
            </Grid.Col>

            {/* Chat area */}
            <Grid.Col h={700} span={{ base: 12, sm: 8 }} p={0}>
              {state.selectedChat ? (
                <Stack h="100%" gap={0}>
                  <ChatHeader contact={state.contacts.find((c) => c.id === state.selectedChat)} />
                  <Box
                    style={{
                      flex: 1,
                      backgroundColor: '#f1f3f5',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <ScrollArea
                      type="scroll"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                      viewportProps={{
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                        },
                      }}
                    >
                      <Box style={{ marginTop: 'auto' }}>
                        <MessageList messages={state.messages[state.selectedChat] || []} />
                      </Box>
                      <div ref={messagesEndRef} />
                    </ScrollArea>
                  </Box>
                  <ChatInput
                    value={state.messageInput}
                    onChange={handleMessageChange}
                    onSend={handleSendMessage}
                    disabled={!isConnected}
                  />
                </Stack>
              ) : (
                <Center h="100%">
                  <Text c="dimmed">Select a chat to start messaging</Text>
                </Center>
              )}
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChatInterface;
