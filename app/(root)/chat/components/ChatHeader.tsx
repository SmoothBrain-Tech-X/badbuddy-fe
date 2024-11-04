import { Box, Group, Text, Avatar, ActionIcon, TextInput, Button } from '@mantine/core';
import { IconSearch, IconDotsVertical, IconPaperclip, IconMoodSmile, IconSend } from '@tabler/icons-react';
import { ChatContact } from '@/services';


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
);

export default ChatHeader;