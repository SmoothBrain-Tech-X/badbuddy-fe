'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import {
    Container, Grid, Card, Group, Text, Badge,
    Button, TextInput, Stack, Box, ThemeIcon,
    Paper, Title, ActionIcon, Avatar, Select,
    RangeSlider, Checkbox, Collapse, rem,
} from '@mantine/core';
import {
    IconMapPin, IconSearch, IconAdjustments,
    IconUsers, IconClock, IconTrophy,
    IconTarget, IconChevronDown, IconChevronUp,
    IconFilter, IconCrown,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { sessionService, Session, User } from '@/services';

// Types

interface FilterOption {
    value: string;
    label: string;
}

// Constants
const LEVELS: FilterOption[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
];

const TIME_FILTERS: FilterOption[] = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this_week', label: 'This Week' },
    { value: 'next_week', label: 'Next Week' },
];

// Components
const PartyCard: React.FC<{ party: Session; onJoinLeave: () => Promise<void> }> = ({
    party,
    onJoinLeave,
}) => {
    const router = useRouter();
    const isJoined = false; // This should be determined by checking current user's participation

    return (
        <Card shadow="sm" radius="md" withBorder className="h-full">
            <Stack>
                <Group justify="space-between">
                    <Group>
                        <Box pos="relative">
                            <Avatar
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww"
                                size="lg"
                                radius="md"
                            />
                            <ActionIcon
                                variant="filled"
                                color="yellow"
                                size="xs"
                                pos="absolute"
                                bottom={-4}
                                right={-4}
                                radius="md"
                            >
                                <IconCrown size={12} />
                            </ActionIcon>
                        </Box>
                        <div>
                            <Text fw={700} size="lg" lineClamp={1}>{party.title}</Text>
                            <Text size="sm" c="dimmed">{party.host_name}</Text>
                        </div>
                    </Group>
                </Group>

                <Group gap="xs">
                    <Badge color="blue" variant="light">
                        {party.player_level}
                    </Badge>
                    {party.status === 'full' && (
                        <Badge color="red" variant="light">
                            Full
                        </Badge>
                    )}
                </Group>

                <Grid>
                    <Grid.Col span={6}>
                        <Paper p="sm" radius="md" bg="gray.0">
                            <Group>
                                <IconMapPin size={16} className="text-blue-600" />
                                <Text size="sm" lineClamp={1}>{party.venue_location}</Text>
                            </Group>
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Paper p="sm" radius="md" bg="gray.0">
                            <Group>
                                <IconClock size={16} className="text-blue-600" />
                                <Text size="sm" lineClamp={1}>
                                    {new Date(party.start_time).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </Group>
                        </Paper>
                    </Grid.Col>
                </Grid>

                <Stack gap="xs">
                    <Text size="sm" fw={500} c="dimmed">Participants</Text>
                    <Group justify="space-between">
                        <Group gap="xs">
                            <ThemeIcon size="sm" variant="light">
                                <IconUsers size={14} />
                            </ThemeIcon>
                            <Text size="sm">
                                {`
                                    ${party.confirmed_players} Confirmed
                                    ${party.pending_players} Pending
                                `}
                            </Text>
                        </Group>
                        <Text fw={500} c="blue">
                            ฿{party.cost_per_person}/person
                        </Text>
                    </Group>
                    <Box>
                        <Button
                            fullWidth
                            variant="light"
                            onClick={() => router.push(`/parties/${party.id}`)}
                            mb="xs"
                        >
                            View Details
                        </Button>
                        <Button
                            fullWidth
                            variant={isJoined ? 'light' : 'filled'}
                            color={isJoined ? 'gray' : 'blue'}
                            onClick={onJoinLeave}
                            disabled={party.status === 'full' && !isJoined}
                        >
                            {isJoined ? 'Leave Party' : 'Join Party'}
                        </Button>
                    </Box>
                </Stack>
            </Stack>
        </Card>
    );
};

const FilterSection: React.FC<{
    visible: boolean;
    level: string | null;
    timeFilter: string | null;
    priceRange: [number, number];
    onLevelChange: (value: string | null) => void;
    onTimeFilterChange: (value: string | null) => void;
    onPriceRangeChange: (value: [number, number]) => void;
}> = ({
    visible,
    level,
    timeFilter,
    priceRange,
    onLevelChange,
    onTimeFilterChange,
    onPriceRangeChange,
}) => (
        <Collapse in={visible}>
            <Paper p="md" radius="md" bg="gray.0" mt="xs">
                <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Text fw={500} mb="xs">Level</Text>
                        <Select
                            placeholder="Select level"
                            data={LEVELS}
                            value={level}
                            onChange={onLevelChange}
                            clearable
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Text fw={500} mb="xs">When</Text>
                        <Select
                            placeholder="Select time"
                            data={TIME_FILTERS}
                            value={timeFilter}
                            onChange={onTimeFilterChange}
                            clearable
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Text fw={500} mb="xs">Price Range (per person)</Text>
                        <RangeSlider
                            min={0}
                            max={1000}
                            step={50}
                            value={priceRange}
                            onChange={onPriceRangeChange}
                            marks={[
                                { value: 0, label: '฿0' },
                                { value: 500, label: '฿500' },
                                { value: 1000, label: '฿1000' },
                            ]}
                        />
                    </Grid.Col>
                </Grid>
            </Paper>
        </Collapse>
    );

// Main Component
const PartyListPage: React.FC = () => {
    const router = useRouter();
    // State management (previous states remain the same)
    const [search, setSearch] = useState('');
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [level, setLevel] = useState<User['play_level'] | null>(null);
    const [timeFilter, setTimeFilter] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [parties, setParties] = useState<Session[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(9);
    const [total, setTotal] = useState(0);

    const fetchParties = useCallback(async () => {
        try {
            toast.loading('Loading parties...', { id: 'loading-parties' });
            const response = await sessionService.search({
                q: search,
                limit,
                offset: (page - 1) * limit,
                player_level: level || undefined,
                date: timeFilter || undefined,
            });

            if (response) {
                setParties(response.sessions);
                setTotal(response.total);
                toast.dismiss('loading-parties');
            }
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : 'Failed to load parties',
                { id: 'loading-parties' }
            );
        }
    }, [search, page, limit, level, timeFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchParties();
        }, 300);

        return () => {
            clearTimeout(timer);
            // Dismiss specific toast instead of all toasts
            toast.dismiss('loading-parties');
        };
    }, [search, level, timeFilter, priceRange, fetchParties]);

    // Fixed handleJoinLeave with proper toast handling
    const handleJoinLeave = async (partyId: string) => {
        try {
            toast.loading('Processing request...', { id: 'join-leave' });
            await fetchParties();
            toast.success('Successfully updated party status', { id: 'join-leave' });
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : 'Failed to update party status',
                { id: 'join-leave' }
            );
        }
    };

    const handleClearFilters = () => {
        setLevel(null);
        setTimeFilter(null);
        setPriceRange([0, 1000]);
        setSearch('');
        setPage(1);
        toast.success('Filters cleared', { duration: 2000 });
    };
    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="xl" py="xl">
                {/* Header */}
                <Stack mb="xl" align="center">
                    <Title
                        style={{
                            fontSize: rem(36),
                            background: 'linear-gradient(45deg, var(--mantine-color-blue-6), var(--mantine-color-indigo-5))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Badminton Parties
                    </Title>
                    <Text size="lg" c="dimmed" ta="center">
                        Find and join badminton sessions near you
                    </Text>
                </Stack>

                {/* Search and Filters */}
                <Paper shadow="sm" p="md" radius="md" mb="xl">
                    <Stack>
                        <Group>
                            <TextInput
                                placeholder="Search parties..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                leftSection={<IconSearch size={16} />}
                                style={{ flex: 1 }}
                            />
                            <Button
                                variant="light"
                                leftSection={<IconFilter size={16} />}
                                rightSection={
                                    filtersVisible ? (
                                        <IconChevronUp size={16} />
                                    ) : (
                                        <IconChevronDown size={16} />
                                    )
                                }
                                onClick={() => setFiltersVisible(!filtersVisible)}
                            >
                                Filters
                            </Button>
                        </Group>
                        <FilterSection
                            visible={filtersVisible}
                            level={level}
                            timeFilter={timeFilter}
                            priceRange={priceRange}
                            onLevelChange={(value) => setLevel(value as User['play_level'] | null)}
                            onTimeFilterChange={setTimeFilter}
                            onPriceRangeChange={setPriceRange}
                        />
                    </Stack>
                </Paper>

                {/* Active Filters */}
                {(level || timeFilter || search) && (
                    <Group mb="xl">
                        <Text size="sm" fw={500}>Active Filters:</Text>
                        {level && (
                            <Badge
                                variant="light"
                                rightSection={
                                    <ActionIcon
                                        variant="transparent"
                                        size="sm"
                                        onClick={() => setLevel(null)}
                                    >
                                        ×
                                    </ActionIcon>
                                }
                            >
                                {LEVELS.find(l => l.value === level)?.label}
                            </Badge>
                        )}
                        {timeFilter && (
                            <Badge
                                variant="light"
                                rightSection={
                                    <ActionIcon
                                        variant="transparent"
                                        size="sm"
                                        onClick={() => setTimeFilter(null)}
                                    >
                                        ×
                                    </ActionIcon>
                                }
                            >
                                {TIME_FILTERS.find(t => t.value === timeFilter)?.label}
                            </Badge>
                        )}
                        <Button variant="subtle" size="xs" onClick={handleClearFilters}>
                            Clear All
                        </Button>
                    </Group>
                )}

                {/* No Results */}
                {parties.length === 0 && (
                    <Paper p="xl" mt="md" radius="md" bg="gray.0">
                        <Stack align="center">
                            <Text size="lg" fw={500}>No parties found</Text>
                            <Text c="dimmed">Try adjusting your search or filters</Text>
                            <Button variant="light" onClick={handleClearFilters}>
                                Clear all filters
                            </Button>
                        </Stack>
                    </Paper>
                )}

                {/* Quick Stats */}
                {parties.length > 0 && (
                    <Group justify="center" mb="xl">
                        <Badge variant="dot" color="blue" size="lg">
                            {total} Total Parties
                        </Badge>
                        <Badge variant="dot" color="green" size="lg">
                            {parties.filter(p => p.status === 'open').length} Open Parties
                        </Badge>
                        <Badge variant="dot" color="yellow" size="lg">
                            {/* {parties.reduce((acc, p) => acc + p.current_participants, 0)} Active Players */}
                        </Badge>
                    </Group>
                )}

                {/* Parties Grid */}
                {parties.length > 0 && (
                    <>
                        <Grid>
                            {parties.map((party) => (
                                <Grid.Col key={party.id} span={{ base: 12, md: 6, lg: 4 }}>
                                    <PartyCard
                                        party={party}
                                        onJoinLeave={() => handleJoinLeave(party.id)}
                                    />
                                </Grid.Col>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        <Group justify="center" mt="xl">
                            <Button
                                variant="light"
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                Previous
                            </Button>
                            <Text>
                                Page {page} of {Math.ceil(total / limit)}
                            </Text>
                            <Button
                                variant="light"
                                disabled={page >= Math.ceil(total / limit)}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </Button>
                        </Group>

                        {/* Create Party Button */}
                        <Box
                            pos="fixed"
                            bottom={40}
                            right={40}
                            style={{ zIndex: 1000 }}
                        >
                            <Button
                                size="lg"
                                radius="xl"
                                leftSection={<IconTrophy size={20} />}
                                onClick={() => router.push('/parties/create')}
                                className="shadow-lg"
                            >
                                Create Party
                            </Button>
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default PartyListPage;
