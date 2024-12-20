import React from 'react';
import {
  IconClock,
  IconDirections,
  IconHeart,
  IconHeartFilled,
  IconMapPin,
  IconShare,
  IconStarFilled,
} from '@tabler/icons-react';
import { ActionIcon, Button, Card, Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { OpenRange } from '@/services';

interface Venue {
  id: string;
  location: string;
  open_range: OpenRange[];
  rating: number;
  total_reviews: number;
}

interface QuickInfoCardProps {
  venue: Venue;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onShare?: () => void;
  onGetDirections?: () => void;
}

const formatTime = (timeString: string) => {
  try {
    const match = timeString.match(/T(\d{2}:\d{2})/);
    return match ? match[1] : 'Invalid time';
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
};

const getCurrentDayOpenHours = (openRange: OpenRange[]) => {
  const today = new Date().toLocaleString('en-us', { weekday: 'long' });
  const todaySchedule = openRange.find((schedule) => schedule.day === today);

  if (!todaySchedule || !todaySchedule.is_open) {
    return 'Closed Today';
  }

  const openTime = formatTime(todaySchedule.open_time);
  const closeTime = formatTime(todaySchedule.close_time);

  return `Open Today: ${openTime} - ${closeTime}`;
};

const QuickInfoCard = ({
  venue,
  isFavorite = false,
  onToggleFavorite,
  onShare,
  onGetDirections,
}: QuickInfoCardProps) => {
  const currentOpenHours = getCurrentDayOpenHours(venue.open_range);

  return (
    <Card radius="md">
      <Stack>
        <Group justify="space-between">
          <Group>
            <ThemeIcon size="lg" color="yellow" variant="light">
              <IconStarFilled size={20} stroke={1.5} />
            </ThemeIcon>
            <div>
              <Text fw={500}>{venue.rating.toFixed(1)}</Text>
              <Text size="sm" c="dimmed">
                {venue.total_reviews.toLocaleString()} reviews
              </Text>
            </div>
          </Group>

          <Group>
            <ActionIcon
              variant="light"
              color={isFavorite ? 'red' : 'gray'}
              onClick={onToggleFavorite}
            >
              {isFavorite ? (
                <IconHeartFilled size={18} stroke={1.5} />
              ) : (
                <IconHeart size={18} stroke={1.5} />
              )}
            </ActionIcon>
            <ActionIcon variant="light" color="gray" onClick={onShare}>
              <IconShare size={18} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>

        <Paper p="sm" radius="md" bg="gray.0">
          <Stack gap="xs">
            <Group>
              <IconClock size={16} stroke={1.5} className="text-gray-500" />
              <Text size="sm">{currentOpenHours}</Text>
            </Group>
          </Stack>
        </Paper>

        <Button
          variant="light"
          leftSection={<IconDirections size={16} stroke={1.5} />}
          fullWidth
          onClick={onGetDirections}
        >
          Get Directions
        </Button>
      </Stack>
    </Card>
  );
};

export default QuickInfoCard;
