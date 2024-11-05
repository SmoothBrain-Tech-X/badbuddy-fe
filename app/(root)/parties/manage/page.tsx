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
    IconCalendar,
} from '@tabler/icons-react';
import { sessionService } from '@/services';
import { useRouter } from 'next/navigation';
import SessionCard from './components/SessionCard';

interface SessionData {
    id: string;
    title: string;
    session_date: string;
    start_time: string;
    end_time: string;
    venue_name: string;
    venue_location: string;
    player_level: string;
    confirmed_players: number;
    max_participants: number;
    cost_per_person: number;
    status: 'open' | 'closed';
    join_status: 'pending' | 'confirmed';
    host_name: string;
    description: string;
    host_level: string;
    allow_cancellation: boolean;
    cancellation_deadline_hours: number;
    allow_modification: boolean;
    modification_deadline_hours: number;
    allow_guests: boolean;
    guest_limit: number;
    allow_waitlist: boolean;
    waitlist_limit: number;
    is_public: boolean;
    pending_players: number;
    participants: any[];
    rules: string;
    additional_property_1: string; // replace with actual property name and type
    additional_property_2: string; // replace with actual property name and type
    created_at: string;
    updated_at: string;
}

const SessionManagement = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string>('joined');
    const [joinSessions, setJoinSessions] = useState<SessionData[]>([]);
    const [hostSessions, setHostSessions] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch joined sessions
            const joinedResponse = await sessionService.getJoinedSessions();
            if (joinedResponse?.data) {
                setJoinSessions(Array.isArray(joinedResponse.data) ? joinedResponse.data : []);
            }

            // Fetch hosted sessions
            const hostedResponse = await sessionService.getHostedSessions();
            if (hostedResponse?.data) {
                setHostSessions(Array.isArray(hostedResponse.data) ? hostedResponse.data : []);
            }

            // Show success notification
            if (joinedResponse?.message || hostedResponse?.message) {
                notifications.show({
                    message: 'Sessions loaded successfully',
                    color: 'green'
                });
            }
        } catch (err) {
            notifications.show({
                title: 'Error',
                message: 'Failed to load sessions',
                color: 'red'
            });
            setError('Failed to load sessions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleViewDetails = (sessionId: string) => {
        // Redirect to session details page
        router.push(`/parties/${sessionId}`);
        console.log('View details for session:', sessionId);
    };

    const pendingSessions = joinSessions.filter(s => s.join_status === 'pending');
    const confirmedSessions = joinSessions.filter(s => s.join_status === 'confirmed');

    const HeaderSection = () => (
        <Box bg="blue.6" c="white" py={48}>
            <Container size="xl">
                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack gap="lg">
                            <div>
                                <Text size="xl" fw={500}>Manage Sessions</Text>
                                <Title order={1}>Your Badminton Parties</Title>
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
                                    hostSessions.length > 0 && (
                                        <Badge size="xs" variant="filled">
                                            {hostSessions.length}
                                        </Badge>
                                    )
                                }
                            >
                                Hosted Sessions
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="joined" pt="md">
                            <Stack>
                                {confirmedSessions.map((session) => (
                                    <SessionCard
                                        key={session.id}
                                        session={session}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                                {confirmedSessions.length === 0 && (
                                    <Paper p="xl" radius="md" ta="center" c="dimmed">
                                        <IconCalendarEvent size={32} stroke={1.5} />
                                        <Text mt="md">You haven't joined any sessions yet</Text>
                                        <Button variant="light" mt="md" onClick={() => router.push('/parties')}
                                        >
                                            Find Sessions
                                        </Button>
                                    </Paper>
                                )}
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="hosted" pt="md">
                            <Stack>
                                {hostSessions.map((session) => (
                                    <SessionCard
                                        key={session.id}
                                        session={session}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                                {hostSessions.length === 0 && (
                                    <Paper p="xl" radius="md" ta="center" c="dimmed">
                                        <IconTarget size={32} stroke={1.5} />
                                        <Text mt="md">You haven't hosted any sessions</Text>
                                        <Button variant="light" mt="md" onClick={() => router.push('/parties/create')}>
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
        </Box >
    );
};

export default SessionManagement;