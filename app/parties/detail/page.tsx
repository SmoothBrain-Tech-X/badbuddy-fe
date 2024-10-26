'use client';

import { useState } from 'react';
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

// Types
interface Host {
    name: string;
    avatar: string;
    hostedParties: number;
}

interface Participant {
    id: string;
    name: string;
    avatar: string;
    isHost: boolean;
    level: string;
    joinedParties: number;
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
}

// Subcomponents
const PartyHeader: React.FC<{
    party: PartyDetails;
    isLiked: boolean;
    onLikeToggle: () => void;
}> = ({ party, isLiked, onLikeToggle }) => (
    <Box bg="blue.6" p="xl" color="white">
        <Group justify="space-between" align="flex-start">
            <div>
                <Title order={2} mb="xs" c="white">{party.title}</Title>
                <Group gap="xs">
                    <Badge color="blue.1" c="white">{party.level}</Badge>
                    <Badge color="blue.1" c="white">{party.price}</Badge>
                </Group>
            </div>
            <Group gap="xs">
                <ActionIcon
                    variant="subtle"
                    color="white"
                    onClick={onLikeToggle}
                >
                    <IconHeart
                        style={{ fill: isLiked ? 'white' : 'none' }}
                        stroke={1.5}
                    />
                </ActionIcon>
                <ActionIcon variant="subtle" color="white">
                    <IconShare stroke={1.5} />
                </ActionIcon>
            </Group>
        </Group>
    </Box>
);

const InfoItem: React.FC<{
    icon: React.ComponentType<IconProps>;
    label: string;
    value: string;
}> = ({ icon: Icon, label, value }) => (
    <Paper p="md" radius="md" withBorder>
        <Group>
            <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                <Icon size={rem(20)} />
            </ThemeIcon>
            <div>
                <Text size="sm" c="dimmed">{label}</Text>
                <Text fw={500}>{value}</Text>
            </div>
        </Group>
    </Paper>
);

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

const ParticipantCard: React.FC<{ participant: Participant }> = ({ participant }) => (
    <Paper p="md" radius="md" withBorder>
        <Group justify="space-between">
            <Group>
                <Avatar src={participant.avatar} size="lg" radius="md" />
                <div>
                    <Group gap="xs">
                        <Text fw={500}>{participant.name}</Text>
                        {participant.isHost && (
                            <Badge
                                leftSection={<IconCrown size={12} />}
                                color="blue"
                            >
                                Host
                            </Badge>
                        )}
                    </Group>
                    <Text size="sm" c="dimmed">
                        {participant.level} • {participant.joinedParties} parties joined
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

const ParticipantsProgress: React.FC<{
    current: number;
    max: number;
}> = ({ current, max }) => (
    <Paper p="md" radius="md" withBorder>
        <Text fw={500} mb="xs">Participants Status</Text>
        <Progress
            value={(current / max) * 100}
            mb="xs"
            size="md"
            radius="xl"
            color={current / max >= 0.8 ? 'orange' : 'blue'}
        />
        <Group justify="space-between" mb="xs">
            <Text size="sm">
                {max - current} spots left
            </Text>
            <Text size="sm" fw={500}>
                {current}/{max}
            </Text>
        </Group>
    </Paper>
);

const SafetyGuidelines: React.FC = () => (
    <Paper p="md" radius="md" bg="orange.0" withBorder>
        <Group align="flex-start">
            <ThemeIcon color="orange" variant="light" size="lg">
                <IconAlertCircle size={20} />
            </ThemeIcon>
            <div>
                <Text fw={500} c="orange.8" mb="xs">Safety Guidelines</Text>
                <List spacing="xs" size="sm" c="dimmed" withPadding>
                    <List.Item>Chat with the host before joining</List.Item>
                    <List.Item>Pay only at the venue</List.Item>
                    <List.Item>Follow venue rules and guidelines</List.Item>
                    <List.Item>Report any suspicious activity</List.Item>
                </List>
            </div>
        </Group>
    </Paper>
);

// Main Component
const PartyView: React.FC = () => {
    const [message, setMessage] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('chat');

    // Mock data
    const partyDetails: PartyDetails = {
        id: '1',
        title: 'Casual Badminton Session',
        location: 'Sports Complex - Court A',
        time: 'Sep 18, 2024 16:00 - 18:00',
        description: 'Join us for a fun badminton session! Suitable for intermediate players. All are welcome. Please bring your own racket.',
        price: '$5/person',
        participants: { current: 8, max: 10 },
        court: '1',
        level: 'Intermediate',
        isJoined: false,
        host: {
            name: 'John Doe',
            avatar: '/api/placeholder/32/32',
            hostedParties: 15,
        },
        likes: 24,
        views: 89,
    };

    const participants: Participant[] = [
        {
            id: '1',
            name: 'John Doe',
            avatar: '/api/placeholder/32/32',
            isHost: true,
            level: 'Beginner',
            joinedParties: 12,
        },
        {
            id: '2',
            name: 'Jane Smith',
            avatar: '/api/placeholder/32/32',
            isHost: false,
            level: 'Intermediate',
            joinedParties: 8,
        },
    ];

    const messages: Message[] = [
        {
            id: '1',
            user: { name: 'John Doe', avatar: '/api/placeholder/32/32' },
            content: 'Hello everyone! Looking forward to playing with you all.',
            timestamp: '14:30',
            likes: 2,
        },
        {
            id: '2',
            user: { name: 'Jane Smith', avatar: '/api/placeholder/32/32' },
            content: 'Thanks! See you all at the court.',
            timestamp: '14:35',
            likes: 1,
        },
    ];

    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="xl" py="xl">
                {/* Breadcrumbs */}
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
                    {/* Main Content */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        {/* Party Card */}
                        <Card shadow="sm" radius="md" mb="lg" p={0} withBorder>
                            <PartyHeader
                                party={partyDetails}
                                isLiked={isLiked}
                                onLikeToggle={() => setIsLiked(!isLiked)}
                            />

                            <Stack p="xl">
                                {/* Info Grid */}
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

                                {/* Description */}
                                <div>
                                    <Text fw={500} mb="xs" size="lg">Description</Text>
                                    <Paper p="md" radius="md" bg="blue.0">
                                        <Text>{partyDetails.description}</Text>
                                    </Paper>
                                </div>

                                {/* Required Items */}
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

                                {/* Important Notes */}
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

                        {/* Chat and Participants Tabs */}
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
                                        {participants.map((participant) => (
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

                    {/* Sidebar */}
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

                                {/* Stats */}
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

                                {/* Price */}
                                <Paper p="md" radius="md" withBorder bg="green.0">
                                    <Group justify="space-between" mb="xs">
                                        <Text>Fee</Text>
                                        <Text fw={500} c="green.7">{partyDetails.price}</Text>
                                    </Group>
                                    <Text size="sm" c="dimmed">Pay at the venue</Text>
                                </Paper>

                                {/* Action Buttons */}
                                <Button
                                    size="lg"
                                    color={partyDetails.isJoined ? 'gray' : 'blue'}
                                    variant={partyDetails.isJoined ? 'light' : 'filled'}
                                    style={{
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    {partyDetails.isJoined ? 'Leave Party' : 'Join Party'}
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

                                {/* Safety Notice */}
                                <SafetyGuidelines />

                                {/* Additional Information */}
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
