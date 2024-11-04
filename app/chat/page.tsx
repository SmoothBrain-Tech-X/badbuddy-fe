'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
    Container, Grid, Paper, Group, Text, Badge, Button, Avatar,
    Stack, Box, TextInput, Title, ActionIcon,
    ScrollArea, Menu, Select, Center
} from '@mantine/core';
import {
    IconSearch, IconDotsVertical, IconPaperclip, IconMoodSmile,
    IconSend, IconPinned, IconFilter, IconVolume3,
    IconBlockquote, IconFlag
} from '@tabler/icons-react';

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
    API_BASE_URL: 'http://localhost:8004',
    WS_BASE_URL: 'ws://localhost:8004',
    CURRENT_USER_ID: '4bce920d-9350-42fd-b9ce-9ea2ddf2fe24',
} as const;

// ============================================================================
// Services
// ============================================================================

const getAuthToken = () => {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzA3NjkwNDgsImlhdCI6MTczMDY4MjY0OCwidXNlcl9pZCI6IjRiY2U5MjBkLTkzNTAtNDJmZC1iOWNlLTllYTJkZGYyZmUyNCJ9.vMx4Oaz76b_Wa9bTAKRAEuWOsVY0BlFaYKTUtTHRcIc';
};
const transformApiMessages = (response: any): ChatMessage[] => {
    try {
        // Add logging to see the exact structure
        console.log('Transforming response:', response);

        // Handle different possible response structures
        const messages = response?.data?.messages ||
            response?.data?.chat_massage ||
            response?.data ||
            [];

        // Validate that messages is an array
        if (!Array.isArray(messages)) {
            console.error('Messages is not an array:', messages);
            return [];
        }

        return messages.map(msg => {
            // Add validation for each message object
            if (!msg) {
                console.error('Invalid message object:', msg);
                return null;
            }

            try {
                return {
                    id: msg.id || String(Date.now() + Math.random()),
                    content: msg.message || '',
                    timestamp: msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    isOwn: msg.author?.id === CONFIG.CURRENT_USER_ID,
                    status: 'delivered' as MessageStatus,
                    type: 'text' as MessageType
                };
            } catch (err) {
                console.error('Error transforming message:', msg, err);
                return null;
            }
        }).filter((msg): msg is ChatMessage => msg !== null);
    } catch (err) {
        console.error('Error in transformApiMessages:', err);
        return [];
    }
};

const chatApi = {
    async getMessages(chatId: string): Promise<ChatMessage[]> {
        try {
            console.log('Fetching messages for chat:', chatId);

            const response = await fetch(`${CONFIG.API_BASE_URL}/api/chats/${chatId}/messages`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const rawData = await response.json();
            console.log('Raw API response:', rawData);

            // Return transformed messages with error handling
            return transformApiMessages(rawData);
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
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: content })
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
                    minute: '2-digit'
                }),
                isOwn: true,
                status: 'sent',
                type: 'text'
            };
        } catch (error) {
            console.error('Error in sendMessage:', error);
            // Return a fallback message object instead of throwing
            return {
                id: String(Date.now()),
                content: content,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                isOwn: true,
                status: 'error',
                type: 'text'
            };
        }
    }
};

// ============================================================================
// Hooks
// ============================================================================

const useWebSocket = (chatId: string | null) => {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

    const connect = useCallback(() => {
        if (!chatId) return;

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }

        wsRef.current = new WebSocket(`${CONFIG.WS_BASE_URL}/ws/${chatId}`);

        wsRef.current.onopen = () => {
            setIsConnected(true);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };

        wsRef.current.onclose = () => {
            setIsConnected(false);
            reconnectTimeoutRef.current = setTimeout(connect, 5000);
        };

        wsRef.current.onerror = () => {
            wsRef.current?.close();
        };
    }, [chatId]);

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            wsRef.current?.close();
        };
    }, [connect]);

    const sendMessage = useCallback((content: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ message: content }));
            return true;
        }
        return false;
    }, []);

    return { isConnected, sendMessage };
};

// ============================================================================
// Components
// ============================================================================
const ContactList: React.FC<{
    contacts: ChatContact[];
    selectedChat: string | null;
    searchQuery: string;
    filterType: FilterType | null;
    onContactSelect: (id: string) => void;
    onSearchChange: (query: string) => void;
    onFilterChange: (filter: FilterType | null) => void;
}> = ({
    contacts,
    selectedChat,
    searchQuery,
    filterType,
    onContactSelect,
    onSearchChange,
    onFilterChange
}) => {
        const filteredContacts = contacts
            .filter(contact => {
                if (filterType === 'users' && contact.type !== 'user') return false;
                if (filterType === 'venues' && contact.type !== 'venue') return false;
                return contact.name.toLowerCase().includes(searchQuery.toLowerCase());
            })
            .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

        return (
            <Stack h="100%" gap={0}>
                {/* Header */}
                <Box
                    p="md"
                    style={{
                        borderBottom: '1px solid #e9ecef',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <Stack gap="sm" p={12}>
                        <Group justify="space-between" align="center">
                            <Title order={4} style={{ fontWeight: 500 }}>Chats</Title>
                            <Group gap="xs">
                                <ActionIcon
                                    variant="subtle"
                                    radius="xl"
                                    color="dark"
                                >
                                    <IconFilter size={18} />
                                </ActionIcon>
                            </Group>
                        </Group>
                        <TextInput
                            placeholder="Search chats..."
                            leftSection={<IconSearch size={16} style={{ color: '#868e96' }} />}
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.currentTarget.value)}
                            styles={{
                                input: {
                                    backgroundColor: '#f8f9fa',
                                    border: 'none',
                                    borderRadius: '20px',
                                    '&:focus': {
                                        backgroundColor: '#f8f9fa'
                                    }
                                }
                            }}
                        />
                        <Select
                            value={filterType}
                            onChange={(value) => onFilterChange(value as FilterType | null)}
                            data={[
                                { value: 'all', label: 'All Chats' },
                                { value: 'users', label: 'Players' },
                                { value: 'venues', label: 'Venues' },
                            ]}
                            styles={{
                                input: {
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }
                            }}
                        />
                    </Stack>
                </Box>

                {/* Contact List */}
                <ScrollArea h="100%" type="scroll">
                    <Stack gap={0}>
                        {filteredContacts.map((contact) => (
                            <Box
                                key={contact.id}
                                py="md"
                                px="lg"
                                style={{
                                    backgroundColor: selectedChat === contact.id ? '#f1f3f5' : '#ffffff',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: '#f8f9fa'
                                    }
                                }}
                                onClick={() => onContactSelect(contact.id)}
                            >
                                <Group wrap="nowrap" align="flex-start">
                                    <Box pos="relative">
                                        <Avatar
                                            src={contact.avatar}
                                            radius="xl"
                                            size="lg"
                                            style={{
                                                border: contact.online ? '2px solid #51cf66' : 'none'
                                            }}
                                        />
                                        {contact.online && (
                                            <Box
                                                pos="absolute"
                                                bottom={2}
                                                right={2}
                                                w={12}
                                                h={12}
                                                style={{
                                                    borderRadius: '50%',
                                                    backgroundColor: '#51cf66',
                                                    border: '2px solid white'
                                                }}
                                            />
                                        )}
                                        {contact.isPinned && (
                                            <Box
                                                pos="absolute"
                                                top={-4}
                                                right={-4}
                                                style={{
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '50%',
                                                    padding: '2px'
                                                }}
                                            >
                                                <IconPinned size={14} color="#868e96" />
                                            </Box>
                                        )}
                                    </Box>

                                    <Box style={{ flex: 1, minWidth: 0 }}>
                                        <Group justify='space-between' mb={4}>
                                            <Text
                                                fw={500}
                                                size="sm"
                                                truncate
                                                style={{ color: '#495057' }}
                                            >
                                                {contact.name}
                                            </Text>
                                            <Text
                                                size="xs"
                                                c="dimmed"
                                                style={{ whiteSpace: 'nowrap' }}
                                            >
                                                {contact.timestamp}
                                            </Text>
                                        </Group>
                                        <Group justify='space-between' align="center">
                                            <Text
                                                size="sm"
                                                c="dimmed"
                                                truncate
                                                style={{
                                                    flex: 1,
                                                    fontWeight: contact.unread > 0 ? 500 : 400
                                                }}
                                            >
                                                {contact.lastMessage}
                                            </Text>
                                            {contact.unread > 0 && (
                                                <Badge
                                                    size="sm"
                                                    radius="xl"
                                                    style={{
                                                        backgroundColor: '#51cf66',
                                                        minWidth: '20px',
                                                        height: '20px',
                                                        padding: '0 6px'
                                                    }}
                                                >
                                                    {contact.unread}
                                                </Badge>
                                            )}
                                            {contact.type === 'venue' && (
                                                <Badge
                                                    size="sm"
                                                    variant="light"
                                                    radius="sm"
                                                    color="gray"
                                                >
                                                    Venue
                                                </Badge>
                                            )}
                                        </Group>
                                    </Box>
                                </Group>
                            </Box>
                        ))}
                    </Stack>
                </ScrollArea>
            </Stack>
        );
    };
const MessageList: React.FC<{ messages: ChatMessage[] }> = ({ messages }) => (
    <Stack p="md" gap="md">
        {messages.map((message) => (
            <Box
                key={message.id}
                w="100%"
                style={{ position: 'relative' }}
            >
                {message.type === 'system' ? (
                    <Paper
                        p="xs"
                        bg="gray.1"
                        radius="xl"
                        ta="center"
                        maw="70%"
                        mx="auto"
                    >
                        <Text size="sm" c="dimmed">{message.content}</Text>
                    </Paper>
                ) : (
                    <Group justify={!message.isOwn ? "flex-end" : "flex-start"} align="flex-end" wrap="nowrap" w="100%">
                        {/* Avatar - Only show for other's messages */}
                        {message.isOwn && (
                            <Avatar
                                size="md"
                                radius="xl"
                                src="/api/placeholder/32/32"
                                style={{ marginRight: 8 }}
                            />
                        )}

                        <Box style={{ maxWidth: '70%' }}>
                            {/* Name - Only show for other's messages */}
                            {message.isOwn && (
                                <Text size="xs" mb={4} c="dimmed">John Doe</Text>
                            )}

                            <Group gap={4} align="flex-end" wrap="nowrap">
                                {/* Timestamp and Status for Own Messages (Left side) */}
                                {!message.isOwn && (
                                    <Box style={{ minWidth: '55px', textAlign: 'right', paddingRight: 4 }}>
                                        <Stack gap={2} align="flex-end">
                                            {message.status !== 'error' && (
                                                <Text size="xs" c="dimmed">
                                                    {message.status === 'sent' && '✓'}
                                                    {message.status === 'delivered' && '✓✓'}
                                                    {message.status === 'read' && (
                                                        <Text span c="blue">✓✓</Text>
                                                    )}
                                                </Text>
                                            )}
                                            <Text size="xs" c="dimmed">
                                                {message.timestamp}
                                            </Text>
                                        </Stack>
                                    </Box>
                                )}

                                {/* Message Bubble */}
                                <Paper
                                    p="xs"
                                    style={{
                                        backgroundColor: !message.isOwn ? '#95de64' : 'white',
                                        borderRadius: message.isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                        position: 'relative',
                                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                        maxWidth: '100%',
                                        wordBreak: 'break-word',
                                        marginLeft: message.isOwn ? 0 : '4px',
                                        marginRight: message.isOwn ? '4px' : 0
                                    }}
                                >
                                    <Text
                                        size="sm"
                                        style={{
                                            lineHeight: 1.4,
                                            color: '#2C2C2C',
                                            padding: '2px 4px'
                                        }}
                                    >
                                        {message.content}
                                    </Text>

                                    {/* Error Icon */}
                                    {message.status === 'error' && (
                                        <Box
                                            style={{
                                                position: 'absolute',
                                                right: -24,
                                                bottom: 0,
                                                color: 'red'
                                            }}
                                        >
                                            ⚠️
                                        </Box>
                                    )}
                                </Paper>

                                {/* Timestamp and Status for Others' Messages (Right side) */}
                                {message.isOwn && (
                                    <Box style={{ minWidth: '55px', paddingLeft: 4 }}>
                                        <Stack gap={2}>
                                            {message.status !== 'error' && (
                                                <Text size="xs" c="dimmed">
                                                    {message.status === 'sent' && '✓'}
                                                    {message.status === 'delivered' && '✓✓'}
                                                    {message.status === 'read' && (
                                                        <Text span c="blue">✓✓</Text>
                                                    )}
                                                </Text>
                                            )}
                                            <Text size="xs" c="dimmed">
                                                {message.timestamp}
                                            </Text>
                                        </Stack>
                                    </Box>
                                )}
                            </Group>
                        </Box>
                    </Group>
                )}
            </Box>
        ))}
    </Stack>
);

const ChatHeader: React.FC<{ contact: ChatContact | undefined }> = ({ contact }) => (
    <Box
        p="md"
        style={{
            borderBottom: '1px solid var(--mantine-color-gray-3)',
            backgroundColor: '#ffffff',
        }}
    >
        <Group justify="space-between" align="center">
            <Group gap="sm">
                <Avatar
                    src={contact?.avatar}
                    radius="xl"
                    size="md"
                />
                <Box>
                    <Text fw={500} size="sm">
                        {contact?.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                        {contact?.online ? 'Active now' : 'Offline'}
                    </Text>
                </Box>
            </Group>

            <Group gap="xs">
                <ActionIcon variant="subtle" radius="xl">
                    <IconSearch size={18} />
                </ActionIcon>
                <ActionIcon variant="subtle" radius="xl">
                    <IconDotsVertical size={18} />
                </ActionIcon>
            </Group>
        </Group>
    </Box>
); const ChatInput: React.FC<{
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled: boolean;
}> = ({ value, onChange, onSend, disabled }) => (
    <Box
        p="xs"
        style={{
            borderTop: '1px solid var(--mantine-color-gray-3)',
            backgroundColor: '#f8f9fa',
            width: '100%'
        }}
    >
        <Group gap="xs" align="flex-end" style={{ width: '100%' }}>
            <ActionIcon
                variant="subtle"
                radius="xl"
                size="lg"
                color="gray"
                style={{ flexShrink: 0 }}
            >
                <IconPaperclip size={20} />
            </ActionIcon>

            <Box style={{ flex: 1, minWidth: 0 }}>
                <TextInput
                    placeholder="Type a message..."
                    value={value}
                    onChange={(e) => onChange(e.currentTarget.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onSend();
                        }
                    }}
                    styles={{
                        root: {
                            width: '100%'
                        },
                        wrapper: {
                            width: '100%'
                        },
                        input: {
                            borderRadius: '20px',
                            backgroundColor: 'white',
                            minHeight: '40px',
                            paddingRight: '40px',
                            fontSize: '14px',
                            width: '100%'
                        }
                    }}
                    rightSection={
                        <ActionIcon
                            variant="subtle"
                            radius="xl"
                            onClick={() => {/* Handle emoji picker */ }}
                            style={{ position: 'absolute', right: 8 }}
                        >
                            <IconMoodSmile size={18} />
                        </ActionIcon>
                    }
                />
            </Box>

            <Button
                disabled={!value.trim() || disabled}
                radius="xl"
                size="sm"
                style={{
                    backgroundColor: value.trim() && !disabled ? '#06c755' : 'var(--mantine-color-gray-4)',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    minWidth: '40px',
                    flexShrink: 0
                }}
                onClick={onSend}
            >
                <IconSend size={18} />
            </Button>
        </Group>
    </Box>
);
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
            type: 'user'
        }
    ],
    messages: {}
};
const mockMessages: ChatMessage[] = [
    {
        id: '1',
        content: 'Hello! This is a test message.',
        timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        }),
        isOwn: false,
        status: 'delivered',
        type: 'text'
    }
];

const ChatInterface = () => {
    const [state, setState] = useState<ChatState>(initialState);
    const { isConnected, sendMessage } = useWebSocket(state.selectedChat);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (state.selectedChat) {
            setState(prev => ({
                ...prev,
                messages: {
                    ...prev.messages,
                    [state.selectedChat!]: [] // Clear messages while loading
                }
            }));

            chatApi.getMessages(state.selectedChat)
                .then(messages => {
                    console.log('Received messages:', messages);

                    setState(prev => ({
                        ...prev,
                        messages: {
                            ...prev.messages,
                            [state.selectedChat!]: messages.length > 0 ? messages : mockMessages
                        }
                    }));

                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                })
                .catch(error => {
                    console.error('Error loading messages:', error);
                    // Use mock data on error
                    setState(prev => ({
                        ...prev,
                        messages: {
                            ...prev.messages,
                            [state.selectedChat!]: mockMessages
                        }
                    }));
                });
        }
    }, [state.selectedChat]);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [state.messages]);

    const handleSearchChange = useCallback((query: string) => {
        setState(prev => ({ ...prev, searchQuery: query }));
    }, []);

    const handleFilterChange = useCallback((filter: FilterType | null) => {
        setState(prev => ({ ...prev, filterType: filter }));
    }, []);

    const handleContactSelect = useCallback((chatId: string) => {
        setState(prev => ({ ...prev, selectedChat: chatId }));
    }, []);

    const handleMessageChange = useCallback((message: string) => {
        setState(prev => ({ ...prev, messageInput: message }));
    }, []);

    const handleSendMessage = useCallback(async () => {
        if (!state.messageInput.trim() || !state.selectedChat) return;

        try {
            const newMessage = await chatApi.sendMessage(state.selectedChat, state.messageInput);
            sendMessage(state.messageInput);

            setState(prev => ({
                ...prev,
                messageInput: '',
                messages: {
                    ...prev.messages,
                    [state.selectedChat!]: [
                        ...(prev.messages[state.selectedChat!] || []),
                        newMessage
                    ]
                }
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
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
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
                                backgroundColor: '#ffffff'
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
                                    <ChatHeader
                                        contact={state.contacts.find(c => c.id === state.selectedChat)}
                                    />
                                    <Box
                                        style={{
                                            flex: 1,
                                            backgroundColor: '#f1f3f5',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <ScrollArea
                                            type="scroll"
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0
                                            }}
                                            viewportProps={{
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'flex-end'
                                                }
                                            }}
                                        >
                                            <Box style={{ marginTop: 'auto' }}>
                                                <MessageList
                                                    messages={state.messages[state.selectedChat] || []}
                                                />
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