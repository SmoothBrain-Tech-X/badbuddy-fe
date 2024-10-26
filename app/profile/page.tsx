
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
    Stack,
    Box,
    ThemeIcon,
    Paper,
    Title,
    ActionIcon,
    rem,
} from '@mantine/core';
import {
    IconMapPin,
    IconUsers,
    IconEdit,
    IconTrophy,
    IconCalendarEvent,
    IconSettings,
    IconStar,
    IconMessageCircle,
    IconHeart,
    IconShare,
} from '@tabler/icons-react';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('hosted');

    const userData = {
        name: "John Doe",
        avatar: "/api/placeholder/128/128",
        level: "Intermediate",
        location: "Bangkok, Thailand",
        joinDate: "Member since Sep 2023",
        stats: {
            hosted: 15,
            joined: 45,
            followers: 128,
            following: 89
        },
        badges: [
            { label: "Top Host", color: "yellow", icon: <IconTrophy size={12} /> },
            { label: "Verified", color: "blue", icon: <IconStar size={12} /> }
        ]
    };

    const parties = [
        {
            id: '1',
            title: 'Casual Badminton Session',
            location: 'Sports Complex A',
            time: 'Sep 18, 2024 16:00 - 18:00',
            participants: { current: 8, max: 10 },
            status: 'upcoming'
        },
        {
            id: '2',
            title: 'Weekend Practice',
            location: 'Central Stadium',
            time: 'Sep 20, 2024 14:00 - 16:00',
            participants: { current: 6, max: 8 },
            status: 'upcoming'
        }
    ];

    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="xl" py="xl">
                <Grid gutter="lg">
                    {/* Profile Sidebar */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack>
                            {/* Profile Card */}
                            <Card shadow="sm" radius="md" withBorder>
                                <Stack align="center" spacing="xs">
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
                                        {userData.badges.map((badge, index) => (
                                            <Badge
                                                key={index}
                                                color={badge.color}
                                                leftSection={badge.icon}
                                            >
                                                {badge.label}
                                            </Badge>
                                        ))}
                                    </Group>
                                    <Badge size="lg" color="blue">{userData.level}</Badge>
                                    <Group gap="xs">
                                        <IconMapPin size={16} />
                                        <Text size="sm">{userData.location}</Text>
                                    </Group>
                                    <Text size="sm" c="dimmed">{userData.joinDate}</Text>
                                </Stack>

                                <Grid mt="xl">
                                    {[
                                        { label: 'Hosted', value: userData.stats.hosted },
                                        { label: 'Joined', value: userData.stats.joined },
                                        { label: 'Followers', value: userData.stats.followers },
                                        { label: 'Following', value: userData.stats.following }
                                    ].map((stat, index) => (
                                        <Grid.Col span={6} key={index}>
                                            <Paper p="md" radius="md" ta="center" withBorder>
                                                <Text fw={700} size="xl">{stat.value}</Text>
                                                <Text size="sm" c="dimmed">{stat.label}</Text>
                                            </Paper>
                                        </Grid.Col>
                                    ))}
                                </Grid>

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
                            </Card>

                            {/* Settings Card */}
                            <Card shadow="sm" radius="md" withBorder>
                                <Group mb="md">
                                    <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                                        <IconSettings size={rem(20)} />
                                    </ThemeIcon>
                                    <Title order={3}>Quick Settings</Title>
                                </Group>
                                <Stack>
                                    <Button variant="light" fullWidth>Edit Profile</Button>
                                    <Button variant="light" fullWidth>Privacy Settings</Button>
                                    <Button variant="light" fullWidth>Notification Settings</Button>
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid.Col>

                    {/* Main Content */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Card shadow="sm" radius="md" withBorder>
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
                                </Tabs.List>

                                <Tabs.Panel value="hosted" p="md">
                                    <Stack>
                                        {parties.map((party) => (
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
                                        ))}
                                    </Stack>
                                </Tabs.Panel>

                                <Tabs.Panel value="joined" p="md">
                                    <Stack>
                                        {parties.map((party) => (
                                            <Paper key={party.id} p="md" radius="md" withBorder>
                                                <Group justify="space-between" mb="xs">
                                                    <div>
                                                        <Text fw={500}>{party.title}</Text>
                                                        <Group gap="xs">
                                                            <IconMapPin size={14} />
                                                            <Text size="sm" c="dimmed">{party.location}</Text>
                                                        </Group>
                                                    </div>
                                                    <Badge color="green">Joined</Badge>
                                                </Group>
                                                <Group mt="md" justify="space-between">
                                                    <Text size="sm">{party.time}</Text>
                                                    <Button variant="light" size="xs">
                                                        View Details
                                                    </Button>
                                                </Group>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </Tabs.Panel>
                            </Tabs>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    );
};

export default ProfilePage;