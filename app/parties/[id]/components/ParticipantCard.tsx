import { Avatar, Badge, Button, Group, Paper, Text } from '@mantine/core';
import { IconMessageCircle } from '@tabler/icons-react';
import { Participant } from '@/services';

type ParticipantStatus = 'host' | 'confirmed' | 'pending' | 'cancelled';

const ParticipantCard = ({ participant }: { participant: Participant }) => {
    // Format the joined date
    const joinedDate = new Date(participant.joined_at).toLocaleDateString();

    // Determine status color and label
    const getStatusConfig = (status: ParticipantStatus) => {
        switch (status) {
            case 'host':
                return {
                    color: 'blue' as const,
                    label: 'Host',
                    variant: 'filled' as const
                };
            case 'confirmed':
                return {
                    color: 'green' as const,
                    label: 'Confirmed',
                    variant: 'light' as const
                };
            case 'pending':
                return {
                    color: 'yellow' as const,
                    label: 'Pending',
                    variant: 'light' as const
                };
            case 'cancelled':
                return {
                    color: 'red' as const,
                    label: 'Cancelled',
                    variant: 'light' as const
                };
            default:
                return {
                    color: 'gray' as const,
                    label: status,
                    variant: 'light' as const
                };
        }
    };

    const statusConfig = getStatusConfig(participant.status as ParticipantStatus);

    return (
        <Paper
            p="md"
            radius="md"
            withBorder
            className="hover:shadow-md transition-shadow duration-200"
        >
            <Group justify="space-between">
                <Group>
                    <Avatar
                        src={participant.avatar_url || '/api/placeholder/48/48'}
                        size="lg"
                        radius="md"
                        alt={participant.user_name}
                    />
                    <div>
                        <Group gap="xs" mb={4}>
                            <Text fw={500} size="md">
                                {participant.user_name}
                            </Text>
                            <Badge
                                color={statusConfig.color}
                                variant={statusConfig.variant}
                                radius="md"
                                size="md"
                            >
                                {statusConfig.label}
                            </Badge>
                        </Group>
                        <Group gap="xs">
                            <Text size="sm" c="dimmed">
                                Level: {participant.player_level || 'N/A'}
                            </Text>
                            <Text size="sm" c="dimmed">•</Text>
                            <Text size="sm" c="dimmed">
                                Joined: {joinedDate}
                            </Text>
                        </Group>
                    </div>
                </Group>

                {/* <Button
                    variant="light"
                    leftSection={<IconMessageCircle size={16} />}
                    radius="md"
                    className="hover:-translate-y-0.5 transition-transform duration-200"
                    disabled={participant.status === 'cancelled'}
                >
                    Chat
                </Button> */}
            </Group>
        </Paper>
    );
};

export default ParticipantCard;