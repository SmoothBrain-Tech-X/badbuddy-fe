import React, { useState, useMemo, useEffect } from 'react';
import {
    Drawer,
    Group,
    Stack,
    Title,
    Text,
    Button,
    Select,
    Paper,
    List,
    Alert,
    LoadingOverlay,
    Image,
    Badge,
    Radio,
    RadioGroup
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { IconX, IconCalendar, IconAlertCircle, IconClock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { bookingService, OpenRange, Venue, BookingConflictTimeSlot, CreateBookingResponseDTO } from '@/services';
import { toast } from 'react-hot-toast';


interface Court {
    id: string;
    name: string;
    description: string;
    price_per_hour: number;
    status: string;
}

interface BookingDrawerProps {
    opened: boolean;
    onClose: () => void;
    venueData: Venue;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const BookingDrawer: React.FC<BookingDrawerProps> = ({
    opened,
    onClose,
    venueData,
}) => {
    const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [conflicts, setConflicts] = useState<BookingConflictTimeSlot[]>([]);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    const selectedCourtDetails = useMemo(() => {
        return venueData.courts.find(court => court.id === selectedCourt);
    }, [selectedCourt, venueData.courts]);

    // Format date for API
    const formatDateForApi = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    // Check availability when all booking inputs are filled
    useEffect(() => {
        const checkAvailability = async () => {
            if (!selectedCourt || !selectedDate || !startTime || !endTime) {
                setConflicts([]);
                return;
            }

            setCheckingAvailability(true);
            try {
                const response = await bookingService.checkAvailability({
                    court_id: selectedCourt,
                    date: formatDateForApi(selectedDate),
                    start_time: startTime.trim(),
                    end_time: endTime.trim()
                });

                if (!response.data.available && response.data.conflicts) {
                    setConflicts(response.data.conflicts);

                    // Show notification for conflicts
                    notifications.show({
                        title: 'Booking Conflict',
                        message: `This court is already booked during the following times: ${response.data.conflicts
                            .map(conflict => `${conflict.start_time}-${conflict.end_time}`)
                            .join(', ')}`,
                        color: 'orange',
                    });
                } else {
                    setConflicts([]);
                }
            } catch (err) {
                console.error('Error checking availability:', err);
                notifications.show({
                    title: 'Error',
                    message: 'Failed to check court availability',
                    color: 'red',
                });
            } finally {
                setCheckingAvailability(false);
            }
        };

        const timeoutId = setTimeout(checkAvailability, 500); // Debounce check
        return () => clearTimeout(timeoutId);
    }, [selectedCourt, selectedDate, startTime, endTime]);



    const getOpeningHours = (date: Date) => {
        const dayName = DAYS_OF_WEEK[date.getDay()];
        return venueData.open_range.find(range => range.day === dayName);
    };

    // Fixed time formatting function
    const formatTimeFromAPI = (timeString: string) => {
        try {
            const match = timeString.match(/T(\d{2}:\d{2})/);
            return match ? match[1] : 'Invalid time';
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'Invalid time';
        }
    };

    // Fixed duration calculation
    const calculateDuration = (): number => {
        if (!startTime || !endTime) return 0;

        try {
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);

            const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
            return duration > 0 ? duration : 0;
        } catch (error) {
            console.error('Error calculating duration:', error);
            return 0;
        }
    };

    // Fixed price calculation
    const calculatePrice = (): number => {
        const duration = calculateDuration();
        if (duration <= 0 || !selectedCourtDetails?.price_per_hour) return 0;
        return duration * selectedCourtDetails.price_per_hour;
    };
    const formatTime = (timeString: string) => {
        try {
            const match = timeString.match(/T(\d{2}:\d{2})/);
            return match ? match[1] : 'Invalid time';
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'Invalid time';
        }
    };

    // Update the validateTimeAgainstOpeningHours function
    const validateTimeAgainstOpeningHours = (): boolean => {
        if (!selectedDate) return false;

        const openingHours = getOpeningHours(selectedDate);
        if (!openingHours || !openingHours.is_open) return false;

        try {
            const convertTimeToMinutes = (timeStr: string) => {
                const [hours, minutes] = timeStr.trim().split(':').map(Number);
                return hours * 60 + minutes;
            };

            const openTime = formatTime(openingHours.open_time);
            const closeTime = formatTime(openingHours.close_time);

            const openMinutes = convertTimeToMinutes(openTime);
            const closeMinutes = convertTimeToMinutes(closeTime);
            const startMinutes = convertTimeToMinutes(startTime);
            const endMinutes = convertTimeToMinutes(endTime);

            // Log for debugging
            console.log({
                openTime,
                closeTime,
                startTime,
                endTime,
                openMinutes,
                closeMinutes,
                startMinutes,
                endMinutes
            });

            return startMinutes >= openMinutes && endMinutes <= closeMinutes;
        } catch (error) {
            console.error('Error validating time:', error);
            return false;
        }
    };

    const handleBookNow = async () => {
        if (!selectedCourt || !selectedDate || !startTime || !endTime) {
            setError('Please fill in all required fields');
            return;
        }

        if (calculateDuration() <= 0) {
            setError('Invalid time range selected');
            return;
        }

        if (!validateTimeAgainstOpeningHours()) {
            setError('Selected time is outside of venue opening hours');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const dateStr = "11/9/2024";
            const [month, day, year] = dateStr.split('/');

            const bookingResponse: CreateBookingResponseDTO = await bookingService.createBooking({
                court_id: selectedCourt,
                date: formatDateForApi(selectedDate),
                start_time: startTime.trim(),
                end_time: endTime.trim(),
            })
            if (!bookingResponse.data) {
                throw new Error('Failed to create booking');
            }

            const paymentResponse = await bookingService.createPayment(
                bookingResponse.data.id,
                {
                    payment_method: 'cash',
                    amount: calculatePrice(),
                    transaction_id: `BOOK${Date.now()}`,
                })

            notifications.show({
                title: 'Booking Successful',
                message: 'Your court has been booked successfully!',
                color: 'green',
            });

            onClose();
            setSelectedCourt(null);
            setSelectedDate(null);
            setStartTime('');
            setEndTime('');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            notifications.show({
                title: 'Booking Failed',
                message: errorMessage,
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            position="right"
            size="md"
            title={
                <Group justify="space-between" w="100%">
                    <Title order={3}>Book a Court</Title>
                </Group>
            }
        >
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} />

            <Stack p="md" gap="lg">
                <Stack gap="md">
                    <Select
                        label="Select Court"
                        placeholder="Choose a court"
                        data={venueData.courts.map(court => ({
                            value: court.id,
                            label: `${court.name} - ฿${court.price_per_hour}/hour`,
                            disabled: court.status === 'occupied'
                        }))}
                        value={selectedCourt}
                        onChange={(value) => setSelectedCourt(value)}
                    />

                    <DatePickerInput
                        label="Select Date"
                        placeholder="Pick a date"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        clearable
                    />

                    <Group grow>
                        <TimeInput
                            label="Start Time"
                            placeholder="Select start time"
                            value={startTime}
                            onChange={(event) => setStartTime(event.currentTarget.value)}
                            leftSection={<IconClock size={16} />}
                        />
                        <TimeInput
                            label="End Time"
                            placeholder="Select end time"
                            value={endTime}
                            onChange={(event) => setEndTime(event.currentTarget.value)}
                            leftSection={<IconClock size={16} />}
                            error={startTime && endTime && calculateDuration() <= 0 ? 'End time must be after start time' : ''}
                        />
                    </Group>
                </Stack>

                {selectedDate && (
                    <Paper p="md" radius="md" withBorder>
                        <Text size="sm" c="dimmed" mb="xs">Opening Hours for {DAYS_OF_WEEK[selectedDate.getDay()]}</Text>
                        {getOpeningHours(selectedDate)?.is_open ? (
                            <Text>
                                {formatTimeFromAPI(getOpeningHours(selectedDate)!.open_time)} - {formatTimeFromAPI(getOpeningHours(selectedDate)!.close_time)}
                            </Text>
                        ) : (
                            <Text c="red">Closed</Text>
                        )}
                    </Paper>
                )}

                <Paper p="md" radius="md" withBorder>
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text fw={500}>Date</Text>
                            <Text>{selectedDate ? selectedDate.toLocaleDateString() : '-'}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text fw={500}>Time</Text>
                            <Text>{startTime && endTime ? `${startTime} - ${endTime}` : '-'}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text fw={500}>Duration</Text>
                            <Text>{calculateDuration() > 0 ? `${calculateDuration()} hours` : '-'}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text fw={500}>Price</Text>
                            <Text fw={500} size="lg">฿{calculatePrice().toFixed(2)}</Text>
                        </Group>
                    </Stack>
                </Paper>
                {conflicts.length > 0 && (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Booking Conflicts"
                        color="orange"
                        variant="light"
                    >
                        <Text mb="xs">This court is already booked during:</Text>
                        <List size="sm">
                            {conflicts.map((conflict, index) => (
                                <List.Item key={index}>
                                    {conflict.start_time} - {conflict.end_time}
                                    <Badge ml="xs" color="blue" size="sm">
                                        {conflict.status}
                                    </Badge>
                                </List.Item>
                            ))}
                        </List>
                    </Alert>
                )}


                {error && (
                    <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="light">
                        {error}
                    </Alert>
                )}

                <Button
                    fullWidth
                    size="lg"
                    disabled={!selectedCourt || !selectedDate || !startTime || !endTime || calculateDuration() <= 0 || conflicts.length > 0 || loading}
                    loading={loading}
                    leftSection={<IconCalendar size={16} />}
                    onClick={handleBookNow}
                >
                    Confirm Booking
                </Button>
            </Stack>
        </Drawer>
    );
};

export default BookingDrawer;
