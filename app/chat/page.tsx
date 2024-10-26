'use client';

import { useState, useCallback } from 'react';
import {
    Container, Grid, Card, Group, Text, Badge, Button, Avatar,
    Stack, Box, TextInput, Paper, Title, ActionIcon,
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
}

// Mock Data
const initialContacts: ChatContact[] = [
    {
        id: '1',
        name: 'John Doe',
        avatar: '/api/placeholder/32/32',
        lastMessage: 'See you at the court!',
        timestamp: '12:30 PM',
        unread: 2,
        online: true,
        isPinned: true,
        type: 'user'
    },
    {
        id: '2',
        name: 'Sports Complex A',
        avatar: '/api/placeholder/32/32',
        lastMessage: 'Your booking is confirmed.',
        timestamp: 'Yesterday',
        unread: 0,
        online: true,
        isPinned: true,
        type: 'venue'
    },
    {
        id: '3',
        name: 'Jane Smith',
        avatar: '/api/placeholder/32/32',
        lastMessage: 'Looking forward to playing together',
        timestamp: '2 days ago',
        unread: 0,
        online: false,
        isPinned: false,
        type: 'user'
    },
];

const initialMessages: Record<string, ChatMessage[]> = {
    '1': [
        {
            id: '1',
            content: 'Hey! Are we still on for badminton today?',
            timestamp: '12:00 PM',
            isOwn: false,
            status: 'read',
            type: 'text'
        },
        {
            id: '2',
            content: 'Yes, I willl be there at 4 PM',
            timestamp: '12:05 PM',
            isOwn: true,
            status: 'read',
            type: 'text'
        },
        {
            id: '3',
            content: 'Great! See you at the court!',
            timestamp: '12:30 PM',
            isOwn: false,
            status: 'read',
            type: 'text'
        }
    ],
    '2': [
        {
            id: '1',
            content: 'Booking Confirmation: Court 3, September 18, 2024, 16:00-18:00',
            timestamp: '10:00 AM',
            isOwn: false,
            status: 'read',
            type: 'system'
        }
    ]
};

// Components
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
            <Stack h="100%" spacing={0}>
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
                            onChange={onFilterChange}
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
                    <Stack spacing={0}>
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
                        <Text
                            size="xs"
                            ta="right"
                            style={{ opacity: 0.7 }}
                            mt={4}
                        >
                            {message.timestamp}
                        </Text>
                    </Paper>
                )}
            </Box>
        ))}
    </Stack>
);

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

// Main Component
const ChatInterface = () => {
    // State
    const [state, setState] = useState<ChatState>({
        searchQuery: '',
        selectedChat: '1',
        messageInput: '',
        filterType: 'all'
    });

    // Handlers
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

    const handleSendMessage = useCallback(() => {
        // Implement send message logic
        setState(prev => ({ ...prev, messageInput: '' }));
    }, []);

    // Derived state
    const selectedContact = initialContacts.find(contact => contact.id === state.selectedChat);
    const currentMessages = state.selectedChat ? initialMessages[state.selectedChat] : [];

    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="xl" py="xl">
                <Paper radius="md" withBorder>
                    <Grid h={700} style={{ overflow: 'hidden' }}>
                        <Grid.Col span={{ base: 12, sm: 4 }} p={0} style={{ borderRight: '1px solid var(--mantine-color-gray-3)' }}>
                            <ContactList
                                contacts={initialContacts}
                                selectedChat={state.selectedChat}
                                searchQuery={state.searchQuery}
                                filterType={state.filterType}
                                onContactSelect={handleContactSelect}
                                onSearchChange={handleSearchChange}
                                onFilterChange={handleFilterChange}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 8 }} p={0}>
                            {state.selectedChat ? (
                                <Stack h="100%" spacing={0}>
                                    <ChatHeader contact={selectedContact} />
                                    <ScrollArea h="100%" type="scroll">
                                        <MessageList messages={currentMessages} />
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
                                                style={{ flex: 1 }}
                                                rightSection={
                                                    <ActionIcon variant="subtle">
                                                        <IconMoodSmile size={16} />
                                                    </ActionIcon>
                                                }
                                            />
                                            <Button
                                                disabled={!state.messageInput.trim()}
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