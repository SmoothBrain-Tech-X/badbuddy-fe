// import React from 'react';
// import { VenueData } from '@/types';
// import { Card, Stack, Title, Select, Button, Paper, Group, Text, ThemeIcon } from '@mantine/core';
// import { IconCalendar, IconAlertCircle } from '@tabler/icons-react';



// const BookingCard = ({
//     venueData,
//     selectedCourt,
//     selectedTime,
//     onCourtSelect,
//     onTimeSelect,
//     onBookNow,
// }: {
//     venueData: VenueData;
//     selectedCourt: string | null;
//     selectedTime: string | null;
//     onCourtSelect: (court: string | null) => void;
//     onTimeSelect: (time: string | null) => void;
//     onBookNow: () => void;
// }) => (
//     <Card shadow="sm" radius="md" withBorder>
//         <Stack>
//             <Title order={3}>Book a Court</Title>
//             <Select
//                 label="Select Court"
//                 placeholder="Choose a court"
//                 data={Array.from({ length: venueData.courtCount }).map((_, i) => ({
//                     value: `Court ${i + 1}`,
//                     label: `Court ${i + 1}`,
//                 }))}
//                 value={selectedCourt}
//                 onChange={onCourtSelect}
//             />
//             <Select
//                 label="Select Time"
//                 placeholder="Choose time slot"
//                 data={timeSlots.map(time => ({
//                     value: time,
//                     label: time,
//                 }))}
//                 value={selectedTime}
//                 onChange={onTimeSelect}
//             />
//             <Text fw={500}>Price: {venueData.priceRange}</Text>
//             <Button
//                 fullWidth
//                 disabled={!selectedCourt || !selectedTime}
//                 leftSection={<IconCalendar size={16} />}
//                 onClick={onBookNow}
//             >
//                 Book Now
//             </Button>

//             <Paper p="sm" radius="md" bg="orange.0">
//                 <Group align="flex-start">
//                     <ThemeIcon color="orange" variant="light">
//                         <IconAlertCircle size={16} />
//                     </ThemeIcon>
//                     <Text size="sm">
//                         Booking requires a 50% deposit. Cancellation is free up to 24 hours before the booking time.
//                     </Text>
//                 </Group>
//             </Paper>
//         </Stack>
//     </Card>
// );
