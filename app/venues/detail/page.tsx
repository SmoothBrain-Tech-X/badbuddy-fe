/* eslint-disable max-len */
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
    Stack,
    Box,
    ThemeIcon,
    Paper,
    Title,
    ActionIcon,
    Image,
    Tabs,
    Table,
    Breadcrumbs,
    Anchor,
    Modal,
    Center,
    SimpleGrid,
    Avatar,
    Progress,
    Select,
    List,
} from '@mantine/core';
import {
    IconMapPin,
    IconStarFilled,
    IconClock,
    IconParking,
    IconShoe,
    IconAirConditioning,
    IconWifi,
    IconChevronRight,
    IconHeart,
    IconShare,
    IconCalendar,
    IconArrowLeft,
    IconThumbUp,
    IconThumbDown,
    IconAlertCircle,
    IconDirections,
} from '@tabler/icons-react';

const VenueDetailPage = () => {
    const [bookingModalOpened, setBookingModalOpened] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const venueData = {
        id: '1',
        name: 'Sports Complex A',
        images: ['https://images.unsplash.com/photo-1721760886713-1ab0c5045bf7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?q=80&w=1983&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
        location: 'Chatuchak, Bangkok',
        fullAddress: '123 Phahonyothin Rd, Chatuchak, Bangkok 10900',
        rating: 4.5,
        totalReviews: 128,
        priceRange: '฿200-400/hour',
        courtCount: 6,
        facilities: ['Parking', 'Shower', 'Air Conditioning', 'WiFi'],
        openHours: '06:00 - 22:00',
        description: 'A premium badminton facility featuring 6 professional courts with high-quality flooring and lighting. Perfect for both casual players and serious athletes.',
        rules: [
            'Proper sports attire required',
            'Indoor shoes only',
            'Bring your own racket or rent from us',
            'Please arrive 10 minutes before your booking time',
        ],
    };

    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    ];

    const reviews = [
        {
            id: '1',
            user: {
                name: 'John Doe',
                avatar: 'https://github.com/shadcn.png',
                playedCount: 15,
            },
            rating: 5,
            title: 'Excellent facilities',
            content: 'Great courts with perfect lighting. Very well maintained.',
            date: '2 days ago',
            likes: 12,
            dislikes: 1,
        },
        {
            id: '2',
            user: {
                name: 'Jane Smith',
                avatar: 'https://github.com/shadcn.png',
                playedCount: 8,
            },
            rating: 4,
            title: 'Good experience',
            content: 'Clean courts and friendly staff. Parking could be better.',
            date: '1 week ago',
            likes: 8,
            dislikes: 2,
        },
    ];

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

                <Grid gutter="lg">
                    {/* Main Content */}
                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        <Stack>
                            {/* Image Gallery */}
                            <Card shadow="sm" p={0} radius="md" withBorder>
                                <Image
                                    src={venueData.images[0]}
                                    height={400}
                                    alt={venueData.name}
                                />
                            </Card>

                            {/* Venue Info Tabs */}
                            <Card shadow="sm" radius="md" withBorder>
                                <Tabs defaultValue="about">
                                    <Tabs.List>
                                        <Tabs.Tab value="about">About</Tabs.Tab>
                                        <Tabs.Tab value="courts">Courts</Tabs.Tab>
                                        <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
                                    </Tabs.List>

                                    <Tabs.Panel value="about" pt="md">
                                        <Stack>
                                            <Text>{venueData.description}</Text>

                                            <div>
                                                <Text fw={500} size="lg" mb="xs">Facilities</Text>
                                                <SimpleGrid cols={{ base: 2, sm: 4 }}>
                                                    {venueData.facilities.map((facility) => (
                                                        <Paper key={facility} p="md" radius="md" withBorder>
                                                            <Group>
                                                                <ThemeIcon variant="light" size="lg" color="blue">
                                                                    <FacilityIcon
                                                                        facility={facility} />
                                                                </ThemeIcon>
                                                                <Text size="sm">{facility}</Text>
                                                            </Group>
                                                        </Paper>
                                                    ))}
                                                </SimpleGrid>
                                            </div>

                                            <div>
                                                <Text fw={500} size="lg" mb="xs">Rules & Guidelines</Text>
                                                <List withPadding>
                                                    {venueData.rules.map((rule, index) => (
                                                        <List.Item key={index}>{rule}</List.Item>
                                                    ))}
                                                </List>
                                            </div>
                                        </Stack>
                                    </Tabs.Panel>

                                    <Tabs.Panel value="courts" pt="md">
                                        <Stack>
                                            {Array.from({ length: venueData.courtCount }).map(
                                                (_, index) => (
                                                    <Paper key={index} p="md" radius="md" withBorder>
                                                        <Group justify="space-between">
                                                            <div>
                                                                <Text fw={500}>Court {index + 1}</Text>
                                                                <Text size="sm" c="dimmed">Professional Grade Court</Text>
                                                            </div>
                                                            <Group>
                                                                <Badge color="green">Available Now</Badge>
                                                                <Button
                                                                    variant="light"
                                                                    onClick={() => {
                                                                        setSelectedCourt(`Court ${index + 1}`);
                                                                        setBookingModalOpened(true);
                                                                    }}
                                                                >
                                                                    Book Now
                                                                </Button>
                                                            </Group>
                                                        </Group>
                                                    </Paper>
                                                ))}
                                        </Stack>
                                    </Tabs.Panel>

                                    <Tabs.Panel value="reviews" pt="md">
                                        <Stack>
                                            {/* Rating Overview */}
                                            <Paper p="md" radius="md" bg="blue.0">
                                                <Group>
                                                    <Center>
                                                        <Stack align="center" gap={0}>
                                                            <Text size="xl" fw={700}>{venueData.rating}</Text>
                                                            <Group>
                                                                {Array.from({ length: 5 }).map(
                                                                    (_, index) => (
                                                                        <IconStarFilled
                                                                            key={index}
                                                                            size={16}
                                                                            color={index < Math.floor(venueData.rating) ? 'gold' : 'gray'}
                                                                        />
                                                                    ))}
                                                            </Group>
                                                            <Text size="sm" c="dimmed">{venueData.totalReviews} reviews</Text>
                                                        </Stack>
                                                    </Center>
                                                    <Box style={{ flex: 1 }}>
                                                        {[5, 4, 3, 2, 1].map((rating) => (
                                                            <Group key={rating} gap="xs">
                                                                <Text size="sm" w={10}>{rating}</Text>
                                                                <Progress
                                                                    value={
                                                                        rating === 5
                                                                            ? 75
                                                                            : rating === 4
                                                                                ? 20
                                                                                : 5
                                                                    }
                                                                    size="sm"
                                                                    style={{ flex: 1 }}
                                                                />
                                                            </Group>
                                                        ))}
                                                    </Box>
                                                </Group>
                                            </Paper>

                                            {/* Review List */}
                                            {reviews.map((review) => (
                                                <Paper key={review.id} p="md" radius="md" withBorder>
                                                    <Stack>
                                                        <Group justify="space-between">
                                                            <Group>
                                                                <Avatar src={review.user.avatar} radius="xl" />
                                                                <div>
                                                                    <Text fw={500}>{review.user.name}</Text>
                                                                    <Text size="sm" c="dimmed">
                                                                        Played {review.user.playedCount} times here
                                                                    </Text>
                                                                </div>
                                                            </Group>
                                                            <Text size="sm" c="dimmed">{review.date}</Text>
                                                        </Group>

                                                        <Group>
                                                            {Array.from({ length: 5 }).map((_, index) => (
                                                                <IconStarFilled
                                                                    key={index}
                                                                    size={16}
                                                                    color={index < review.rating ? 'gold' : 'gray'}
                                                                />
                                                            ))}
                                                        </Group>

                                                        <div>
                                                            <Text fw={500}>{review.title}</Text>
                                                            <Text size="sm">{review.content}</Text>
                                                        </div>

                                                        <Group>
                                                            <Button
                                                                variant="subtle"
                                                                size="xs"
                                                                leftSection={<IconThumbUp size={14} />}
                                                            >
                                                                {review.likes}
                                                            </Button>
                                                            <Button
                                                                variant="subtle"
                                                                size="xs"
                                                                leftSection={<IconThumbDown size={14} />}
                                                            >
                                                                {review.dislikes}
                                                            </Button>
                                                        </Group>
                                                    </Stack>
                                                </Paper>
                                            ))}
                                        </Stack>
                                    </Tabs.Panel>
                                </Tabs>
                            </Card>
                        </Stack>
                    </Grid.Col>

                    {/* Sidebar */}
                    <Grid.Col span={{ base: 12, lg: 4 }}>
                        <Stack>
                            {/* Quick Info Card */}
                            <Card shadow="sm" radius="md" withBorder>
                                <Stack>
                                    <Group justify="space-between">
                                        <div>
                                            <Title order={2}>{venueData.name}</Title>
                                            <Group gap="xs">
                                                <IconMapPin size={14} />
                                                <Text size="sm">{venueData.location}</Text>
                                            </Group>
                                        </div>
                                        <Group>
                                            <ActionIcon variant="light" color="gray">
                                                <IconHeart size={18} />
                                            </ActionIcon>
                                            <ActionIcon variant="light" color="gray">
                                                <IconShare size={18} />
                                            </ActionIcon>
                                        </Group>
                                    </Group>

                                    <Group>
                                        <ThemeIcon size="lg" color="yellow" variant="light">
                                            <IconStarFilled size={20} />
                                        </ThemeIcon>
                                        <div>
                                            <Text fw={500}>{venueData.rating}</Text>
                                            <Text size="sm" c="dimmed">{venueData.totalReviews} reviews</Text>
                                        </div>
                                    </Group>

                                    <Paper p="sm" radius="md" bg="gray.0">
                                        <Stack gap="xs">
                                            <Group>
                                                <IconClock size={16} />
                                                <Text size="sm">{venueData.openHours}</Text>
                                            </Group>
                                            <Group>
                                                <IconMapPin size={16} />
                                                <Text size="sm">{venueData.fullAddress}</Text>
                                            </Group>
                                        </Stack>
                                    </Paper>

                                    <Button
                                        variant="light"
                                        leftSection={<IconDirections size={16} />}
                                        fullWidth
                                    >
                                        Get Directions
                                    </Button>
                                </Stack>
                            </Card>

                            {/* Booking Card */}
                            <Card shadow="sm" radius="md" withBorder>
                                <Stack>
                                    <Title order={3}>Book a Court</Title>
                                    <Select
                                        label="Select Court"
                                        placeholder="Choose a court"
                                        data={Array.from({ length: venueData.courtCount }).map((_, i) => ({
                                            value: `court-${i + 1}`,
                                            label: `Court ${i + 1}`,
                                        }))}
                                        value={selectedCourt}
                                        onChange={setSelectedCourt}
                                    />
                                    <Select
                                        label="Select Time"
                                        placeholder="Choose time slot"
                                        data={timeSlots.map(time => ({
                                            value: time,
                                            label: time,
                                        }))}
                                        value={selectedTime}
                                        onChange={setSelectedTime}
                                    />
                                    <Text fw={500}>Price: {venueData.priceRange}</Text>
                                    <Button
                                        fullWidth
                                        disabled={!selectedCourt || !selectedTime}
                                        leftSection={<IconCalendar size={16} />}
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

                            {/* Operating Hours Card */}
                            <Card shadow="sm" radius="md" withBorder>
                                <Stack>
                                    <Title order={3}>Operating Hours</Title>
                                    <Table>
                                        <Table.Tbody>
                                            {[
                                                { day: 'Monday - Friday', hours: '06:00 - 22:00' },
                                                { day: 'Saturday', hours: '07:00 - 22:00' },
                                                { day: 'Sunday', hours: '07:00 - 21:00' },
                                            ].map((schedule) => (
                                                <Table.Tr key={schedule.day}>
                                                    <Table.Td>
                                                        <Text size="sm">{schedule.day}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm" fw={500}>{schedule.hours}</Text>
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </Stack>
                            </Card>

                            {/* Peak Hours Notice */}
                            <Card shadow="sm" radius="md" withBorder>
                                <Stack>
                                    <Title order={3}>Peak Hours</Title>
                                    <Paper p="sm" radius="md" bg="blue.0">
                                        <Stack gap="xs">
                                            <Group>
                                                <Badge color="red">Peak</Badge>
                                                <Text size="sm">18:00 - 21:00 (฿400/hour)</Text>
                                            </Group>
                                            <Group>
                                                <Badge color="yellow">Regular</Badge>
                                                <Text size="sm">09:00 - 18:00 (฿300/hour)</Text>
                                            </Group>
                                            <Group>
                                                <Badge color="green">Off-Peak</Badge>
                                                <Text size="sm">06:00 - 09:00 (฿200/hour)</Text>
                                            </Group>
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </Card>

                            {/* Contact Card */}
                            <Card shadow="sm" radius="md" withBorder>
                                <Stack>
                                    <Title order={3}>Contact</Title>
                                    <List spacing="xs">
                                        <List.Item>
                                            <Text size="sm">Phone: 02-123-4567</Text>
                                        </List.Item>
                                        <List.Item>
                                            <Text size="sm">Line: @sportscomplexA</Text>
                                        </List.Item>
                                        <List.Item>
                                            <Text size="sm">Email: info@sportscomplexA.com</Text>
                                        </List.Item>
                                    </List>
                                    <Button variant="light" fullWidth>
                                        Contact Venue
                                    </Button>
                                </Stack>
                            </Card>
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
                            <Button variant="light" onClick={() => setBookingModalOpened(false)}>
                                Cancel
                            </Button>
                            <Button>
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
