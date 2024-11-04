import React from 'react';
import {
  IconAirConditioning,
  IconClipboardX,
  IconMessage,
  IconParking,
  IconShoe,
  IconStarFilled,
  IconWifi,
} from '@tabler/icons-react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Group,
  List,
  Paper,
  Progress,
  rem,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { GoogleMapsEmbed } from '@/components/GoogleMapsEmbed';
import { Court, CreateReviewDTO, Review, Venue } from '@/services';
import CreateReview from './CreateReview';

interface VenueDetailsProps {
  venueData: Venue;
  facilities: string[];
  reviews: Review[];
  onBookCourt: (courtId: string) => void;
  onSubmitReview: (values: CreateReviewDTO) => Promise<void>;
}

const FacilityIcon = ({ facility }: { facility: string }) => {
  const facilityMap = {
    Parking: IconParking,
    Shower: IconShoe,
    'Air Conditioning': IconAirConditioning,
    WiFi: IconWifi,
  };
  const Icon = facilityMap[facility as keyof typeof facilityMap];
  return Icon ? <Icon size={20} /> : null;
};

const StarRating = ({ rating }: { rating: number }) => (
  <Group gap={2}>
    {Array.from({ length: 5 }).map((_, index) => (
      <IconStarFilled
        key={index}
        size={rem(16)}
        style={{
          color: index < rating ? '#FAB005' : '#E7E7E9',
          width: rem(16),
          height: rem(16),
        }}
      />
    ))}
  </Group>
);

const calculateRatingPercentage = (reviews: Review[], targetRating: number): number => {
  if (reviews.length === 0) return 0;
  const ratingCount = reviews.filter((review) => review.rating === targetRating).length;
  return (ratingCount / reviews.length) * 100;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getStatusColor = (status: Court['status']) => {
  switch (status) {
    case 'available':
      return 'green';
    case 'occupied':
      return 'red';
    case 'maintenance':
      return 'yellow';
    default:
      return 'gray';
  }
};

const getStatusText = (status: Court['status']) => {
  switch (status) {
    case 'available':
      return 'Available Now';
    case 'occupied':
      return 'Occupied';
    case 'maintenance':
      return 'Under Maintenance';
    default:
      return 'Unknown Status';
  }
};

const VenueDetails = ({
  venueData,
  facilities,
  reviews,
  onBookCourt,
  onSubmitReview,
}: VenueDetailsProps) => {
  return (
    <Stack gap="xl" className="max-w-5xl mx-auto">
      {/* About Section */}
      <Card radius="md" mt={20}>
        <Stack gap="lg">
          <Text size="xl" fw={600} className="text-blue-600">
            About
          </Text>
          <Text>{venueData.description}</Text>

          {venueData.facilities.length > 0 && (
            <div>
              <Text fw={500} size="lg" mb="xs">
                Facilities
              </Text>
              {/* <SimpleGrid cols={{ base: 2, sm: 4 }}> */}
              <Group>
                {venueData.facilities.map((facility) => (
                  <Paper key={facility.id} p="sm" radius="md" withBorder>
                    <Group>
                      <ThemeIcon variant="light" size="lg" color="blue">
                        <FacilityIcon facility={facility.name} />
                      </ThemeIcon>
                      <Text size="sm">{facility.name}</Text>
                    </Group>
                  </Paper>
                ))}
              </Group>
              {/* </SimpleGrid> */}
            </div>
          )}

          {/* {vanueData.rules.length > 0 && ( */}
          {/* <div>
            <Text fw={500} size="lg" mb="xs">Rules & Guidelines</Text>
            <List withPadding>
                {venueData.rules.map((rule, index) => (
                    <List.Item key={index}>{rule}</List.Item>
                ))}
            </List>
        </div> */}
          {venueData.rules.length > 0 && (
            <div>
              <Text fw={500} size="lg" mb="xs">
                Rules & Guidelines
              </Text>
              <List withPadding>
                {venueData.rules.map((ruleItem, index) => (
                  <List.Item key={index}>{ruleItem.rule}</List.Item>
                ))}
              </List>
            </div>
          )}
        </Stack>
      </Card>

      {/* Courts Section */}
      <Card radius="md">
        <Stack gap="lg">
          <Text size="xl" fw={600} className="text-blue-600">
            Map & Directions
          </Text>
          <GoogleMapsEmbed latitude={venueData.latitude} longitude={venueData.longitude} />
        </Stack>
      </Card>

      {/* Courts Section */}
      <Card radius="md">
        <Stack gap="lg">
          <Text size="xl" fw={600} className="text-blue-600">
            Available Courts
          </Text>

          {venueData.courts.length > 0 ? (
            venueData.courts.map((court) => (
              <Paper
                key={court.id}
                p="md"
                radius="md"
                withBorder
                className="transition-all duration-200 hover:shadow-md"
              >
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{court.name}</Text>
                    <Text size="sm" c="dimmed">
                      {court.description}
                    </Text>
                    <Text size="sm" mt={4} fw={500} c="blue.6">
                      ฿{court.price_per_hour.toLocaleString()} / hour
                    </Text>
                  </div>
                  <Group>
                    <Badge color={getStatusColor(court.status)} variant="light" size="lg">
                      {getStatusText(court.status)}
                    </Badge>
                  </Group>
                </Group>
              </Paper>
            ))
          ) : (
            <Center>
              <Stack align="center">
                <IconClipboardX size={64} stroke={1.5} color="gray" />
                <Stack align="center">
                  <Text size="xl" fw={500} c="dimmed">
                    No Courts Available
                  </Text>
                  <Text size="sm" c="dimmed" mt={4} maw={400} ta="center">
                    There are currently no courts listed for this venue. Please check back later or
                    contact the venue for more information.
                  </Text>
                </Stack>
              </Stack>
            </Center>
          )}
        </Stack>
      </Card>

      {/* Reviews Section */}
      <Card radius="md">
        <Stack gap="lg">
          <Text size="xl" fw={600} className="text-blue-600">
            Reviews
          </Text>

          <Group justify="center" gap="xl" py="md">
            <Stack align="center" gap={4}>
              <Text size="xl" fw={700} className="text-blue-600">
                {venueData.rating.toFixed(1)}
              </Text>
              <StarRating rating={venueData.rating} />
              <Group gap={4} align="center">
                <IconMessage size={14} className="text-gray-500" />
                <Text size="sm" c="dimmed">
                  {venueData.total_reviews.toLocaleString()} reviews
                </Text>
              </Group>
            </Stack>
            <Divider orientation="vertical" />
            <Box w={300}>
              {[5, 4, 3, 2, 1].map((star) => (
                <Group key={star} gap="xs" mb={6}>
                  <Group gap={4} w={40}>
                    <Text size="sm" c="dimmed">
                      {star}
                    </Text>
                    <IconStarFilled size={12} className="text-yellow-400" />
                  </Group>
                  <Progress
                    value={calculateRatingPercentage(reviews, star)}
                    size="sm"
                    color="yellow"
                    style={{ flex: 1 }}
                    radius="xl"
                  />
                  <Text size="xs" c="dimmed" w={40} ta="right">
                    {Math.round(calculateRatingPercentage(reviews, star))}%
                  </Text>
                </Group>
              ))}
            </Box>
          </Group>

          <Stack gap="xs">
            {reviews.map((review) => (
              <Card key={review.id} radius="md" py={10}>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Group>
                      <Avatar
                        src={review.reviewer.avatar_url}
                        radius="xl"
                        size="md"
                        alt={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                        className="border-2 border-blue-100"
                      >
                        {review.reviewer.first_name[0]}
                        {review.reviewer.last_name[0]}
                      </Avatar>
                      <div>
                        <Text fw={600} className="text-blue-600">
                          {review.reviewer.first_name} {review.reviewer.last_name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {formatDate(review.created_at)}
                        </Text>
                      </div>
                    </Group>
                    <StarRating rating={review.rating} />
                  </Group>

                  <Text size="sm" className="text-gray-600 leading-relaxed">
                    {review.comment}
                  </Text>
                </Stack>
              </Card>
            ))}

            {reviews.length === 0 && (
              <Card p="xl" radius="md" withBorder>
                <Stack align="center" gap="md">
                  <IconMessage size={48} color="gray" />
                  <Text c="dimmed" fw={500}>
                    No reviews yet
                  </Text>
                </Stack>
              </Card>
            )}
          </Stack>

          <CreateReview onSubmit={onSubmitReview} isLoading={false} />
        </Stack>
      </Card>
    </Stack>
  );
};

export default VenueDetails;
