import { Paper, Group, Avatar, Text, Badge, Stack, Button } from '@mantine/core';
import { IconClock, IconMapPin } from '@tabler/icons-react';
import { Party } from '../types';

interface PartyCardProps {
    party: Party;
}

export const PartyCard: React.FC<PartyCardProps> = ({ party }) => (
    <Paper p="md" radius="md" withBorder>
        <Group justify="space-between" wrap="nowrap">
            <Group wrap="nowrap">
                <Avatar src={party.host.avatar} radius="xl" />
                <div>
                    <Group gap="xs">
                        <Text fw={500}>{party.title}</Text>
                        <Badge color={party.type === 'tournament' ? 'orange' : 'blue'}>
                            {party.type === 'tournament' ? 'Tournament' : 'Practice'}
                        </Badge>
                    </Group>
                    <Group gap="xs">
                        <IconClock size={14} />
                        <Text size="sm" c="dimmed">{party.time}</Text>
                        <Text size="sm" c="dimmed">•</Text>
                        <IconMapPin size={14} />
                        <Text size="sm" c="dimmed">{party.location}</Text>
                    </Group>
                </div>
            </Group>
            <Stack gap="xs" align="flex-end">
                <Badge>
                    {party.participants.current}/{party.participants.max} joined
                </Badge>
                <Button variant="light" size="xs">
                    View Details
                </Button>
            </Stack>
        </Group>
    </Paper>
);
