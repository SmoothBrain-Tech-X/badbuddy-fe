import React from 'react';
import { Box, Stack, Group, Title, TextInput, Select, ScrollArea, Avatar, Text, Badge, ActionIcon } from '@mantine/core';
import { IconSearch, IconFilter, IconPinned, } from '@tabler/icons-react';
import { ChatContact, FilterType } from '@/services';

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

export default ContactList;