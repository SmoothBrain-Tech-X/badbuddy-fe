'use client';

import { useEffect, useState } from 'react';
import {
    Container,
    Title,
    Card,
    Group,
    Text,
    Badge,
    Button,
    Stack,
    Box,
    Paper,
    Avatar,
    Grid,
    ThemeIcon,
} from '@mantine/core';
import {
    IconMapPin,
    IconCalendarEvent,
    IconUsers,
    IconTrophy,
    IconMail,
    IconPhone,
    IconEdit,
    IconUserCircle,
    IconStar,
} from '@tabler/icons-react';
import { authService, UserProfileDTO } from '@/services';

const ProfilePage = () => {
    const [profile, setProfile] = useState<UserProfileDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await authService.getProfile();
            if (response) {
                setProfile(response);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Header Section with blue background
    const HeaderSection = () => (
        <Box bg="blue.6" c="white" py={48}>
            <Container size="xl">
                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack gap="lg">
                            <div>
                                <Text size="xl" fw={500}>Profile</Text>
                                <Title order={1}>My Profile</Title>
                            </div>
                            <Text size="lg">
                                Manage your personal information and preferences.
                            </Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    );

    const StatCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
        <Paper withBorder p="md" radius="md">
            <Group>
                <ThemeIcon
                    size="lg"
                    radius="md"
                    variant="light"
                >
                    <Icon size={20} />
                </ThemeIcon>
                <div>
                    <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                        {label}
                    </Text>
                    <Text fw={700} size="xl">
                        {value}
                    </Text>
                </div>
            </Group>
        </Paper>
    );

    if (!profile) {
        return null;
    }

    return (
        <Box bg="gray.0">
            <HeaderSection />

            <Container size="xl" py="xl">
                <Grid gutter="lg">
                    {/* Basic Info Card */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card withBorder radius="md">
                            <Stack align="center" mb="md">
                                <Box pos="relative">
                                    <Avatar
                                        src={profile.avatar_url || '/api/placeholder/128/128'}
                                        size={120}
                                        radius={120}
                                        mx="auto"
                                        styles={{
                                            root: { border: '4px solid white' }
                                        }}
                                    />
                                    <Button
                                        variant="filled"
                                        size="xs"
                                        radius="xl"
                                        pos="absolute"
                                        bottom={0}
                                        right={0}
                                        leftSection={<IconEdit size={14} />}
                                    >
                                        Edit
                                    </Button>
                                </Box>

                                <Stack align="center" gap="xs">
                                    <Title order={2}>{profile.first_name} {profile.last_name}</Title>
                                    <Badge size="lg" radius="sm">
                                        {profile.play_level}
                                    </Badge>
                                </Stack>
                            </Stack>

                            <Stack gap="md">
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

                                {profile.bio && (
                                    <Paper withBorder p="md" radius="md">
                                        <Text size="sm" c="dimmed">
                                            {profile.bio}
                                        </Text>
                                    </Paper>
                                )}
                            </Stack>
                        </Card>
                    </Grid.Col>

                    {/* Stats and Details */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Stack>
                            {/* Stats Grid */}
                            <Grid gutter="md">
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <StatCard
                                        icon={IconCalendarEvent}
                                        label="Hosted Sessions"
                                        value={profile.hosted_sessions}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <StatCard
                                        icon={IconUsers}
                                        label="Joined Sessions"
                                        value={profile.joined_sessions}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <StatCard
                                        icon={IconStar}
                                        label="Average Rating"
                                        value={profile.average_rating.toFixed(1)}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <StatCard
                                        icon={IconTrophy}
                                        label="Regular Partners"
                                        value={profile.regular_partners}
                                    />
                                </Grid.Col>
                            </Grid>

                            {/* Player Details */}
                            <Card withBorder radius="md">
                                <Title order={3} mb="md">Player Details</Title>
                                <Grid>
                                    <Grid.Col span={6}>
                                        <Stack gap="md">
                                            <Paper withBorder p="md" radius="md">
                                                <Text size="sm" fw={500} c="dimmed">Playing Hand</Text>
                                                <Text size="lg">{profile.play_hand}</Text>
                                            </Paper>
                                            <Paper withBorder p="md" radius="md">
                                                <Text size="sm" fw={500} c="dimmed">Gender</Text>
                                                <Text size="lg">{profile.gender}</Text>
                                            </Paper>
                                        </Stack>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Stack gap="md">
                                            <Paper withBorder p="md" radius="md">
                                                <Text size="sm" fw={500} c="dimmed">Total Reviews</Text>
                                                <Text size="lg">{profile.total_reviews}</Text>
                                            </Paper>
                                            <Paper withBorder p="md" radius="md">
                                                <Text size="sm" fw={500} c="dimmed">Member Since</Text>
                                                <Text size="lg">
                                                    -

                                                </Text>
                                            </Paper>
                                        </Stack>
                                    </Grid.Col>
                                </Grid>
                            </Card>

                            {/* Action Buttons */}
                            <Group grow>
                                <Button
                                    variant="light"
                                    leftSection={<IconEdit size={16} />}
                                >
                                    Edit Profile
                                </Button>
                                <Button
                                    variant="light"
                                    leftSection={<IconUserCircle size={16} />}
                                >
                                    View Public Profile
                                </Button>
                            </Group>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    );
};

export default ProfilePage;