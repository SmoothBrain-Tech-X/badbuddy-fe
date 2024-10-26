'use client';

import { useState } from 'react';
import {
    TextInput,
    Select,
    Button,
    Card,
    Badge,
    Progress,
    Group,
    Text,
    Avatar,
    Container,
    Grid,
    ActionIcon,
    Box,
    Paper,
    Stack,
    Transition,
    rem,
} from '@mantine/core';
import {
    IconSearch,
    IconPlus,
    IconMapPin,
    IconClock,
    IconCrown,
    IconTrophy,
    IconFlame,
    IconFilter,
    IconArrowsUpDown,
    IconUsers,
    IconTarget,
    IconChevronDown,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

// Types
interface Host {
    name: string;
    avatar: string;
}

interface Participants {
    current: number;
    max: number;
}

interface PartyCardProps {
    id: string;
    title: string;
    location: string;
    time: string;
    participants: Participants;
    court: string;
    isFull: boolean;
    isJoined: boolean;
    host: Host;
    level?: string;
}

interface FilterOption {
    label: string;
    value: string;
    icon?: React.ReactNode;
}

// Constants
const SORT_OPTIONS: FilterOption[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'mostParticipants', label: 'Most Participants' },
];

const QUICK_FILTERS: FilterOption[] = [
    { label: 'Near Me', value: 'near', icon: <IconTarget size={16} /> },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
];

// Components
const HostAvatar: React.FC<{ host: Host }> = ({ host }) => (
    <Box pos="relative">
        <Avatar
            src={host.avatar}
            size="lg"
            radius="md"
            styles={{
                root: {
                    border: '3px solid var(--mantine-color-blue-1)',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                },
            }}
        />
        <ActionIcon
            variant="filled"
            color="yellow"
            size="xs"
            pos="absolute"
            bottom={-4}
            right={-4}
            radius="md"
            styles={{
                root: {
                    boxShadow: 'var(--mantine-shadow-sm)',
                },
            }}
        >
            <IconCrown size={12} />
        </ActionIcon>
    </Box>
);

const ParticipantsProgress: React.FC<{
    participants: Participants;
    isFull: boolean;
}> = ({ participants, isFull }) => {
    const progress = (participants.current / participants.max) * 100;
    const spotsLeft = participants.max - participants.current;
    const isAlmostFull = progress >= 80;

    return (
        <Stack gap="xs">
            <Group justify="space-between">
                <Text size="sm" c="dimmed">Participants</Text>
                <Text fw={500}>{participants.current}/{participants.max}</Text>
            </Group>
            <Box pos="relative">
                <Progress
                    value={progress}
                    size="md"
                    radius="xl"
                    color={isAlmostFull ? 'orange' : 'blue'}
                    animated
                />
                <Transition mounted={isAlmostFull && !isFull} transition="fade">
                    {(styles) => (
                        <Text size="xs" c="orange" ta="right" mt={4} style={styles}>
                            {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
                        </Text>
                    )}
                </Transition>
            </Box>
        </Stack>
    );
};
const PartyCard: React.FC<PartyCardProps> = ({
    title,
    location,
    time,
    participants,
    court,
    isFull,
    isJoined,
    host,
    level,
}) => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            h="100%"
            className="flex flex-col justify-between transition-transform transition-shadow cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div>
                <Group justify="space-between" mb="md">
                    <Group>
                        <HostAvatar host={host} />
                        <div>
                            <Text fw={700} size="lg" lineClamp={1}>{title}</Text>
                            <Group gap="xs">
                                <Text size="sm" c="dimmed">{host.name}</Text>
                                <Text size="sm" c="dimmed">•</Text>
                                <Text size="sm" c="blue" fw={500}>Court {court}</Text>
                            </Group>
                        </div>
                    </Group>

                </Group>
                <Group gap="xs" align="flex-end" py="sm">
                    {level && (
                        <Badge color="blue" variant="light" size="md">
                            {level}
                        </Badge>
                    )}
                    {isFull && (
                        <Badge color="red" variant="light" size="md">
                            Full
                        </Badge>
                    )}
                    {isJoined && (
                        <Badge
                            color="green"
                            variant="light"
                            size="md"
                            leftSection={
                                <IconUsers size={12} style={{ marginRight: rem(4) }} />
                            }
                        >
                            Joined
                        </Badge>
                    )}
                </Group>
                <Grid mb="md">
                    <Grid.Col span={6}>
                        <Paper
                            p="sm"
                            radius="md"
                            bg="gray.0"
                            style={{
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'var(--mantine-color-blue-0)',
                                },
                            }}
                        >
                            <Group>
                                <IconMapPin size={18} color="var(--mantine-color-blue-6)" />
                                <Text size="sm" lineClamp={1}>{location}</Text>
                            </Group>
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Paper
                            p="sm"
                            radius="md"
                            bg="gray.0"
                            style={{
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'var(--mantine-color-blue-0)',
                                },
                            }}
                        >
                            <Group>
                                <IconClock size={18} color="var(--mantine-color-blue-6)" />
                                <Text size="sm" lineClamp={1}>{time.split('(')[0]}</Text>
                            </Group>
                        </Paper>
                    </Grid.Col>
                </Grid>

                <ParticipantsProgress participants={participants} isFull={isFull} />
            </div>
            <div style={{
                marginTop: '16px',
            }}>
                <Button
                    fullWidth
                    variant="light"
                    color="blue"
                    styles={{
                        root: {
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: 'var(--mantine-shadow-sm)',
                            },
                        },
                    }}
                    onClick={() => router.push('/parties/detail')}
                >
                    View Details
                </Button>

                <Button
                    fullWidth
                    mt="md"
                    variant={isJoined ? 'light' : 'filled'}
                    color={isJoined ? 'gray' : 'blue'}
                    styles={{
                        root: {
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: 'var(--mantine-shadow-sm)',
                            },
                        },
                    }}
                >
                    {isJoined ? 'Leave Party' : 'Join Party'}
                </Button>
            </div>
        </Card>
    );
};

const SearchBar: React.FC<{
    searchTerm: string;
    onSearchChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: string | null) => void;
}> = ({ searchTerm, onSearchChange, sortBy, onSortChange }) => (
    <Paper
        shadow="sm"
        p="md"
        radius="lg"
        mb="xl"
        style={{
            transition: 'transform 0.2s ease',
            '&:focuswithin': {
                transform: 'translateY(-1px)',
            },
        }}
    >
        <Group>
            <TextInput
                placeholder="Search by name or location"
                leftSection={<IconSearch size={16} />}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ flex: 1 }}
            />
            <Group>
                <Select
                    value={sortBy}
                    onChange={onSortChange}
                    data={SORT_OPTIONS}
                    leftSection={<IconArrowsUpDown size={16} />}
                    rightSection={<IconChevronDown size={16} />}
                />
                <ActionIcon
                    variant="light"
                    size="lg"
                    style={{
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                            transform: 'rotate(15deg)',
                        },
                    }}
                >
                    <IconFilter size={16} />
                </ActionIcon>
            </Group>
        </Group>
    </Paper>
);

const QuickFilters: React.FC = () => (
    <Group gap="xs" mb="xl" wrap="nowrap">
        {QUICK_FILTERS.map(({ label, value, icon }) => (
            <Button
                key={value}
                variant="light"
                leftSection={icon}
                styles={{
                    root: {
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: 'var(--mantine-shadow-sm)',
                        },
                    },
                }}
            >
                {label}
            </Button>
        ))}
    </Group>
);

const HeaderSection: React.FC = () => (
    <Stack gap={0} mb="xl">
        <Text
            size="xl"
            fw={700}
            style={{
                fontSize: rem(32),
                letterSpacing: '-0.5px',
                background: 'linear-gradient(45deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-indigo-5) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                marginBottom: rem(8),
            }}
        >
            Badbuddy Parties
        </Text>
        <Group justify="center" mt={4} mb="lg">
            <Badge
                variant="dot"
                color="orange"
                size="lg"
            >
                {`${12} Active Parties`}
            </Badge>
            <Badge
                variant="dot"
                color="green"
                size="lg"
            >
                {`${48} Players `}
            </Badge>
        </Group>
        <Text
            size="sm"
            c="dimmed"
            maw={500}
            mx="auto"
            px="md"
            style={{
                lineHeight: 1.6,
                fontWeight: 400,
                textAlign: 'center',
            }}
        >
            Discover and join exciting badminton parties near you.
            Connect with players, improve your skills, and enjoy the game together.
        </Text>
    </Stack>
);

// Main Component
const Dashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Mock data
    const parties: PartyCardProps[] = [
        {
            id: '1',
            title: 'Casual Badminton Session',
            location: 'Kasetsart University Courts',
            time: 'Sep 18, 2024 16:00 - 18:00 (2 hours)',
            participants: { current: 10, max: 10 },
            court: '1',
            isFull: true,
            isJoined: false,
            host: { name: 'John Doe', avatar: 'https://github.com/shadcn.png' },
            level: 'Intermediate',
        },
        {
            id: '2',
            title: 'Beginner Practice',
            location: 'Central Sports Complex',
            time: 'Sep 19, 2024 18:00 - 20:00 (2 hours)',
            participants: { current: 4, max: 10 },
            court: '2',
            isFull: false,
            isJoined: true,
            host: { name: 'Jane Smith', avatar: 'https://github.com/shadcn.png' },
            level: 'Beginner',
        },
    ];

    const filteredParties = parties.filter(party =>
        party.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        party.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="xl" py="xl">
                <HeaderSection />
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    sortBy={sortBy}
                    onSortChange={(value) => setSortBy(value || 'newest')}
                />

                <QuickFilters />

                <Grid align="stretch"> {/* เพิ่ม align="stretch" */}
                    {filteredParties.map(party => (
                        <Grid.Col key={party.id} span={{ base: 12, md: 6, lg: 4 }}>
                            <PartyCard {...party} />
                        </Grid.Col>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;
