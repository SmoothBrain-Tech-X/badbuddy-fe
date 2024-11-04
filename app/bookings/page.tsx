'use client';

import { useEffect, useState } from 'react';
import {
  IconCalendarEvent,
  IconCheck,
  IconClock,
  IconMapPin,
  IconTarget,
  IconUsers,
  IconWallet,
  IconX,
} from '@tabler/icons-react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Booking, bookingService } from '@/services';
import CancelBookingModal from './components/CancelBookingModal';

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  totalAmount: number;
}

interface BookingStatusConfig {
  label: string;
  value: string;
  color: string;
}

// config/bookings.ts
const bookingStatus: BookingStatusConfig[] = [
  { label: 'Pending', value: 'pending', color: 'yellow' },
  { label: 'Confirmed', value: 'confirmed', color: 'green' },
  { label: 'Cancelled', value: 'cancelled', color: 'red' },
];

export default function BookingManagement() {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalAmount: 0,
  });
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBooking();
      if (response) {
        setBookings(response.data);
        calculateStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookingData: Booking[]) => {
    const newStats = bookingData.reduce(
      (acc, booking) => ({
        ...acc,
        total: acc.total + 1,
        [booking.status]: acc[booking.status as keyof BookingStats] + 1,
        totalAmount: acc.totalAmount + booking.total_amount,
      }),
      {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        totalAmount: 0,
      }
    );
    setStats(newStats);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusConfig = (status: string): BookingStatusConfig => {
    return (
      bookingStatus.find((s) => s.value === status) || {
        label: status,
        value: status,
        color: 'gray',
      }
    );
  };
  const BookingCard = ({ booking }: { booking: Booking }) => {
    const statusConfig = getStatusConfig(booking.status);

    return (
      <Paper p="md" radius="md" withBorder>
        {/* Header with Court Info and Status */}
        <Group justify="space-between" mb="md">
          <div>
            <Text fw={600} size="lg" mb={4}>
              {booking.court_name}
            </Text>
            <Group gap="xs">
              <IconMapPin size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
              <Text size="sm" c="dimmed">
                {booking.venue_name} • {booking.venue_location}
              </Text>
            </Group>
          </div>
          <Badge variant="light" color={statusConfig.color} size="lg">
            {statusConfig.label}
          </Badge>
        </Group>

        {/* Divider */}
        <Divider my="sm" />

        {/* Booking Details */}
        <Group justify="space-between" mb="md">
          {/* Date and Time */}
          <Group gap="lg">
            <Group gap="xs">
              <IconCalendarEvent size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
              <Text size="sm">
                {new Date(booking.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </Group>
            <Group gap="xs">
              <IconClock size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
              <Text size="sm">
                {booking.start_time} - {booking.end_time}
              </Text>
            </Group>
          </Group>

          {/* Price */}
          <Text fw={600} size="lg" c="blue">
            ฿{booking.total_amount.toFixed(2)}
          </Text>
        </Group>

        {/* Action Buttons */}
        <Group justify="space-between" mt="md">
          <Text size="xs" c="dimmed">
            Booked on {new Date(booking.created_at).toLocaleDateString()}
          </Text>
          <Group gap="xs">
            {booking.status === 'pending' && (
              <Button
                variant="subtle"
                color="red"
                size="xs"
                onClick={() => {
                  setSelectedBookingId(booking.id);
                  setCancelModalOpen(true);
                }}
              >
                Cancel
              </Button>
            )}
            <Button variant="light" size="xs">
              View Details
            </Button>
          </Group>
        </Group>
      </Paper>
    );
  };
  const StatCard = ({
    label,
    value,
    color = 'blue',
  }: {
    label: string;
    value: string | number;
    color?: string;
  }) => (
    <Paper p="md" radius="md" withBorder>
      <Text c="dimmed" size="sm" ta="center" tt="uppercase">
        {label}
      </Text>
      <Text fw={700} size="xl" ta="center" c={color}>
        {value}
      </Text>
    </Paper>
  );

  const filterBookings = (status: string) => {
    switch (status) {
      case 'upcoming':
        return bookings.filter((b) => ['pending', 'confirmed'].includes(b.status));
      case 'completed':
        return bookings.filter((b) => b.status === 'completed');
      case 'cancelled':
        return bookings.filter((b) => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const EmptyState = ({
    icon: Icon,
    message,
    actionLabel,
    onAction,
  }: {
    icon: any;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  }) => (
    <Paper p="xl" radius="md" ta="center" c="dimmed">
      <Icon size={32} stroke={1.5} />
      <Text mt="md">{message}</Text>
      {actionLabel && (
        <Button variant="light" mt="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Paper>
  );

  // Header Section similar to your reference
  const HeaderSection = () => (
    <Box bg="blue.6" c="white" py={48}>
      <Container size="xl">
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="lg">
              <div>
                <Text size="xl" fw={500}>
                  Booking Management
                </Text>
                <Title order={1}>Your Court Bookings</Title>
              </div>
              <Text size="lg">View and manage all your court bookings and reservations.</Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );

  // config/bookings.ts
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const loadingId = notifications.show({
        loading: true,
        title: 'Cancelling Booking',
        message: 'Please wait while we cancel your booking...',
        autoClose: false,
        withCloseButton: false,
      });

      await bookingService.cancelBooking(bookingId);
      setCancelLoading(false);
      setCancelModalOpen(false);
      setSelectedBookingId(null);

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );

      // Recalculate stats
      calculateStats(
        bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );

      notifications.update({
        id: loadingId,
        title: 'Success',
        message: 'Booking cancelled successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to cancel booking',
        color: 'red',
        icon: <IconX size={16} />,
      });
      console.error('Error cancelling booking:', error);
    }
  };

  return (
    <Box bg="gray.0" mih="100vh">
      {' '}
      {/* Added minimum height */}
      <HeaderSection />
      <Container size="xl" py="xl" h="100%">
        {' '}
        {/* Added height */}
        <Grid gutter="lg" style={{ minHeight: 'calc(100vh - 200px)' }}>
          {' '}
          {/* Adjusted for header height */}
          {/* Stats Section */}
          <Grid.Col span={12}>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <StatCard label="Total Bookings" value={stats.total} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <StatCard label="Active Bookings" value={stats.confirmed} color="green" />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <StatCard label="Pending" value={stats.pending} color="yellow" />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <StatCard
                  label="Total Spent"
                  value={`฿${stats.totalAmount.toFixed(2)}`}
                  color="blue"
                />
              </Grid.Col>
            </Grid>
          </Grid.Col>
          {/* Bookings List */}
          <Grid.Col span={12} style={{ flex: 1 }}>
            <Card shadow="sm" radius="md" withBorder h="100%">
              <Stack h="100%">
                <Tabs
                  value={activeTab}
                  onChange={(value) => setActiveTab(value || 'upcoming')}
                  style={{ flex: 1 }}
                >
                  <Tabs.List>
                    <Tabs.Tab value="upcoming" leftSection={<IconCalendarEvent size={16} />}>
                      Upcoming
                    </Tabs.Tab>
                    <Tabs.Tab value="completed" leftSection={<IconTarget size={16} />}>
                      Completed
                    </Tabs.Tab>
                    <Tabs.Tab value="cancelled" leftSection={<IconUsers size={16} />}>
                      Cancelled
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="upcoming" pt="md">
                    <Stack>
                      {filterBookings('upcoming').length > 0 ? (
                        filterBookings('upcoming').map((booking) => (
                          <BookingCard key={booking.id} booking={booking} />
                        ))
                      ) : (
                        <EmptyState
                          icon={IconCalendarEvent}
                          message="No upcoming bookings"
                          actionLabel="Book a Court"
                          onAction={() => {
                            /* Add your navigation logic */
                          }}
                        />
                      )}
                    </Stack>
                  </Tabs.Panel>

                  <Tabs.Panel value="completed" pt="md">
                    <Stack>
                      {filterBookings('completed').length > 0 ? (
                        filterBookings('completed').map((booking) => (
                          <BookingCard key={booking.id} booking={booking} />
                        ))
                      ) : (
                        <EmptyState icon={IconTarget} message="No completed bookings" />
                      )}
                    </Stack>
                  </Tabs.Panel>

                  <Tabs.Panel value="cancelled" pt="md">
                    <Stack>
                      {filterBookings('cancelled').length > 0 ? (
                        filterBookings('cancelled').map((booking) => (
                          <BookingCard key={booking.id} booking={booking} />
                        ))
                      ) : (
                        <EmptyState icon={IconUsers} message="No cancelled bookings" />
                      )}
                    </Stack>
                  </Tabs.Panel>
                </Tabs>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
      <CancelBookingModal
        opened={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedBookingId(null);
        }}
        onConfirm={() => {
          if (selectedBookingId) {
            handleCancelBooking(selectedBookingId);
          }
        }}
        loading={cancelLoading}
      />
    </Box>
  );
}
