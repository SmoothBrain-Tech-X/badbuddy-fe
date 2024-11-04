import React from 'react';
import { Paper, Group, Text, Avatar, Button } from '@mantine/core';
import { IconHeart, IconMessageCircle } from '@tabler/icons-react';

interface Message {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    content: string;
    timestamp: string;
    likes: number;
}

const MessageCard: React.FC<{ message: Message }> = ({ message }) => (
    <Paper p="md" radius="md" withBorder>
        <Group align="flex-start">
            <Avatar src={message.user.avatar} radius="md" />
            <div style={{ flex: 1 }}>
                <Group justify="space-between" mb="xs">
                    <Text fw={500}>{message.user.name}</Text>
                    <Text size="sm" c="dimmed">{message.timestamp}</Text>
                </Group>
                <Text>{message.content}</Text>
                <Group mt="xs">
                    <Button
                        variant="subtle"
                        size="xs"
                        leftSection={<IconHeart size={16} />}
                    >
                        {message.likes}
                    </Button>
                    <Button
                        variant="subtle"
                        size="xs"
                        leftSection={<IconMessageCircle size={16} />}
                    >
                        Reply
                    </Button>
                </Group>
            </div>
        </Group>
    </Paper>
);

export default MessageCard;