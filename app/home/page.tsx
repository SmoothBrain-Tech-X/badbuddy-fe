'use client';

import { useState } from 'react';
import {
  Container, Grid, Card, Group, Text, Badge, Button,
  Stack, Box, ThemeIcon, Paper, Title, Avatar,
  Image, SimpleGrid, ActionIcon, Tabs, useMantineTheme,
} from '@mantine/core';
import {
  IconMapPin, IconCalendarEvent, IconUsers, IconTrophy,
  IconChevronRight, IconStarFilled, IconHeart, IconClock,
  IconTarget, TablerIcon,
} from '@tabler/icons-react';

// Types
interface Activity {
  id: string;
  title: string;
  time: string;
  location: string;
  participants: {
    current: number;
    max: number;
  };
  host: {
    name: string;
    avatar: string;
  };
  type: 'practice' | 'tournament';
}

interface Venue {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  courtCount: number;
  priceRange: string;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface QuickAction {
  icon: TablerIcon;
  label: string;
  color: string;
}

// Mock Data
const upcomingActivities: Activity[] = [
  {
    id: '1',
    title: 'Evening Practice',
    time: 'Today, 18:00',
    location: 'Sports Complex A',
    participants: { current: 6, max: 8 },
    host: { name: 'John Doe', avatar: 'https://github.com/shadcn.png' },
    type: 'practice',
  },
  {
    id: '2',
    title: 'Weekend Tournament',
    time: 'Saturday, 14:00',
    location: 'Central Stadium',
    participants: { current: 12, max: 16 },
    host: { name: 'Sports Club', avatar: 'https://github.com/shadcn.png' },
    type: 'tournament',
  },
];

const popularVenues: Venue[] = [
  {
    id: '1',
    name: 'Sports Complex A',
    image: 'https://images.unsplash.com/photo-1721760886713-1ab0c5045bf7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.8,
    reviews: 128,
    location: 'Chatuchak',
    courtCount: 6,
    priceRange: '฿200-400/hour',
  },
  {
    id: '2',
    name: 'Central Stadium',
    image: 'https://images.unsplash.com/photo-1721760886713-1ab0c5045bf7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.6,
    reviews: 95,
    location: 'Ladprao',
    courtCount: 4,
    priceRange: '฿150-300/hour',
  },
];

const recentPlayers: Player[] = [
  { id: '1', name: 'John Doe', avatar: 'https://github.com/shadcn.png', level: 'Intermediate' },
  { id: '2', name: 'Jane Smith', avatar: 'https://github.com/shadcn.png', level: 'Advanced' },
  { id: '3', name: 'Mike Johnson', avatar: 'https://github.com/shadcn.png', level: 'Beginner' },
];

const quickActions: QuickAction[] = [
  { icon: IconCalendarEvent, label: 'Book Court', color: 'blue' },
  { icon: IconUsers, label: 'Find Players', color: 'green' },
  { icon: IconTrophy, label: 'Tournaments', color: 'orange' },
  { icon: IconMapPin, label: 'Near Me', color: 'grape' },
];

// Components
const HeroSection: React.FC = () => (
  <Box bg="blue.6" c="white" py={48}>
    <Container size="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg">
            <div>
              <Text size="xl" fw={500}>Welcome back,</Text>
              <Title order={1}>Sarawut Inpol</Title>
            </div>
            <Text size="lg">
              Ready for your next badminton session?
              Find players, book courts, and join matches near you.
            </Text>
            <Group>
              <Button
                variant="white"
                color="blue"
                leftSection={<IconCalendarEvent size={16} />}
                size="lg"
              >
                Create Party
              </Button>
              <Button
                variant="white"
                color="blue"
                leftSection={<IconMapPin size={16} />}
                size="lg"
              >
                Find Venues
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  </Box>
);

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => (
  <Paper p="md" radius="md" withBorder>
    <Group justify="space-between" wrap="nowrap">
      <Group wrap="nowrap">
        <Avatar src={activity.host.avatar} radius="xl" />
        <div>
          <Group gap="xs">
            <Text fw={500}>{activity.title}</Text>
            <Badge color={activity.type === 'tournament' ? 'orange' : 'blue'}>
              {activity.type === 'tournament' ? 'Tournament' : 'Practice'}
            </Badge>
          </Group>
          <Group gap="xs">
            <IconClock size={14} />
            <Text size="sm" c="dimmed">{activity.time}</Text>
            <Text size="sm" c="dimmed">•</Text>
            <IconMapPin size={14} />
            <Text size="sm" c="dimmed">{activity.location}</Text>
          </Group>
        </div>
      </Group>
      <Stack gap="xs" align="flex-end">
        <Badge>
          {activity.participants.current}/{activity.participants.max} joined
        </Badge>
        <Button variant="light" size="xs">
          View Details
        </Button>
      </Stack>
    </Group>
  </Paper>
);

const VenueCard: React.FC<{ venue: Venue }> = ({ venue }) => {
  const theme = useMantineTheme();

  return (
    <Card p={0} radius="md" withBorder>
      <Card.Section>
        <Image
          src={venue.image}
          height={200}
          alt={venue.name}
        />
      </Card.Section>

      <Stack p="md">
        <Group justify="space-between">
          <div>
            <Text fw={500}>{venue.name}</Text>
            <Group gap="xs">
              <IconMapPin size={14} />
              <Text size="sm" c="dimmed">{venue.location}</Text>
            </Group>
          </div>
          <Badge>{venue.courtCount} Courts</Badge>
        </Group>

        <Group justify="space-between">
          <Group>
            <IconStarFilled size={16} color={theme.colors.yellow[6]} />
            <Text fw={500}>{venue.rating}</Text>
            <Text size="sm" c="dimmed">({venue.reviews} reviews)</Text>
          </Group>
          <Text fw={500} c="blue">{venue.priceRange}</Text>
        </Group>

        <Button variant="light" fullWidth>
          View Details
        </Button>
      </Stack>
    </Card>
  );
};

const VenuesSection: React.FC = () => (
  <Card shadow="sm" radius="md" withBorder>
    <Group justify="space-between" mb="md">
      <Title order={3}>Popular Venues</Title>
      <Button variant="light" rightSection={<IconChevronRight size={16} />}>
        View All
      </Button>
    </Group>

    <Grid>
      {popularVenues.map((venue) => (
        <Grid.Col key={venue.id} span={{ base: 12, sm: 6 }}>
          <VenueCard venue={venue} />
        </Grid.Col>
      ))}
    </Grid>
  </Card>
);

const PlayerCard: React.FC<{ player: Player }> = ({ player }) => (
  <Paper p="md" radius="md" withBorder>
    <Group justify="space-between">
      <Group>
        <Avatar src={player.avatar} radius="xl" />
        <div>
          <Text fw={500}>{player.name}</Text>
          <Badge size="sm" variant="light">
            {player.level}
          </Badge>
        </div>
      </Group>
      <ActionIcon variant="light" color="blue">
        <IconHeart size={18} />
      </ActionIcon>
    </Group>
  </Paper>
);

const QuickActionCard: React.FC<{ action: QuickAction }> = ({
  action: { icon: Icon, label, color },
}) => (
  <Paper
    p="md"
    radius="md"
    withBorder
    style={{ cursor: 'pointer' }}
  >
    <Stack align="center" gap="xs">
      <ThemeIcon
        size="xl"
        radius="md"
        variant="light"
        color={color}
      >
        <Icon size={20} />
      </ThemeIcon>
      <Text size="sm" fw={500} ta="center">
        {label}
      </Text>
    </Stack>
  </Paper>
);

const RecentPlayers: React.FC = () => (
  <Card shadow="sm" radius="md" withBorder>
    <Group justify="space-between" mb="md">
      <Title order={3}>Recent Players</Title>
      <Button variant="light" rightSection={<IconChevronRight size={16} />}>
        View All
      </Button>
    </Group>

    <Stack>
      {recentPlayers.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </Stack>
  </Card>
);

const QuickActions: React.FC = () => (
  <Card shadow="sm" radius="md" withBorder>
    <Title order={3} mb="md">Quick Actions</Title>
    <SimpleGrid cols={2}>
      {quickActions.map((action) => (
        <QuickActionCard key={action.label} action={action} />
      ))}
    </SimpleGrid>
  </Card>
);

const Sidebar: React.FC = () => (
  <Stack>
    <RecentPlayers />
    <QuickActions />
  </Stack>
);

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('recommended');

  return (
    <Box bg="gray.0">
      <HeroSection />

      <Container size="xl" py="xl">
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack>
              <Card shadow="sm" radius="md" withBorder>
                <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'recommended')}>
                  <Tabs.List>
                    <Tabs.Tab value="recommended" leftSection={<IconTarget size={16} />}>
                      Recommended
                    </Tabs.Tab>
                    <Tabs.Tab value="nearby" leftSection={<IconMapPin size={16} />}>
                      Nearby
                    </Tabs.Tab>
                    <Tabs.Tab value="upcoming" leftSection={<IconCalendarEvent size={16} />}>
                      Upcoming
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="recommended" pt="md">
                    <Stack>
                      {upcomingActivities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                      ))}
                      <Button variant="light" fullWidth>
                        See More Activities
                      </Button>
                    </Stack>
                  </Tabs.Panel>
                </Tabs>
              </Card>

              <VenuesSection />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Sidebar />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
