'use client';

import { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Card,
    Group,
    Text,
    Badge,
    Button,
    Avatar,
    Tabs,
    TextInput,
    Progress,
    Stack,
    Box,
    ActionIcon,
    Paper,
    Breadcrumbs,
    Anchor,
    Title,
    List,
    ThemeIcon,
    rem,
} from '@mantine/core';
import {
    IconMapPin,
    IconUsers,
    IconArrowLeft,
    IconMessageCircle,
    IconSend,
    IconCrown,
    IconShare,
    IconHeart,
    IconThumbUp,
    IconCalendar,
    IconAlertCircle,
    IconChevronRight,
    IconProps,
} from '@tabler/icons-react';
import { SessionData, Participant, sessionService } from '@/services';
import ParticipantCard from './components/ParticipantCard';
import SafetyGuidelines from './components/SafetyGuidelines';
import ParticipantsProgress from './components/ParticipantsProgress';
import MessageCard from './components/MessageCard';
import PartyHeader from './components/PartyHeader';
import InfoItem from './components/InfoItem';

// Types
interface Host {
    name: string;
    avatar: string;
    hostedParties: number;
}



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

interface PartyDetails {
    id: string;
    title: string;
    location: string;
    time: string;
    description: string;
    price: string;
    participants: {
        current: number;
        max: number;
    };
    court: string;
    level: string;
    isJoined: boolean;
    host: Host;
    likes: number;
    views: number;
    status: string;
}






export const DEFAULT_PARTY_DATA: SessionData = {
    id: "",
    title: "",
    description: "",
    venue_name: "",
    venue_location: "",
    courts: null,
    host_name: "",
    host_level: "",
    session_date: "",
    start_time: "",
    end_time: "",
    player_level: "",
    max_participants: 0,
    cost_per_person: 0,
    status: "pending",
    allow_cancellation: false,
    cancellation_deadline_hours: 0,
    confirmed_players: 0,
    pending_players: 0,
    participants: [],
    created_at: "",
    updated_at: "",
}


// Main Component
const PartyView: React.FC = () => {
    const [message, setMessage] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('chat');
    const [sessionDetails, setSessionDetails] = useState<SessionData>(DEFAULT_PARTY_DATA);


    const fetchSessionData = async () => {
        try {
            const response = await sessionService.getById("0405f815-1a23-4c46-b89a-53c940b7d684")
            setSessionDetails(response?.data || DEFAULT_PARTY_DATA)
        }
        catch (error) {
            console.error(error
            )
        }
    };

    useEffect(() => {
        fetchSessionData();
    }
        , []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'cancelled':
                return 'red';
            case 'pending':
                return 'yellow';
            case 'confirmed':
                return 'green';
            default:
                return 'blue';
        }
    };

    const partyDetails: PartyDetails = {
        id: "0405f815-1a23-4c46-b89a-53c940b7d684",
        title: "Evening Badminton Session",
        location: "Bangkok",
        time: ``,
        description: "Friendly doubles matches for intermediate players",
        price: `$${15}/person`,
        participants: {
            current: 0,
            max: 4
        },
        court: "Updated Court Name",
        level: "intermediate",
        isJoined: false,
        host: {
            name: "John Doe",
            avatar: '/api/placeholder/32/32',
            hostedParties: 0,
        },
        likes: 0,
        views: 0,
        status: "cancelled"
    };
    const messages: Message[] = [
        {
            id: '1',
            user: { name: 'John Doe', avatar: '/api/placeholder/32/32' },
            content: 'Session has been cancelled.',
            timestamp: new Date().toLocaleTimeString(),
            likes: 0,
        },
    ];




    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="xl" py="xl">
                <Breadcrumbs mb="lg" separator={<IconChevronRight size={16} />}>
                    <Anchor href="/" onClick={(e) => {
                        e.preventDefault();
                        window.history.back();
                    }}>
                        <Group gap="xs">
                            <IconArrowLeft size={16} />
                            <span>Home</span>
                        </Group>
                    </Anchor>
                    <Text>Badminton</Text>
                </Breadcrumbs>

                <Grid gutter="lg">
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Card shadow="sm" radius="md" mb="lg" p={0} withBorder>
                            <PartyHeader
                                party={sessionDetails}
                                isLiked={isLiked}
                                onLikeToggle={() => setIsLiked(!isLiked)}
                            />

                            {/* Status Badge */}
                            {sessionDetails.status && (
                                <Box p="md">
                                    <Badge
                                        color={getStatusColor(sessionDetails.status)}
                                        size="lg"
                                        variant="filled"
                                    >
                                        {sessionDetails.status.toUpperCase()}
                                    </Badge>
                                </Box>
                            )}

                            <Stack p="xl">
                                <Grid>
                                    {[
                                        { icon: IconMapPin, label: 'Location', value: partyDetails.location },
                                        { icon: IconCalendar, label: 'Date & Time', value: partyDetails.time },
                                        { icon: IconUsers, label: 'Participants', value: `${partyDetails.participants.current}/${partyDetails.participants.max}` },
                                    ].map((item, index) => (
                                        <Grid.Col span={{ base: 12, sm: 4 }} key={index}>
                                            <InfoItem {...item} />
                                        </Grid.Col>
                                    ))}
                                </Grid>

                                <div>
                                    <Text fw={500} mb="xs" size="lg">Description</Text>
                                    <Paper p="md" radius="md" bg="blue.0">
                                        <Text>{sessionDetails.description}</Text>
                                    </Paper>
                                </div>

                                <div>
                                    <Text fw={500} mb="xs" size="lg">What to Bring</Text>
                                    <Grid>
                                        {['Badminton Racket', 'Sports Attire & Shoes'].map((item, index) => (
                                            <Grid.Col span={6} key={index}>
                                                <Paper p="md" radius="md" bg="green.0">
                                                    <Group>
                                                        <ThemeIcon color="green" variant="light">
                                                            <IconThumbUp size={16} />
                                                        </ThemeIcon>
                                                        <Text>{item}</Text>
                                                    </Group>
                                                </Paper>
                                            </Grid.Col>
                                        ))}
                                    </Grid>
                                </div>

                                <div>
                                    <Text fw={500} mb="xs" size="lg">Important Notes</Text>
                                    <Paper p="md" radius="md" bg="orange.0" withBorder>
                                        <Group align="flex-start">
                                            <ThemeIcon color="orange" variant="light">
                                                <IconAlertCircle size={16} />
                                            </ThemeIcon>
                                            <Text>Please arrive 15 minutes early for warm-up</Text>
                                        </Group>
                                    </Paper>
                                </div>
                            </Stack>
                        </Card>

                        <Card shadow="sm" radius="md" withBorder>
                            <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'chat')}>
                                <Tabs.List>
                                    <Tabs.Tab value="chat" leftSection={<IconMessageCircle size={16} />}>
                                        Chat
                                    </Tabs.Tab>
                                    <Tabs.Tab value="participants" leftSection={<IconUsers size={16} />}>
                                        Participants
                                    </Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="chat" p="md">
                                    <Stack>
                                        {messages.map((msg) => (
                                            <MessageCard key={msg.id} message={msg} />
                                        ))}
                                        <Group mt="md">
                                            <TextInput
                                                placeholder="Type a message..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                style={{ flex: 1 }}
                                            />
                                            <ActionIcon variant="filled" color="blue" size="lg">
                                                <IconSend size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Stack>
                                </Tabs.Panel>

                                <Tabs.Panel value="participants" p="md">
                                    <Stack>
                                        {sessionDetails.participants.map((participant) => (
                                            <ParticipantCard
                                                key={participant.id}
                                                participant={participant}
                                            />
                                        ))}
                                    </Stack>
                                </Tabs.Panel>
                            </Tabs>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card shadow="sm" radius="md" withBorder>
                            <Card.Section p="md" bg="blue.0">
                                <Group>
                                    <Avatar src={partyDetails.host.avatar} size="lg" radius="md" />
                                    <div>
                                        <Badge
                                            leftSection={<IconCrown size={12} />}
                                            color="blue"
                                            mb="xs"
                                        >
                                            Host
                                        </Badge>
                                        <Text fw={500}>{partyDetails.host.name}</Text>
                                        <Text size="sm" c="dimmed">
                                            {partyDetails.host.hostedParties} parties hosted
                                        </Text>
                                    </div>
                                </Group>
                            </Card.Section>

                            <Stack p="md">
                                <ParticipantsProgress
                                    current={partyDetails.participants.current}
                                    max={partyDetails.participants.max}
                                />

                                <Grid>
                                    <Grid.Col span={6}>
                                        <Paper p="md" radius="md" ta="center" withBorder>
                                            <Text fw={700} size="xl" style={{
                                                background: 'linear-gradient(45deg, var(--mantine-color-blue-6), var(--mantine-color-indigo-6))',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}>
                                                {partyDetails.views}
                                            </Text>
                                            <Text size="sm" c="dimmed">Views</Text>
                                        </Paper>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Paper p="md" radius="md" ta="center" withBorder>
                                            <Text fw={700} size="xl" style={{
                                                background: 'linear-gradient(45deg, var(--mantine-color-pink-6), var(--mantine-color-red-6))',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}>
                                                {partyDetails.likes}
                                            </Text>
                                            <Text size="sm" c="dimmed">Likes</Text>
                                        </Paper>
                                    </Grid.Col>
                                </Grid>

                                <Paper p="md" radius="md" withBorder bg="green.0">
                                    <Group justify="space-between" mb="xs">
                                        <Text>Fee</Text>
                                        <Text fw={500} c="green.7">{partyDetails.price}</Text>
                                    </Group>
                                    <Text size="sm" c="dimmed">Pay at the venue</Text>
                                </Paper>

                                <Button
                                    size="lg"
                                    color={sessionDetails.status === 'cancelled' ? 'gray' : partyDetails.isJoined ? 'gray' : 'blue'}
                                    variant={partyDetails.isJoined ? 'light' : 'filled'}
                                    disabled={sessionDetails.status === 'cancelled'}
                                    style={{
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    {sessionDetails.status === 'cancelled' ? 'Session Cancelled' :
                                        partyDetails.isJoined ? 'Leave Party' : 'Join Party'}
                                </Button>

                                <Button
                                    variant="light"
                                    size="lg"
                                    leftSection={<IconMessageCircle size={16} />}
                                    style={{
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    Chat with Host
                                </Button>

                                <SafetyGuidelines />

                                <Paper p="md" radius="md" withBorder>
                                    <Stack>
                                        <Text fw={500}>Additional Information</Text>
                                        <Group>
                                            <ThemeIcon color="blue" variant="light" size="sm">
                                                <IconUsers size={12} />
                                            </ThemeIcon>
                                            <Text size="sm">Mixed skill levels welcome</Text>
                                        </Group>
                                        <Group>
                                            <ThemeIcon color="blue" variant="light" size="sm">
                                                <IconCalendar size={12} />
                                            </ThemeIcon>
                                            <Text size="sm">Regular weekly session</Text>
                                        </Group>
                                    </Stack>
                                </Paper>

                                <Paper p="md" radius="md" withBorder>
                                    <Text fw={500} mb="md">Share This Party</Text>
                                    <Group grow>
                                        <ActionIcon
                                            variant="light"
                                            color="blue"
                                            size="lg"
                                            onClick={() => {
                                                // Share functionality
                                            }}
                                            style={{
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    backgroundColor: 'var(--mantine-color-blue-1)',
                                                },
                                            }}
                                        >
                                            <IconShare size={20} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="light"
                                            color={isLiked ? 'red' : 'gray'}
                                            size="lg"
                                            onClick={() => setIsLiked(!isLiked)}
                                            style={{
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    backgroundColor: isLiked ?
                                                        'var(--mantine-color-red-1)' :
                                                        'var(--mantine-color-gray-1)',
                                                },
                                            }}
                                        >
                                            <IconHeart
                                                size={20}
                                                style={{
                                                    fill: isLiked ? 'var(--mantine-color-red-6)' : 'none',
                                                    transition: 'fill 0.2s ease',
                                                }}
                                            />
                                        </ActionIcon>
                                    </Group>
                                </Paper>
                            </Stack>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    );
};

export default PartyView;