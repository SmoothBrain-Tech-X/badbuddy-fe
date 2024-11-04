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
    IconArrowLeft,
    IconSend,
    IconCrown,
    IconShare,
    IconThumbUp,
    IconCalendar,
    IconAlertCircle,
    IconChevronRight,
    IconProps,
    IconMoneybag,
    IconBarbell,
    IconMessageCircle, IconEye, IconHeart, IconUsers, IconCreditCard
} from '@tabler/icons-react';
import { useParams } from 'next/navigation';

import { SessionData, Participant, sessionService } from '@/services';
import ParticipantCard from './components/ParticipantCard';
import SafetyGuidelines from './components/SafetyGuidelines';
import MessageCard from './components/MessageCard';
import PartyHeader from './components/PartyHeader';
import StatsGrid from './components/StatsGrid';
import FeeCard from './components/FeeCard';
import ParticipantsProgress from './components/ParticipantsProgress';

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
    const params = useParams();
    const sessionId = params.id as string;
    const [message, setMessage] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('chat');
    const [sessionDetails, setSessionDetails] = useState<SessionData>(DEFAULT_PARTY_DATA);


    const fetchSessionData = async () => {
        try {
            const response = await sessionService.getById(sessionId)
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
    const formatDateTime = (date: string | Date, start: string, end: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        const formattedDate = new Date(date).toLocaleDateString('th-TH', options);
        return `${formattedDate}\n${start} - ${end} น.`;
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

                        <Card shadow="sm" radius="lg" p={0} withBorder className="overflow-hidden">
                            <PartyHeader
                                party={sessionDetails}
                                isLiked={isLiked}
                                onLikeToggle={() => setIsLiked(!isLiked)}
                            />

                            {/* Status and Level Tags */}
                            <Box p="md" className="flex gap-2">
                                <Badge
                                    color={getStatusColor(sessionDetails.status)}
                                    size="lg"
                                    variant="filled"
                                    radius="md"
                                >
                                    {sessionDetails.status.toUpperCase()}
                                </Badge>
                                <Badge
                                    color="blue"
                                    size="lg"
                                    variant="light"
                                    radius="md"
                                >
                                    {sessionDetails.player_level.toUpperCase()} LEVEL
                                </Badge>
                            </Box>

                            <Stack p="xl" gap="xl">
                                {/* Info Grid */}
                                <Grid gutter="lg">
                                    {[
                                        {
                                            icon: IconMapPin,
                                            label: 'Venue',
                                            value: `${sessionDetails.venue_name}\n${sessionDetails.venue_location}`,
                                            color: 'emerald'
                                        },
                                        {
                                            icon: IconCalendar,
                                            label: 'Date & Time',
                                            value: formatDateTime(sessionDetails.session_date, sessionDetails.start_time, sessionDetails.end_time),
                                            color: 'blue'
                                        },

                                    ].map((item, index) => (
                                        <Grid.Col span={{ base: 12, sm: 6, md: 6 }} key={index}>
                                            <Paper
                                                shadow="sm"
                                                p="lg"
                                                className={`h-32 flex flex-col items-center justify-center text-center rounded-xl bg-gradient-to-br from-${item.color}-50 to-white hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}
                                            >
                                                <item.icon
                                                    className={`w-8 h-8 mb-3 text-${item.color}-500`}
                                                    strokeWidth={1.5}
                                                />
                                                <div className="text-sm font-medium text-gray-500 mb-1.5">{item.label}</div>
                                                <div className="text-lg font-bold text-gray-800 whitespace-pre-line">{item.value}</div>
                                            </Paper>
                                        </Grid.Col>
                                    ))}
                                </Grid>

                                {/* Description */}
                                <Box>
                                    <Text fw={600} mb="xs" size="lg" className="text-gray-800">Description</Text>
                                    <Paper p="md" radius="md" className="bg-blue-50 border border-blue-100">
                                        <Text className="text-gray-700">{sessionDetails.description}</Text>
                                    </Paper>
                                </Box>

                                {/* What to Bring */}
                                <Box>
                                    <Text fw={600} mb="xs" size="lg" className="text-gray-800">What to Bring</Text>
                                    <Grid>
                                        {['Badminton Racket', 'Sports Attire & Shoes'].map((item, index) => (
                                            <Grid.Col span={{ base: 12, sm: 6 }} key={index}>
                                                <Paper p="md" radius="md" className="bg-green-50 border border-green-100">
                                                    <Group>
                                                        <ThemeIcon color="green" variant="light" size="lg" radius="xl">
                                                            <IconThumbUp size={18} />
                                                        </ThemeIcon>
                                                        <Text className="text-gray-700">{item}</Text>
                                                    </Group>
                                                </Paper>
                                            </Grid.Col>
                                        ))}
                                    </Grid>
                                </Box>

                                {/* Important Notes */}
                                <Box>
                                    <Text fw={600} mb="xs" size="lg" className="text-gray-800">Important Notes</Text>
                                    <Paper p="md" radius="md" className="bg-orange-50 border border-orange-100">
                                        <Group align="flex-start">
                                            <ThemeIcon color="orange" variant="light" size="lg" radius="xl">
                                                <IconAlertCircle size={18} />
                                            </ThemeIcon>
                                            <div className="space-y-2">
                                                <Text className="text-gray-700">Please arrive 15 minutes early for warm-up</Text>
                                                {sessionDetails.allow_cancellation && (
                                                    <Text size="sm" className="text-gray-600">
                                                        Cancellation allowed up to {sessionDetails.cancellation_deadline_hours} hours before the session
                                                    </Text>
                                                )}
                                            </div>
                                        </Group>
                                    </Paper>
                                </Box>
                            </Stack>
                        </Card>
                        <Card shadow="sm" radius="lg" withBorder className="overflow-hidden">
                            <Tabs
                                value={activeTab}
                                onChange={(value) => setActiveTab(value || 'chat')}
                                classNames={{
                                    list: 'bg-gray-50 px-4 pt-2',
                                    tab: 'font-medium transition-colors data-[active]:bg-white data-[active]:border-b-2 data-[active]:border-blue-500'
                                }}
                            >
                                <Tabs.List>
                                    <Tabs.Tab
                                        value="chat"
                                        leftSection={<IconMessageCircle size={18} />}
                                        className="px-4 py-2"
                                    >
                                        Chat
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        value="participants"
                                        leftSection={<IconUsers size={18} />}
                                        className="px-4 py-2"
                                    >
                                        Participants ({sessionDetails.participants.length})
                                    </Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="chat" p="md">
                                    <Stack gap="lg">
                                        {messages.map((msg) => (
                                            <MessageCard key={msg.id} message={msg} />
                                        ))}
                                        <Group className="sticky bottom-0 bg-white pt-3">
                                            <TextInput
                                                placeholder="Type a message..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="flex-1"
                                                size="md"
                                                radius="xl"
                                                rightSection={
                                                    <ActionIcon
                                                        variant="filled"
                                                        color="blue"
                                                        size={32}
                                                        radius="xl"
                                                        className="hover:scale-105 transition-transform"
                                                    >
                                                        <IconSend size={18} />
                                                    </ActionIcon>
                                                }
                                            />
                                        </Group>
                                    </Stack>
                                </Tabs.Panel>

                                <Tabs.Panel value="participants" p="md">
                                    <Stack gap="xs">
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

                            <Stack p="md" gap="md">
                                <ParticipantsProgress
                                    current={sessionDetails.participants.length}
                                    max={sessionDetails.max_participants}
                                />

                                <StatsGrid
                                    views={partyDetails.views}
                                    likes={partyDetails.likes}
                                />

                                <FeeCard price={partyDetails.price} />

                                <Button
                                    size="lg"
                                    color={sessionDetails.status === 'cancelled' ? 'gray' : partyDetails.isJoined ? 'red' : 'blue'}
                                    variant={partyDetails.isJoined ? 'light' : 'filled'}
                                    disabled={sessionDetails.status === 'cancelled'}
                                    radius="md"
                                    className="transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0 disabled:hover:transform-none"
                                >
                                    {sessionDetails.status === 'cancelled' ? (
                                        <Group gap="xs"><IconUsers size={18} />Session Cancelled</Group>
                                    ) : partyDetails.isJoined ? (
                                        <Group gap="xs"><IconUsers size={18} />Leave Party</Group>
                                    ) : (
                                        <Group gap="xs"><IconUsers size={18} />Join Party</Group>
                                    )}
                                </Button>

                                <Button
                                    variant="light"
                                    size="lg"
                                    radius="md"
                                    leftSection={<IconMessageCircle size={18} />}
                                    className="transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
                                >
                                    Chat with Host
                                </Button>

                                <SafetyGuidelines />



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