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
    ScrollArea
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
    IconCheck,
    IconX,
    IconMessageCircle,
    IconEye,
    IconHeart,
    IconUsers,
    IconCreditCard
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';

import { sessionService } from '@/services';
import ParticipantCard from './components/ParticipantCard';
import SafetyGuidelines from './components/SafetyGuidelines';
import MessageCard from './components/MessageCard';
import PartyHeader from './components/PartyHeader';
import StatsGrid from './components/StatsGrid';
import FeeCard from './components/FeeCard';
import ParticipantsProgress from './components/ParticipantsProgress';
import { SessionData } from '@/services/types/session';
import SessionChat from './components/SessionChat';

type JoinStatus = 'host' | 'confirmed' | 'pending' | 'cancelled' | 'not_joined';

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
    join_status: "not_joined"
};

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
            const response = await sessionService.getById(sessionId);
            setSessionDetails(response?.data || DEFAULT_PARTY_DATA);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSessionData();
    }, []);
    const getJoinButtonConfig = (status: string, joinStatus: JoinStatus) => {
        // If session is cancelled
        if (status === 'cancelled') {
            return {
                text: 'Session Cancelled',
                color: 'gray' as const,
                disabled: true,
                variant: 'filled' as const
            };
        }

        // Session is full
        if (sessionDetails.participants.length >= sessionDetails.max_participants
            && joinStatus === 'not_joined') {
            return {
                text: 'Session Full',
                color: 'gray' as const,
                disabled: true,
                variant: 'filled' as const
            };
        }

        // Different states based on join_status
        switch (joinStatus) {
            case 'host':
                return {
                    text: 'You are the Host',
                    color: 'blue' as const,
                    disabled: true,
                    variant: 'filled' as const
                };
            case 'confirmed':
                return {
                    text: 'Leave Session',
                    color: 'red' as const,
                    disabled: false,
                    variant: 'light' as const
                };
            case 'pending':
                return {
                    text: 'Pending Confirmation',
                    color: 'yellow' as const,
                    disabled: true,
                    variant: 'filled' as const
                };
            case 'cancelled':  // เพิ่มกรณี cancelled
                return {
                    text: 'Cancelled',
                    color: 'red' as const,
                    disabled: true,
                    variant: 'filled' as const
                };
            case 'not_joined':
                return {
                    text: 'Join Session',
                    color: 'blue' as const,
                    disabled: false,
                    variant: 'filled' as const
                };
            default:
                return {
                    text: 'Join Session',
                    color: 'blue' as const,
                    disabled: false,
                    variant: 'filled' as const
                };
        }
    };

    const handleActionClick = (sessionId: string, joinStatus: JoinStatus) => {
        switch (joinStatus) {
            case 'confirmed':
                openLeaveConfirmModal(sessionId);
                break;
            case 'not_joined':
                openJoinConfirmModal(sessionId);
                break;
        }
    };

    const openJoinConfirmModal = (sessionId: string) => {
        modals.openConfirmModal({
            title: 'Join Session',
            centered: true,
            children: (
                <Text size="sm" mb="lg">
                    Are you sure you want to join this session? You will be notified when the host confirms your participation.
                </Text>
            ),
            labels: { confirm: 'Join Session', cancel: 'Cancel' },
            confirmProps: { color: 'blue' },
            onConfirm: () => handleJoin(sessionId),
        });
    };

    const openLeaveConfirmModal = (sessionId: string) => {
        modals.openConfirmModal({
            title: 'Leave Session',
            centered: true,
            children: (
                <>
                    <Text size="sm" mb="xs" fw={500} c="red">
                        Are you sure you want to leave this session?
                    </Text>
                    {sessionDetails.allow_cancellation ? (
                        <Text size="sm" c="dimmed">
                            You can cancel up to {sessionDetails.cancellation_deadline_hours} hours before the session starts.
                        </Text>
                    ) : (
                        <Text size="sm" c="red">
                            Note: This session does not allow cancellation after joining.
                        </Text>
                    )}
                </>
            ),
            labels: { confirm: 'Leave Session', cancel: 'Stay' },
            confirmProps: { color: 'red' },
            cancelProps: { color: 'blue' },
            onConfirm: () => handleLeave(sessionId),
        });
    };

    const handleLeave = async (sessionId: string) => {
        try {
            notifications.show({
                id: 'leave-loading',
                title: 'Leaving session...',
                message: 'Please wait while we process your request',
                loading: true,
                withCloseButton: false,
                autoClose: false,
            });

            await sessionService.leave(sessionId);

            notifications.hide('leave-loading');
            notifications.show({
                title: 'Session Left',
                message: 'You have successfully left the session',
                color: 'green',
                icon: <IconCheck size={16} />,
                autoClose: 3000,
            });

            await fetchSessionData();
        } catch (error: any) {
            notifications.hide('leave-loading');
            notifications.show({
                title: 'Failed to Leave',
                message: error?.data?.description || 'Something went wrong. Please try again.',
                color: 'red',
                icon: <IconX size={16} />,
                autoClose: 4000,
            });
        }
    };

    const handleJoin = async (sessionId: string) => {
        try {
            notifications.show({
                id: 'join-loading',
                title: 'Joining session...',
                message: 'Please wait while we process your request',
                loading: true,
                withCloseButton: false,
                autoClose: false,
            });

            await sessionService.join(sessionId);
            notifications.hide('join-loading');
            notifications.show({
                title: 'Success',
                message: 'Successfully joined the session',
                color: 'green',
                icon: <IconCheck size={16} />,
                autoClose: 2000,
            });

            await fetchSessionData();
        } catch (error: any) {
            notifications.hide('join-loading');
            notifications.show({
                title: 'Error',
                message: error?.data?.description || error?.message || 'Failed to join session',
                color: 'red',
                icon: <IconX size={16} />,
                autoClose: 3000,
            });
        }
    };

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
                        {/* Main Content Card */}
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

                            {/* Content Sections */}
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
                        <Card shadow="sm" radius="md" withBorder mt="md">
                            <Tabs defaultValue="chat">
                                <Tabs.List>
                                    <Tabs.Tab
                                        value="chat"
                                        leftSection={<IconMessageCircle size={16} />}
                                    >
                                        Chat
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        value="participants"
                                        leftSection={<IconUsers size={16} />}
                                    >
                                        Participants
                                    </Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="chat" >
                                    <SessionChat sessionId={sessionId} />

                                </Tabs.Panel>

                                <Tabs.Panel value="participants" >
                                    <ScrollArea h={400} offsetScrollbars>
                                        <Stack gap="xs" p="md">
                                            {sessionDetails.participants.map((participant) => (
                                                <ParticipantCard participant={participant} />
                                            ))}
                                        </Stack>
                                    </ScrollArea>
                                </Tabs.Panel>
                            </Tabs>
                        </Card>

                    </Grid.Col>

                    {/* Sidebar */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card shadow="sm" radius="md" withBorder>
                            <Card.Section p="md" bg="blue.0">
                                <Group>
                                    <Avatar src="/api/placeholder/32/32" size="lg" radius="md" />
                                    <div>
                                        <Badge
                                            leftSection={<IconCrown size={12} />}
                                            color="blue"
                                            mb="xs"
                                        >
                                            Host
                                        </Badge>
                                        <Text fw={500}>{sessionDetails.host_name}</Text>
                                        <Text size="sm" c="dimmed">
                                            {sessionDetails.host_level} Level
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
                                    views={0}
                                    likes={0}
                                />

                                <FeeCard price={`฿${sessionDetails.cost_per_person}/person`} />

                                {/* Join/Leave Button */}
                                <Button
                                    size="lg"
                                    {...getJoinButtonConfig(sessionDetails.status, sessionDetails.join_status)}
                                    radius="md"
                                    onClick={() => handleActionClick(sessionDetails.id, sessionDetails.join_status)}
                                    className="transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0 disabled:hover:transform-none"
                                >
                                    <Group gap="xs">
                                        <IconUsers size={18} />
                                        {getJoinButtonConfig(sessionDetails.status, sessionDetails.join_status).text}
                                    </Group>
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

                                {/* Share Section */}
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