import React from 'react';
import { useRouter } from 'next/navigation';
import { IconCalendar, IconClock, IconCrown, IconMapPin, IconUsers } from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { Session } from '@/services';

const PartyCard: React.FC<{ party: Session; onJoinLeave: () => Promise<void> }> = ({
  party,
  onJoinLeave,
}) => {
  const router = useRouter();
  const isJoined = false;

  // Format date
  const date = new Date(`${party.session_date}T${party.start_time}`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Format time range
  const startTime = new Date(`${party.session_date}T${party.start_time}`).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = new Date(`${party.session_date}T${party.end_time}`).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const avatarUrl = (): string => {
    switch (party.host_gender) {
      case 'female':
        return 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/5.png';
      case 'male':
        return 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/68.png';
      default:
        return 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/86.png';
    }
  };

  return (
    <Card withBorder h="100%">
      <Stack>
        <Group justify="space-between">
          <Group>
            <Box pos="relative">
              <Avatar
                src={avatarUrl()}
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
              <Text fw={700} size="lg" lineClamp={1}>
                {party.title}
              </Text>
              <Text size="sm" c="dimmed">
                {party.host_name}
              </Text>
            </div>
          </Group>
        </Group>

        {/* Date and Time Section - Now More Prominent */}
        <Grid>
          <Grid.Col span={6}>
            <Paper p="sm" radius="md" bg="gray.0" h="100%">
              <Group wrap="nowrap" h="100%">
                <Stack gap={0} style={{ flex: 1 }}>
                  <Text size="sm" fw={500} style={{ color: 'var(--mantine-color-blue-6)' }}>
                    Date
                  </Text>
                  <Text size="sm" lineClamp={1}>
                    {date}
                  </Text>
                </Stack>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={6}>
            <Paper p="sm" radius="md" bg="gray.0" h="100%">
              <Group wrap="nowrap" h="100%">
                <Stack gap={0} style={{ flex: 1 }}>
                  <Text size="sm" fw={500} style={{ color: 'var(--mantine-color-blue-6)' }}>
                    Time
                  </Text>
                  <Text size="sm" lineClamp={1}>
                    {startTime} - {endTime}
                  </Text>
                </Stack>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>

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

        <Paper p="sm" radius="md" bg="gray.0">
          <Group>
            <IconMapPin size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />
            <Text size="sm" lineClamp={1}>
              {party.venue_location}
            </Text>
          </Group>
        </Paper>

        <Stack gap="xs">
          <Text size="sm" fw={500} c="dimmed">
            Participants
          </Text>
          <Group justify="space-between">
            <Group gap="xs">
              <ThemeIcon size="sm" variant="light">
                <IconUsers size={14} />
              </ThemeIcon>
              <Text size="sm">
                {`${party.confirmed_players} Confirmed ${party.pending_players} Pending`}
              </Text>
            </Group>
            <Text fw={500} c="blue">
              ฿{party.cost_per_person}/person
            </Text>
          </Group>
          <Grid>
            {/* <Grid.Col span={6}>
                            <Button
                                fullWidth
                                variant={isJoined ? 'light' : 'filled'}
                                color={isJoined ? 'gray' : 'blue'}
                                onClick={onJoinLeave}
                                disabled={party.status === 'full' && !isJoined}
                            >
                                {isJoined ? 'Leave Party' : 'Join Party'}
                            </Button>
                        </Grid.Col> */}
            <Grid.Col span={12}>
              <Button
                fullWidth
                variant="light"
                onClick={() => router.push(`/parties/${party.id}`)}
                mb="xs"
              >
                View Details
              </Button>
            </Grid.Col>
          </Grid>
        </Stack>
      </Stack>
    </Card>
  );
};

export default PartyCard;
