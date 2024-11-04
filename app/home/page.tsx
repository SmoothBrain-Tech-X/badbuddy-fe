'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconCalendarEvent,
  IconChevronRight,
  IconClock,
  IconHeart,
  IconMapPin,
  IconStarFilled,
  IconTarget,
  IconTrophy,
  IconUsers,
  TablerIcon,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core';
import useGetVenuesSearch from '@/hooks/react-query/venue/useGetVenuesSearch';
import { useAuth } from '@/hooks/useAuth';
import { venueService } from '@/services';
import { api, Api } from '@/services/api';
import { VenueService } from '@/services/venue.service';

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
  href?: string;
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
    image:
      'https://images.unsplash.com/photo-1721760886713-1ab0c5045bf7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.8,
    reviews: 128,
    location: 'Chatuchak',
    courtCount: 6,
    priceRange: '฿200-400/hour',
  },
  {
    id: '2',
    name: 'Central Stadium',
    image:
      'https://images.unsplash.com/photo-1721760886713-1ab0c5045bf7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
  { icon: IconCalendarEvent, label: 'Book Court', color: 'blue', href: '/venues' },
  { icon: IconUsers, label: 'Party', color: 'green', href: '/parties' },
];

// Components
const HeroSection: React.FC = () => {
  const auth = useAuth();
  return (
    <Box bg="blue.6" c="white" py={48}>
      <Container size="xl">
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="lg">
              <div>
                <Text size="xl" fw={500}>
                  Welcome back,
                </Text>
                <Title order={1}>
                  {auth.user?.first_name} {auth.user?.last_name}
                </Title>
              </div>
              <Text size="lg">
                Ready for your next badminton session? Find players, book courts, and join matches
                near you.
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

const VenuesSection: React.FC = () => {
  const navigate = useRouter();
  const getVenues = useGetVenuesSearch({});
  return (
    <Card>
      <Group justify="space-between" mb="md">
        <Title order={3}>Popular Venues</Title>
        <Button
          variant="light"
          onClick={() => navigate.push('/venues')}
          rightSection={<IconChevronRight size={16} />}
        >
          View All
        </Button>
      </Group>

      <Grid>
        {getVenues.data?.venues.slice(0, 2).map((venue) => (
          <Grid.Col key={venue.id} span={{ base: 12, sm: 6 }}>
            <Card p={0} radius="md" withBorder>
              <Card.Section>
                <Image src={venue.image_urls} height={200} alt={venue.name} />
              </Card.Section>

              <Stack p="md">
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{venue.name}</Text>
                    <Group gap="xs">
                      <IconMapPin size={14} />
                      <Text size="sm" c="dimmed">
                        {venue.location}
                      </Text>
                    </Group>
                  </div>
                </Group>
                <Group justify="space-between">
                  <Group>
                    <IconStarFilled size={16} color={'yellow'} />
                    <Text fw={500}>{venue.rating}</Text>
                    <Text size="sm" c="dimmed">
                      ({venue.total_reviews} reviews)
                    </Text>
                  </Group>
                </Group>
                <Button
                  onClick={() => navigate.push(`/venues/${venue.id}`)}
                  variant="light"
                  fullWidth
                >
                  View Details
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Card>
  );
};

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
  action: { icon: Icon, label, color, href },
}) => (
  <Link href={href ?? ''}>
    <Paper p="md" radius="md" withBorder style={{ cursor: 'pointer' }}>
      <Stack align="center" gap="xs">
        <ThemeIcon size="xl" radius="md" variant="light" color={color}>
          <Icon size={20} />
        </ThemeIcon>
        <Text size="sm" fw={500} ta="center">
          {label}
        </Text>
      </Stack>
    </Paper>
  </Link>
);

const RecentPlayers: React.FC = () => <Image radius="md" src="/ad01.jpeg" />;

const QuickActions: React.FC = () => (
  <Card>
    <Title order={3} mb="md">
      Quick Actions
    </Title>
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
  const getVenuesSearch = useGetVenuesSearch({});
  const [activeTab, setActiveTab] = useState<string>('recommended');

  return (
    <Box bg="gray.0">
      <HeroSection />

      <Container size="xl" py="xl">
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack>
              <Card>
                <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'recommended')}>
                  <Tabs.List>
                    <Tabs.Tab value="recommended" leftSection={<IconTarget size={16} />}>
                      Recommended
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="recommended" pt="md">
                    <Stack>
                      {getVenuesSearch.data?.venues.slice(0, 2).map((activity) => (
                        <Paper p="md" radius="md" withBorder>
                          <Group justify="space-between" wrap="nowrap">
                            <Group wrap="nowrap">
                              {/* <Avatar src={activity.host.avatar} radius="xl" /> */}
                              <div>
                                <Group gap="xs">
                                  <Text fw={500}>{activity.name}</Text>
                                </Group>
                                <Group gap="xs">
                                  <IconMapPin size={14} />
                                  <Text size="sm" c="dimmed">
                                    {activity.location}
                                  </Text>
                                </Group>
                              </div>
                            </Group>
                          </Group>
                        </Paper>
                      ))}
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
