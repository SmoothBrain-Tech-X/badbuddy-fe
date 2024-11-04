'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    Container, Grid, Card, Group, Text, Badge, Button, Stack,
    Box, ThemeIcon, Paper, Title, ActionIcon, Image, Tabs,
    Table, Breadcrumbs, Anchor, Modal, Center, SimpleGrid,
    Avatar, Progress, Select, List,
} from '@mantine/core';
import {
    IconMapPin,
    IconChevronRight,
    IconCalendar, IconArrowLeft,
    IconAlertCircle
} from '@tabler/icons-react';
import { VenueService } from '@/services/venue.service';
import { Venue, venueService } from '@/services';
import VenueImages from './components/VenueImages';
import AboutTab from './components/AboutTab';
import CourtsTab from './components/CourtsTab';
import ReviewsTab from './components/ReviewsTab';
import OperatingHoursCard from './components/OperatingHoursCard';
import ContactCard from './components/ContactCard';
import QuickInfoCard from './components/QuickInfoCard';
import { Review, CreateReviewDTO } from '@/services';

const BookingCard = ({
    venueData,
    selectedCourt,
    selectedTime,
    onCourtSelect,
    onTimeSelect,
    onBookNow,
}: {
    venueData: Venue;
    selectedCourt: string | null;
    selectedTime: string | null;
    onCourtSelect: (court: string | null) => void;
    onTimeSelect: (time: string | null) => void;
    onBookNow: () => void;
}) => (
    <Card shadow="sm" radius="md" withBorder>
        <Stack>
            <Title order={3}>Book a Court</Title>
            <Select
                label="Select Court"
                placeholder="Choose a court"
                data={Array.from({ length: venueData.courts.length }).map((_, i) => ({
                    value: `Court ${i + 1}`,
                    label: `Court ${i + 1}`,
                }))}
                value={selectedCourt}
                onChange={onCourtSelect}
            />
            <Select
                label="Select Time"
                placeholder="Choose time slot"
                data={[]}
                value={selectedTime}
                onChange={onTimeSelect}
            />
            <Text fw={500}>Price: {0}</Text>
            <Button
                fullWidth
                disabled={!selectedCourt || !selectedTime}
                leftSection={<IconCalendar size={16} />}
                onClick={onBookNow}
            >
                Book Now
            </Button>

            <Paper p="sm" radius="md" bg="orange.0">
                <Group align="flex-start">
                    <ThemeIcon color="orange" variant="light">
                        <IconAlertCircle size={16} />
                    </ThemeIcon>
                    <Text size="sm">
                        Booking requires a 50% deposit. Cancellation is free up to 24 hours before the booking time.
                    </Text>
                </Group>
            </Paper>
        </Stack>
    </Card>
);
const VenueDetailPage = () => {
    const params = useParams();
    const venueId = params.id as string;

    // State
    const [venueData, setVenueData] = useState<Venue>({
        id: '',
        name: '',
        description: '',
        address: '',
        location: '',
        phone: '',
        email: '',
        open_range: [],
        image_urls: '',
        status: 'active',
        rating: 0,
        total_reviews: 0,
        courts: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });
    const [reviews, setReviews] = useState<Review[]>([]);
    const [bookingModalOpened, setBookingModalOpened] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const fetchVenueData = async () => {
        try {
            const data = await venueService.getById(venueId);
            if (!data) {
                toast.error('Venue not found');
                setError('Venue not found');
                return;
            }
            setVenueData(data);
        } catch (err) {
            const errorMessage = 'Failed to load venue details';
            toast.error(errorMessage);
            setError(errorMessage);
        }
    };

    const fetchReviews = async () => {
        try {
            const reviewsResponse = await venueService.getReviews(venueId);
            if (!reviewsResponse) {
                const errorMessage = 'Failed to load reviews';
                toast.error(errorMessage);
                setError(errorMessage);
                return;
            }
            setReviews(reviewsResponse.reviews);
        } catch (err) {
            const errorMessage = 'Failed to load reviews';
            toast.error(errorMessage);
            setError(errorMessage);
        }
    };

    useEffect(() => {
        if (!venueId) {
            toast.error('Venue ID is required');
            setError('Venue ID is required');
            return;
        }

        const loadData = async () => {
            setLoading(true);
            try {
                await Promise.all([fetchVenueData(), fetchReviews()]);

            } catch (err) {
                const errorMessage = 'Failed to load venue details';
                toast.error(errorMessage);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [venueId]);


    // Handlers
    const handleBookingSubmit = async () => {
        const loadingToast = toast.loading('Creating booking...');
        // try {
        //     setLoading(true);
        //     const result = await API.createBooking({
        //         venueId: venueData.id,
        //         courtId: selectedCourt!,
        //         time: selectedTime!,
        //         date: new Date().toISOString(),
        //     });

        //     if (result.success) {
        //         setBookingModalOpened(false);
        //         toast.success('Booking created successfully!', {
        //             id: loadingToast,
        //         });
        //     }
        // } catch (err) {
        //     const errorMessage = 'Failed to create booking. Please try again.';
        //     toast.error(errorMessage, {
        //         id: loadingToast,
        //     });
        //     setError(errorMessage);
        // } finally {
        //     setLoading(false);
        // }
    };

    const handleBookCourt = (courtNumber: number) => {
        setSelectedCourt(`Court ${courtNumber}`);
        setBookingModalOpened(true);
        toast.success(`Selected Court ${courtNumber}`);
    };

    const handleCreateReview = async (values: CreateReviewDTO) => {
        const loadingToast = toast.loading('Submitting review...');
        try {
            setLoading(true);
            const result = await venueService.addReview(venueId, values);
            if (result) {
                await fetchReviews();
                toast.success('Review submitted successfully!', {
                    id: loadingToast,
                });
            }
        } catch (err) {
            const errorMessage = 'Failed to submit review. Please try again.';
            toast.error(errorMessage, {
                id: loadingToast,
            });
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Center h="100vh">
                <Text>Loading...</Text>
            </Center>
        );
    }

    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="xl" py="xl">
                {/* Breadcrumbs */}
                <Breadcrumbs mb="lg" separator={<IconChevronRight size={16} />}>
                    <Anchor href="/venues">
                        <Group gap="xs">
                            <IconArrowLeft size={16} />
                            <span>All Venues</span>
                        </Group>
                    </Anchor>
                    <Text>{venueData.name}</Text>
                </Breadcrumbs>

                {error && (
                    <Paper p="md" mb="lg" bg="red.0" c="red.7">
                        <Group>
                            <IconAlertCircle size={16} />
                            <Text size="sm">{error}</Text>
                        </Group>
                    </Paper>
                )}

                <Grid gutter="lg">
                    {/* Title */}
                    <Grid.Col span={12}>
                        <Title order={1}>{venueData.name}</Title>
                        <Group gap="xs">
                            <IconMapPin size={14} stroke={1.5} className="text-gray-500" />
                            <Text size="sm" c="dimmed">{venueData.location}</Text>
                        </Group>
                    </Grid.Col>

                    {/* Main Content */}
                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        <Stack>
                            <VenueImages images={venueData.image_urls || []} />

                            <Card shadow="sm" radius="md" withBorder>
                                <Tabs defaultValue="about">
                                    <Tabs.List>
                                        <Tabs.Tab value="about">About</Tabs.Tab>
                                        <Tabs.Tab value="courts">Courts</Tabs.Tab>
                                        <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
                                    </Tabs.List>

                                    <Tabs.Panel value="about" pt="md">
                                        <AboutTab
                                            venueData={venueData}
                                            facilities={[]}
                                        />
                                    </Tabs.Panel>

                                    <Tabs.Panel value="courts" pt="md">
                                        <CourtsTab
                                            courts={venueData.courts}
                                            onBookCourt={() => { }}
                                        />
                                    </Tabs.Panel>

                                    <Tabs.Panel value="reviews" pt="md">
                                        <ReviewsTab
                                            reviews={reviews}
                                            rating={venueData.rating}
                                            total_reviews={venueData.total_reviews}
                                            onSubmit={handleCreateReview}
                                        />
                                    </Tabs.Panel>
                                </Tabs>

                            </Card>

                        </Stack>
                    </Grid.Col>

                    {/* Sidebar */}
                    <Grid.Col span={{ base: 12, lg: 4 }}>
                        <Stack>
                            <QuickInfoCard
                                venue={{
                                    id: venueData.id,
                                    location: venueData.location,
                                    open_range: venueData.open_range,
                                    rating: venueData.rating,
                                    total_reviews: venueData.total_reviews,
                                }}
                            />
                            <OperatingHoursCard openRange={venueData.open_range} />
                            <ContactCard
                                venue={{
                                    phone: venueData.phone,
                                    email: venueData.email,
                                    address: venueData.address,
                                    location: venueData.location,
                                }}
                            />
                        </Stack>

                    </Grid.Col>
                </Grid>

                {/* Booking Modal */}
                <Modal
                    opened={bookingModalOpened}
                    onClose={() => setBookingModalOpened(false)}
                    title="Booking Confirmation"
                    size="md"
                >
                    <Stack>
                        <Paper p="md" radius="md" bg="gray.0">
                            <Stack>
                                <Group justify="space-between">
                                    <Text fw={500}>Selected Court</Text>
                                    <Text>{selectedCourt}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text fw={500}>Date</Text>
                                    <Text>Today</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text fw={500}>Time</Text>
                                    <Text>{selectedTime}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text fw={500}>Duration</Text>
                                    <Text>1 hour</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text fw={500}>Price</Text>
                                    <Text>฿300</Text>
                                </Group>
                            </Stack>
                        </Paper>

                        <Paper p="md" radius="md" bg="orange.0">
                            <Stack gap="xs">
                                <Text fw={500}>Important Notes:</Text>
                                <List size="sm">
                                    <List.Item>50% deposit required for confirmation</List.Item>
                                    <List.Item>Free cancellation up to 24 hours before</List.Item>
                                    <List.Item>Please arrive 10 minutes early</List.Item>
                                </List>
                            </Stack>
                        </Paper>

                        <Group grow>
                            <Button
                                variant="light"
                                onClick={() => setBookingModalOpened(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleBookingSubmit}
                                loading={loading}
                            >
                                Confirm Booking
                            </Button>
                        </Group>
                    </Stack>
                </Modal>
            </Container>
        </Box>
    );
};

export default VenueDetailPage;



