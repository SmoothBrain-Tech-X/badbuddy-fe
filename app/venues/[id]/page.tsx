'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    Container, Grid, Card, Group, Text, Button, Stack,
    Box, ThemeIcon, Paper, Title, Drawer,
    List, Select, Center
} from '@mantine/core';
import {
    IconMapPin,
    IconCalendar,
    IconArrowLeft,
    IconAlertCircle,
    IconX
} from '@tabler/icons-react';
import { Venue, venueService } from '@/services';
import VenueImages from './components/VenueImages';
import VenueDetails from './components/VenueDetails';
import OperatingHoursCard from './components/OperatingHoursCard';
import ContactCard from './components/ContactCard';
import QuickInfoCard from './components/QuickInfoCard';
import { Review, CreateReviewDTO } from '@/services';
import BookingDrawer from './components/BookingDrawer';

const VenueDetailPage = () => {
    const params = useParams();
    const venueId = params.id as string;

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
        facilities: [],
        rules: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        latitude: 0,
        longitude: 0,
    });
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [drawerOpened, setDrawerOpened] = useState(false);

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

    const handleBookingSubmit = async () => {
        const loadingToast = toast.loading('Creating booking...');
        try {
            setLoading(true);
            // Booking logic here
            toast.success('Booking created successfully!', {
                id: loadingToast,
            });
            setDrawerOpened(false);
        } catch (err) {
            toast.error('Failed to create booking. Please try again.', {
                id: loadingToast,
            });
        } finally {
            setLoading(false);
        }
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
            toast.error('Failed to submit review. Please try again.', {
                id: loadingToast,
            });
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
                <Group mb="lg">
                    <Button
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        component="a"
                        href="/venues"
                    >
                        All Venues
                    </Button>
                </Group>

                {error && (
                    <Paper p="md" mb="lg" bg="red.0" c="red.7">
                        <Group>
                            <IconAlertCircle size={16} />
                            <Text size="sm">{error}</Text>
                        </Group>
                    </Paper>
                )}

                <Grid gutter="lg">
                    <Grid.Col span={12}>
                        <Group justify="space-between" align="flex-start">
                            <div>
                                <Title order={1}>{venueData.name}</Title>
                                <Group gap="xs">
                                    <IconMapPin size={14} stroke={1.5} className="text-gray-500" />
                                    <Text size="sm" c="dimmed">{venueData.location}</Text>
                                </Group>
                            </div>
                            <Button
                                size="lg"
                                leftSection={<IconCalendar size={16} />}
                                onClick={() => setDrawerOpened(true)}
                            >
                                Book Now
                            </Button>
                        </Group>
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Stack>
                            <Grid>
                                <Grid.Col span={{ base: 12, md: 8 }}>
                                    {venueData.image_urls && (
                                        <VenueImages images={venueData.image_urls || []} />
                                    )}

                                    <VenueDetails
                                        venueData={venueData}
                                        facilities={[]}
                                        reviews={reviews}
                                        onBookCourt={() => setDrawerOpened(true)}
                                        onSubmitReview={handleCreateReview}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 4 }}>
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
                        </Stack>
                    </Grid.Col>
                </Grid>

                <BookingDrawer
                    opened={drawerOpened}
                    onClose={() => setDrawerOpened(false)}
                    venueData={venueData}
                />
            </Container>
        </Box>
    );
};

export default VenueDetailPage;