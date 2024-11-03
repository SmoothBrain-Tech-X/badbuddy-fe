'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
    Container, Grid, Paper, Group, Text, Badge, Button, Avatar,
    Stack, Box, TextInput, Title, ActionIcon,
    ScrollArea, Divider, Menu, Select, Center
} from '@mantine/core';
import {
    IconSearch, IconDotsVertical, IconPaperclip, IconMoodSmile,
    IconSend, IconPinned, IconFilter, IconTrash, IconVolume,
    IconVolume3, IconBlockquote, IconFlag
} from '@tabler/icons-react';

// Types
type MessageStatus = 'sent' | 'delivered' | 'read';
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

// WebSocket hook
const useWebSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const messageHandlersRef = useRef<Record<string, (payload: any) => void>>({});

    useEffect(() => {
        wsRef.current = new WebSocket('ws://localhost:8080/ws');

        wsRef.current.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connected');
        };

        wsRef.current.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket disconnected');
            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
                if (wsRef.current?.readyState === WebSocket.CLOSED) {
                    wsRef.current = new WebSocket('ws://localhost:8080/ws');
                }
            }, 5000);
        };

        wsRef.current.onmessage = (event) => {
            try {
                const { type, payload } = JSON.parse(event.data);
                const handler = messageHandlersRef.current[type];
                if (handler) {
                    handler(payload);
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        };

        return () => {
            wsRef.current?.close();
        };
    }, []);

    const sendMessage = useCallback((type: string, payload: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type, payload }));
        }
    }, []);

    const addMessageHandler = useCallback((type: string, handler: (payload: any) => void) => {
        messageHandlersRef.current[type] = handler;
    }, []);

    return {
        isConnected,
        sendMessage,
        addMessageHandler
    };
};

// Components
// (Previous ContactList, MessageList, and ChatHeader components remain the same)

// Main Component
const ChatInterface = () => {
    // State
    const [state, setState] = useState<ChatState>({
        searchQuery: '',
        selectedChat: null,
        messageInput: '',
        filterType: 'all',
        contacts: [],
        messages: {}
    });

    const { isConnected, sendMessage, addMessageHandler } = useWebSocket();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Register message handlers
        addMessageHandler('contacts', (contacts: ChatContact[]) => {
            setState(prev => ({ ...prev, contacts }));
        });

        addMessageHandler('chat_messages', (messages: ChatMessage[]) => {
            setState(prev => ({
                ...prev,
                messages: {
                    ...prev.messages,
                    [prev.selectedChat!]: messages
                }
            }));
        });

        addMessageHandler('new_message', (message: ChatMessage) => {
            setState(prev => {
                const chatId = prev.selectedChat!;
                const currentMessages = prev.messages[chatId] || [];
                return {
                    ...prev,
                    messages: {
                        ...prev.messages,
                        [chatId]: [...currentMessages, message]
                    }
                };
            });
            // Scroll to bottom on new message
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        });

        // Request initial data
        sendMessage('get_contacts', null);
    }, [addMessageHandler, sendMessage]);

    // Handlers
    const handleSearchChange = useCallback((query: string) => {
        setState(prev => ({ ...prev, searchQuery: query }));
    }, []);

    const handleFilterChange = useCallback((filter: FilterType | null) => {
        setState(prev => ({ ...prev, filterType: filter }));
    }, []);

    const handleContactSelect = useCallback((chatId: string) => {
        setState(prev => ({ ...prev, selectedChat: chatId }));
        sendMessage('get_messages', chatId);
    }, [sendMessage]);

    const handleMessageChange = useCallback((message: string) => {
        setState(prev => ({ ...prev, messageInput: message }));
    }, []);

    const handleSendMessage = useCallback(() => {
        if (!state.messageInput.trim() || !state.selectedChat) return;

        sendMessage('send_message', {
            content: state.messageInput,
            chatId: state.selectedChat
        });

        setState(prev => ({ ...prev, messageInput: '' }));
    }, [state.messageInput, state.selectedChat, sendMessage]);

    // Handlers for keyboard events
    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    // Connection status display
    const ConnectionStatus = () => (
        <Badge
            color={isConnected ? 'green' : 'red'}
            variant="dot"
            size="sm"
            style={{ position: 'fixed', top: 20, right: 20 }}
        >
            {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
    );

    return (
        <Box bg="gray.0" mih="100vh">
            <ConnectionStatus />
            <Container size="xl" py="xl">
                <Paper radius="md" withBorder>
                    <Grid h={700} style={{ overflow: 'hidden' }}>
                        {/* Left sidebar with contacts */}
                        <Grid.Col span={{ base: 12, sm: 4 }} p={0} style={{ borderRight: '1px solid var(--mantine-color-gray-3)' }}>
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

                        {/* Main chat area */}
                        <Grid.Col span={{ base: 12, sm: 8 }} p={0}>
                            {state.selectedChat ? (
                                <Stack h="100%" >
                                    <ChatHeader
                                        contact={state.contacts.find(c => c.id === state.selectedChat)}
                                    />
                                    <ScrollArea h="100%" type="scroll">
                                        <MessageList
                                            messages={state.messages[state.selectedChat] || []}
                                        />
                                        <div ref={messagesEndRef} />
                                    </ScrollArea>
                                    <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
                                        <Group>
                                            <ActionIcon variant="subtle">
                                                <IconPaperclip size={16} />
                                            </ActionIcon>
                                            <TextInput
                                                placeholder="Type a message..."
                                                value={state.messageInput}
                                                onChange={(e) => handleMessageChange(e.currentTarget.value)}
                                                onKeyPress={handleKeyPress}
                                                style={{ flex: 1 }}
                                                rightSection={
                                                    <ActionIcon variant="subtle">
                                                        <IconMoodSmile size={16} />
                                                    </ActionIcon>
                                                }
                                            />
                                            <Button
                                                disabled={!state.messageInput.trim() || !isConnected}
                                                rightSection={<IconSend size={16} />}
                                                onClick={handleSendMessage}
                                            >
                                                Send
                                            </Button>
                                        </Group>
                                    </Box>
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

// ContactList Component
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
            .sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return 0;
            });

        return (
            <Stack h="100%" >
                <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
                    <Stack gap="sm">
                        <Group justify="space-between">
                            <Title order={3}>Messages</Title>
                            <ActionIcon variant="light">
                                <IconFilter size={16} />
                            </ActionIcon>
                        </Group>
                        <TextInput
                            placeholder="Search messages..."
                            leftSection={<IconSearch size={16} />}
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.currentTarget.value)}
                        />
                        <Select
                            value={filterType}
                            onChange={(value) => onFilterChange(value as FilterType | null)}
                            data={[
                                { value: 'all', label: 'All Messages' },
                                { value: 'users', label: 'Players' },
                                { value: 'venues', label: 'Venues' },
                            ]}
                            size="xs"
                        />
                    </Stack>
                </Box>

                <ScrollArea h="100%" type="scroll">
                    <Stack >
                        {filteredContacts.map((contact) => (
                            <Box
                                key={contact.id}
                                p="md"
                                style={{
                                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                                    backgroundColor: selectedChat === contact.id ? 'var(--mantine-color-blue-0)' : undefined,
                                    cursor: 'pointer',
                                }}
                                onClick={() => onContactSelect(contact.id)}
                            >
                                <Group justify="space-between" wrap="nowrap">
                                    <Group wrap="nowrap" style={{ flex: 1 }}>
                                        <Box pos="relative">
                                            <Avatar src={contact.avatar} radius="xl" />
                                            {contact.online && (
                                                <Box
                                                    pos="absolute"
                                                    bottom={2}
                                                    right={2}
                                                    w={8}
                                                    h={8}
                                                    style={{ borderRadius: '50%' }}
                                                    bg="green"
                                                />
                                            )}
                                        </Box>
                                        <Box style={{ flex: 1, minWidth: 0 }}>
                                            <Group gap="xs">
                                                <Text fw={500} truncate>{contact.name}</Text>
                                                {contact.type === 'venue' && (
                                                    <Badge size="xs" variant="light">Venue</Badge>
                                                )}
                                            </Group>
                                            <Text size="sm" c="dimmed" truncate>
                                                {contact.lastMessage}
                                            </Text>
                                        </Box>
                                    </Group>
                                    <Stack gap={4} align="flex-end">
                                        <Text size="xs" c="dimmed">{contact.timestamp}</Text>
                                        {contact.unread > 0 && (
                                            <Badge size="xs" variant="filled">
                                                {contact.unread}
                                            </Badge>
                                        )}
                                        {contact.isPinned && (
                                            <ActionIcon size="xs" color="blue" variant="transparent">
                                                <IconPinned size={14} />
                                            </ActionIcon>
                                        )}
                                    </Stack>
                                </Group>
                            </Box>
                        ))}
                    </Stack>
                </ScrollArea>
            </Stack>
        );
    };

// MessageList Component
const MessageList: React.FC<{ messages: ChatMessage[] }> = ({ messages }) => (
    <Stack p="md" gap="xs">
        {messages.map((message) => (
            <Box
                key={message.id}
                maw="70%"
                ml={message.isOwn ? 'auto' : 0}
                mr={message.isOwn ? 0 : 'auto'}
            >
                {message.type === 'system' ? (
                    <Paper
                        p="xs"
                        bg="blue.0"
                        radius="md"
                        ta="center"
                        w="100%"
                    >
                        <Text size="sm">{message.content}</Text>
                    </Paper>
                ) : (
                    <Paper
                        p="sm"
                        bg={message.isOwn ? 'blue.6' : 'gray.1'}
                        c={message.isOwn ? 'white' : 'black'}
                        radius="md"
                    >
                        <Text size="sm">{message.content}</Text>
                        <Group mt={4}>
                            <Text size="xs" style={{ opacity: 0.7 }}>
                                {message.timestamp}
                            </Text>
                            {message.isOwn && (
                                <Text size="xs" style={{ opacity: 0.7 }}>
                                    {message.status === 'sent' && '✓'}
                                    {message.status === 'delivered' && '✓✓'}
                                    {message.status === 'read' && '✓✓'}
                                </Text>
                            )}
                        </Group>
                    </Paper>
                )}
            </Box>
        ))}
    </Stack>
);

// ChatHeader Component
const ChatHeader: React.FC<{ contact: ChatContact | undefined }> = ({ contact }) => (
    <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Group justify="space-between">
            <Group>
                <Avatar src={contact?.avatar} radius="xl" />
                <div>
                    <Text fw={500}>{contact?.name}</Text>
                    {contact?.online ? (
                        <Text size="sm" c="green">Online</Text>
                    ) : (
                        <Text size="sm" c="dimmed">Offline</Text>
                    )}
                </div>
            </Group>
            <Menu>
                <Menu.Target>
                    <ActionIcon variant="subtle">
                        <IconDotsVertical size={16} />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item leftSection={<IconPinned size={14} />}>
                        {contact?.isPinned ? 'Unpin Chat' : 'Pin Chat'}
                    </Menu.Item>
                    <Menu.Item leftSection={<IconVolume3 size={14} />}>
                        Mute Notifications
                    </Menu.Item>
                    <Menu.Item leftSection={<IconBlockquote size={14} />}>
                        Mark as Unread
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item color="red" leftSection={<IconFlag size={14} />}>
                        Report
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Group>
    </Box>
);