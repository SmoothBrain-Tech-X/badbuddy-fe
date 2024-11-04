import { Avatar, Badge, Button, Group, Paper, Text } from '@mantine/core';
import { IconMessageCircle } from '@tabler/icons-react';
import { Participant } from '@/services';


const ParticipantCard = ({ participant }: { participant: Participant }) => {
    // Format the joined date
    const joinedDate = new Date(participant.joined_at).toLocaleDateString();

    // Determine status color
    const getStatusColor = (status: string) => {
        return status === 'active' ? 'green' : 'red';
    };

    return (
        <Paper p="md" radius="md" withBorder>
            <Group justify="space-between">
                <Group>
                    <Avatar
                        src={participant.avatar_url}
                        size="lg"
                        radius="md"
                        alt={participant.user_name}
                    />
                    <div>
                        <Group gap="xs">
                            <Text fw={500}>{participant.user_name}</Text>
                            <Badge
                                color={getStatusColor(participant.status)}
                                variant="light"
                            >
                                {participant.status}
                            </Badge>
                        </Group>
                        <Text size="sm" c="dimmed">
                            Joined: {joinedDate}
                        </Text>
                    </div>
                </Group>

                <Button
                    variant="light"
                    leftSection={<IconMessageCircle size={16} />}
                >
                    Chat
                </Button>
            </Group>
        </Paper>
    );
};

export default ParticipantCard;