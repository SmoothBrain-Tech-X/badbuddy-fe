import { Group, Text, Badge, Button, Stack, Paper } from '@mantine/core';
import {
    IconCalendar,
    IconClock,
    IconMapPin,
    IconUserCircle,
    IconAlertCircle,
} from '@tabler/icons-react';

interface SessionData {
    id: string;
    title: string;
    description: string;
    venue_name: string;
    venue_location: string;
    host_name: string;
    host_level: string;
    session_date: string;
    start_time: string;
    end_time: string;
    player_level: string;
    max_participants: number;
    cost_per_person: number;
    status: 'open' | 'closed' | 'cancelled';
    allow_cancellation: boolean;
    cancellation_deadline_hours: number;
    is_public: boolean;
    confirmed_players: number;
    pending_players: number;
    participants: any[];
    rules: string | null;
    created_at: string;
    updated_at: string;
    join_status: string | null;
}

interface SessionCardProps {
    session: SessionData;
    onViewDetails: (sessionId: string) => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'open':
            return 'green';
        case 'cancelled':
            return 'red';
        case 'closed':
            return 'yellow';
        default:
            return 'gray';
    }
};

const SessionCard = ({ session, onViewDetails }: SessionCardProps) => (
    <Paper p="md" radius="md" withBorder>
        <Group justify="space-between" wrap="nowrap">
            <Group wrap="nowrap">
                <div>
                    <Group gap="xs">
                        <Text fw={500}>{session.title}</Text>
                        <Badge color={getStatusColor(session.status)}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </Badge>
                    </Group>

                    <Text size="sm" c="dimmed" mb="xs">
                        {session.description}
                    </Text>

                    <Group gap="xs">
                        <IconCalendar size={14} />
                        <Text size="sm" c="dimmed">
                            {new Date(session.session_date).toLocaleDateString()}
                        </Text>
                        <Text size="sm" c="dimmed">•</Text>
                        <IconClock size={14} />
                        <Text size="sm" c="dimmed">
                            {session.start_time} - {session.end_time}
                        </Text>
                    </Group>

                    <Group gap="xs">
                        <IconMapPin size={14} />
                        <Text size="sm" c="dimmed">{session.venue_name}, {session.venue_location}</Text>
                    </Group>

                    <Group gap="xs">
                        <IconUserCircle size={14} />
                        <Text size="sm" c="dimmed">Host: {session.host_name} ({session.host_level})</Text>
                    </Group>
                </div>
            </Group>

            <Stack gap="xs" align="flex-end">
                <Badge variant="light">
                    Player Level: {session.player_level}
                </Badge>
                <Badge variant="dot">
                    {session.confirmed_players}/{session.max_participants} joined
                </Badge>
                {session.pending_players > 0 && (
                    <Badge variant="dot" color="yellow">
                        {session.pending_players} pending
                    </Badge>
                )}
                {session.cost_per_person > 0 && (
                    <Text size="sm">Cost: ฿{session.cost_per_person}</Text>
                )}
                {session.allow_cancellation && (
                    <Group gap="xs">
                        <IconAlertCircle size={14} />
                        <Text size="xs" c="dimmed">
                            {session.cancellation_deadline_hours}h cancellation
                        </Text>
                    </Group>
                )}
                <Button
                    variant="light"
                    size="xs"
                    onClick={() => onViewDetails(session.id)}
                    disabled={session.status === 'cancelled'}
                >
                    View Details
                </Button>
            </Stack>
        </Group>
    </Paper>
);

export default SessionCard;