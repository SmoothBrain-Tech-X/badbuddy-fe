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
    Stack,
    Box,
    Paper,
    Title,
    ActionIcon,
} from '@mantine/core';
import {
    IconMapPin,
    IconEdit,
    IconTrophy,
    IconCalendarEvent,
    IconStar,
    IconMessageCircle,
    IconShare,
    IconHeart,
    IconVenus,
    IconUserCircle,
    IconBlender,
    IconWand,
    IconMail,
    IconPhone,
} from '@tabler/icons-react';
import { authService, UserProfileDTO, Booking, bookingService } from '@/services';


interface Party {
    id: string;
    title: string;
    location: string;
    time: string;
    participants: {
        current: number;
        max: number;
    };
    status: 'upcoming' | 'completed' | 'cancelled';
}

// Helper Components
const StatCard = ({ label, value }: { label: string; value: string | number }) => (
    <Grid.Col span={6}>
        <Paper p="md" radius="md" ta="center" withBorder>
            <Text fw={700} size="xl">{value}</Text>
            <Text size="sm" c="dimmed">{label}</Text>
        </Paper>
    </Grid.Col>
);

const PartyCard = ({ party }: { party: Party }) => (
    <Paper key={party.id} p="md" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
            <div>
                <Text fw={500}>{party.title}</Text>
                <Group gap="xs">
                    <IconMapPin size={14} />
                    <Text size="sm" c="dimmed">{party.location}</Text>
                </Group>
            </div>
            <Badge color="blue">
                {party.participants.current}/{party.participants.max} joined
            </Badge>
        </Group>
        <Group mt="md" justify="space-between">
            <Text size="sm">{party.time}</Text>
            <Group>
                <ActionIcon variant="light" color="gray">
                    <IconHeart size={16} />
                </ActionIcon>
                <Button variant="light" size="xs">
                    View Details
                </Button>
            </Group>
        </Group>
    </Paper>
);
const BookingCard = ({ booking }: { booking: Booking }) => (
    <Paper p="md" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
            <div>
                <Text fw={500}>{booking.court_name}</Text>
                <Group gap="xs">
                    <IconMapPin size={14} />
                    <Text size="sm" c="dimmed">{booking.venue_name} - {booking.venue_location}</Text>
                </Group>
            </div>
            <Badge
                color={
                    booking.status === 'pending' ? 'yellow' :
                        booking.status === 'confirmed' ? 'green' :
                            booking.status === 'cancelled' ? 'red' :
                                'gray'
                }
            >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
        </Group>

        <Group justify="space-between" mt="md">
            <Stack gap="xs">
                <Group gap="xs">
                    <IconCalendarEvent size={14} />
                    <Text size="sm">{new Date(booking.date).toLocaleDateString()}</Text>
                </Group>
                <Text size="sm">
                    {booking.start_time} - {booking.end_time}
                </Text>
            </Stack>
            <Stack gap="xs" align="flex-end">
                <Text fw={500} size="lg">฿{booking.total_amount.toFixed(2)}</Text>
                <Text size="xs" c="dimmed">
                    Booked on {new Date(booking.created_at).toLocaleDateString()}
                </Text>
            </Stack>
        </Group>
    </Paper>
);
const ProfileHeader = ({ userData, profile }: { userData: any; profile: UserProfileDTO }) => (
    <Stack align="center">
        <Box pos="relative">
            <Avatar
                src={userData.avatar}
                size={120}
                radius={120}
                mx="auto"
                style={{ border: '4px solid', borderColor: 'var(--mantine-color-blue-1)' }}
            />
            <ActionIcon
                variant="filled"
                color="blue"
                size="md"
                pos="absolute"
                bottom={0}
                right={0}
                radius="xl"
            >
                <IconEdit size={16} />
            </ActionIcon>
        </Box>

        <Title order={2}>{userData.name}</Title>

        <Group gap="xs">
            {userData.badges.map((badge: any, index: number) => (
                <Badge
                    key={index}
                    color={badge.color}
                    leftSection={badge.icon}
                >
                    {badge.label}
                </Badge>
            ))}
        </Group>

        <Badge size="lg" color="blue">
            {userData.level.charAt(0).toUpperCase() + userData.level.slice(1)}
        </Badge>

        <ContactInfo profile={profile} />
        <BioSection profile={profile} />
        <Text size="sm" c="dimmed">{userData.joinDate}</Text>
    </Stack>
);

const ContactInfo = ({ profile }: { profile: UserProfileDTO }) => (
    <>
        <Group gap="xs">
            <IconMail size={16} />
            <Text size="sm">{profile.email}</Text>
        </Group>
        <Group gap="xs">
            <IconPhone size={16} />
            <Text size="sm">{profile.phone}</Text>
        </Group>
        <Group gap="xs">
            <IconMapPin size={16} />
            <Text size="sm">{profile.location}</Text>
        </Group>
    </>
);

const BioSection = ({ profile }: { profile: UserProfileDTO }) => (
    profile.bio ? (
        <Paper p="sm" radius="md" withBorder w="100%">
            <Text size="sm" c="dimmed">
                {profile.bio}
            </Text>
        </Paper>
    ) : null
);

const ProfileStats = ({ userData }: { userData: any }) => (
    <Grid mt="xl">
        <StatCard label="Hosted" value={userData.stats.hosted} />
        <StatCard label="Joined" value={userData.stats.joined} />
        <StatCard label="Reviews" value={userData.stats.reviews} />
        <StatCard label="Partners" value={userData.stats.regularPartners} />
    </Grid>
);

const ActionButtons = () => (
    <Group mt="xl" grow>
        <Button
            variant="light"
            leftSection={<IconMessageCircle size={16} />}
        >
            Message
        </Button>
        <Button
            variant="light"
            leftSection={<IconShare size={16} />}
        >
            Share
        </Button>
    </Group>
);
const PartyTabs = ({ activeTab, setActiveTab, mockParties, bookings = [] }: {
    activeTab: string;
    setActiveTab: (value: string | null) => void;
    mockParties: Party[];
    bookings?: Booking[];
}) => (
    <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
            <Tabs.Tab
                value="hosted"
                leftSection={<IconTrophy size={16} />}
            >
                Hosted Parties
            </Tabs.Tab>
            <Tabs.Tab
                value="joined"
                leftSection={<IconCalendarEvent size={16} />}
            >
                Joined Parties
            </Tabs.Tab>
            <Tabs.Tab
                value="bookings"
                leftSection={<IconCalendarEvent size={16} />}
            >
                My Bookings
            </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="hosted" p="md">
            <Stack>
                {mockParties.map((party) => (
                    <PartyCard key={party.id} party={party} />
                ))}
            </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="joined" p="md">
            <Stack>
                {mockParties.map((party) => (
                    <PartyCard key={party.id} party={party} />
                ))}
            </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="bookings" p="md">
            <Stack>
                {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                ))}
            </Stack>
        </Tabs.Panel>
    </Tabs>
);

const ProfilePage = ({ profile }: { profile: UserProfileDTO }) => {
    const [activeTab, setActiveTab] = useState<string>('hosted');
    const [bookings, setBookings] = useState<Booking[]>([]);

    const fetchBookings = async () => {
        try {
            const response = await bookingService.getMyBooking()
            if (response) {
                setBookings(response.data)
            }
            else {
                console.log('No bookings found')
                setBookings([])
            }
        } catch (error) {
            console.error('Fetch bookings error:', error);
        }
    }

    useEffect(() => {
        fetchBookings();
    }, []);


    const userData = {
        name: `${profile.first_name} ${profile.last_name}`,
        avatar: profile.avatar_url || '/api/placeholder/128/128',
        level: profile.play_level,
        location: profile.location,
        joinDate: `Last active: ${new Date(profile.last_active_at).toLocaleDateString()}`,
        stats: {
            hosted: profile.hosted_sessions,
            joined: profile.joined_sessions,
            rating: profile.average_rating,
            reviews: profile.total_reviews,
            regularPartners: profile.regular_partners,
        },
        badges: [
            {
                label: `${profile.play_hand}-handed`,
                color: 'blue',
                icon: <IconWand size={12} />
            },
            {
                label: profile.gender,
                color: 'grape',
                icon: <IconBlender size={12} />
            },
            ...(profile.role === 'admin' ? [{
                label: 'Admin',
                color: 'red',
                icon: <IconStar size={12} />
            }] : []),
            ...(profile.average_rating >= 4.5 ? [{
                label: 'Top Rated',
                color: 'yellow',
                icon: <IconTrophy size={12} />
            }] : []),
        ],
    };

    const mockParties: Party[] = [
        {
            id: '1',
            title: 'Casual Badminton Session',
            location: 'Sports Complex A',
            time: 'Sep 18, 2024 16:00 - 18:00',
            participants: { current: 8, max: 10 },
            status: 'upcoming',
        },
        {
            id: '2',
            title: 'Weekend Practice',
            location: 'Central Stadium',
            time: 'Sep 20, 2024 14:00 - 16:00',
            participants: { current: 6, max: 8 },
            status: 'upcoming',
        },
    ];

    return (
        // ปรับ container style
        <Box bg="gray.0" mih="100vh">
            <Container size="xl" py="xl" h="100%">
                <Grid gutter="lg" style={{ minHeight: '100%' }}>
                    {/* Profile Sidebar */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card shadow="sm" radius="md" withBorder h="100%">
                            <Stack h="100%" justify="space-between">
                                <div>
                                    <ProfileHeader userData={userData} profile={profile} />
                                    <ProfileStats userData={userData} />
                                </div>
                                <ActionButtons />
                            </Stack>
                        </Card>
                    </Grid.Col>

                    {/* Main Content */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Card shadow="sm" radius="md" withBorder h="100%">
                            <Stack h="100%">
                                <PartyTabs
                                    activeTab={activeTab}
                                    setActiveTab={(value) => setActiveTab(value as string)}
                                    mockParties={mockParties}
                                    bookings={bookings}
                                />
                            </Stack>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    );
};

const MyProfilePage = () => {
    const [profileData, setProfileData] = useState<UserProfileDTO | null>(null);


    const fetchProfileData = async () => {
        const response = await authService.getProfile()
        console.log(response);
        if (response) {
            setProfileData(response)
        }
    }

    useEffect(() => {
        fetchProfileData();
    }
        , []);

    if (!profileData) {
        return null;
    }

    return <ProfilePage profile={profileData} />;
};

export default MyProfilePage;