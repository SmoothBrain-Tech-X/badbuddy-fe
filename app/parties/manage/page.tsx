'use client';

import { useEffect, useState } from 'react';
import {
    Container,
    Title,
    Tabs,
    Card,
    Group,
    Text,
    Badge,
    Button,
    Stack,
    Avatar,
    Paper,
    Box,
    Grid,
    Loader,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconCalendarEvent,
    IconMapPin,
    IconUsers,
    IconClock,
    IconTarget,
    IconUserCircle,
    IconCalendar,
} from '@tabler/icons-react';
import { sessionService, SessionData, sessionResponseDTO, Participant } from '@/services';

interface SessionCardProps {
    session: SessionData;
    onViewDetails: (sessionId: string) => void;
}

const SessionCard = ({ session, onViewDetails }: SessionCardProps) => (
    <Paper p="md" radius="md" withBorder>
        <Group justify="space-between" wrap="nowrap">
            <Group wrap="nowrap">
                <div>
                    <Group gap="xs">
                        <Text fw={500}>{session.title}</Text>
                        <Badge color={session.status === 'open' ? 'green' : 'yellow'}>
                            {session.status}
                        </Badge>
                    </Group>
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
                </div>
            </Group>
            <Stack gap="xs" align="flex-end">
                <Badge variant="light">
                    Player Level: {session.player_level}
                </Badge>
                <Badge variant="dot">
                    {session.confirmed_players}/{session.max_participants} joined
                </Badge>
                {session.cost_per_person > 0 && (
                    <Text size="sm">Cost: ฿{session.cost_per_person}</Text>
                )}
                <Button
                    variant="light"
                    size="xs"
                    onClick={() => onViewDetails(session.id)}
                >
                    View Details
                </Button>
            </Stack>
        </Group>
    </Paper>
);

const SessionManagement = () => {
    const [activeTab, setActiveTab] = useState<string>('joined');
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            setError(null);

            const response: sessionResponseDTO | null = await sessionService.getMe();
            if (response) {
                setSessions(Array.isArray(response.data) ? response.data : []);
                if (response.message) {
                    notifications.show({
                        message: response.message,
                        color: 'green',
                    });
                }
            } else {
                throw new Error('No response from session service');
            }

            if (response.message) {
                notifications.show({
                    message: response.message,
                    color: 'green',
                });
            }
        } catch (err) {
            notifications.show({
                title: 'Error',
                message: 'Failed to load sessions',
                color: 'red',
            });
            setError('Failed to load sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (sessionId: string) => {
        // Implement navigation to session details
        console.log('View details for session:', sessionId);
    };

    // Filter sessions based on active tab and join_status
    const joinedSessions = sessions
    const hostedSessions = sessions.filter(s => s.host_name === 'sarawut inpol');
    const pendingSessions = sessions

    // Sort sessions by date
    const sortedSessions = [...sessions].sort((a, b) =>
        new Date(a.session_date).getTime() - new Date(b.session_date).getTime()
    );

    // Header Component remains the same...
    const HeaderSection = () => (
        <Box bg="blue.6" c="white" py={48}>
            <Container size="xl">
                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack gap="lg">
                            <div>
                                <Text size="xl" fw={500}>Manage Sessions</Text>
                                <Title order={1}>Your Badminton Activities</Title>
                            </div>
                            <Text size="lg">
                                View and manage your sessions, track participation, and handle join requests.
                            </Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    );

    if (loading) {
        return (
            <Box bg="gray.0" style={{ minHeight: '100vh' }}>
                <HeaderSection />
                <Container size="xl" py="xl">
                    <Card shadow="sm" radius="md" withBorder>
                        <Stack align="center" py="xl">
                            <Loader size="lg" />
                            <Text c="dimmed">Loading your sessions...</Text>
                        </Stack>
                    </Card>
                </Container>
            </Box>
        );
    }

    return (
        <Box bg="gray.0">
            <HeaderSection />

            <Container size="xl" py="xl">
                <Card shadow="sm" radius="md" withBorder>
                    <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'joined')}>
                        <Tabs.List>
                            <Tabs.Tab
                                value="joined"
                                leftSection={<IconCalendarEvent size={16} />}
                            >
                                Joined Sessions
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="hosted"
                                leftSection={<IconTarget size={16} />}
                                rightSection={
                                    hostedSessions.length > 0 && (
                                        <Badge size="xs" variant="filled">
                                            {hostedSessions.length}
                                        </Badge>
                                    )
                                }
                            >
                                Hosted Sessions
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="pending"
                                leftSection={<IconUsers size={16} />}
                                rightSection={
                                    pendingSessions.length > 0 && (
                                        <Badge size="xs" variant="filled" color="yellow">
                                            {pendingSessions.length}
                                        </Badge>
                                    )
                                }
                            >
                                Pending
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="joined" pt="md">
                            <Stack>
                                {joinedSessions.map((session) => (
                                    <SessionCard
                                        key={session.id}
                                        session={session}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                                {joinedSessions.length === 0 && (
                                    <Paper p="xl" radius="md" ta="center" c="dimmed">
                                        <IconCalendarEvent size={32} stroke={1.5} />
                                        <Text mt="md">You haven't joined any sessions yet</Text>
                                        <Button variant="light" mt="md">
                                            Find Sessions
                                        </Button>
                                    </Paper>
                                )}
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="hosted" pt="md">
                            <Stack>
                                {hostedSessions.map((session) => (
                                    <SessionCard
                                        key={session.id}
                                        session={session}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                                {hostedSessions.length === 0 && (
                                    <Paper p="xl" radius="md" ta="center" c="dimmed">
                                        <IconTarget size={32} stroke={1.5} />
                                        <Text mt="md">You haven't hosted any sessions</Text>
                                        <Button variant="light" mt="md">
                                            Create Session
                                        </Button>
                                    </Paper>
                                )}
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="pending" pt="md">
                            <Stack>
                                {pendingSessions.map((session) => (
                                    <SessionCard
                                        key={session.id}
                                        session={session}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                                {pendingSessions.length === 0 && (
                                    <Paper p="xl" radius="md" ta="center" c="dimmed">
                                        <IconUsers size={32} stroke={1.5} />
                                        <Text mt="md">No pending sessions</Text>
                                    </Paper>
                                )}
                            </Stack>
                        </Tabs.Panel>
                    </Tabs>
                </Card>
            </Container>
        </Box>
    );
};

export default SessionManagement;