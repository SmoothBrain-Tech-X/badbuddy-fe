import React from 'react';
import { Stack, Paper, Group, Text, Badge, Button, Center } from '@mantine/core';
import { IconClipboardX } from '@tabler/icons-react';
import { Court } from '@/services';

interface CourtsTabProps {
    courts: Court[];
    onBookCourt: (courtId: string) => void;
}

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

const EmptyState = () => (
    <Paper p="xl" radius="md" withBorder>
        <Center>
            <Stack align="center">
                <IconClipboardX
                    size={64}
                    stroke={1.5}
                    color='gray'

                />
                <Stack align="center">
                    <Text size="xl" fw={500} c="dimmed">
                        No Courts Available
                    </Text>
                    <Text size="sm" c="dimmed" mt={4} maw={400}>
                        There are currently no courts listed for this venue.
                        Please check back later or contact the venue for more information.
                    </Text>
                </Stack>
            </Stack>
        </Center>
    </Paper>
);

const CourtsTab = ({ courts, onBookCourt }: CourtsTabProps) => (
    <Stack>
        {courts.length > 0 ? (
            courts.map((court) => (
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
                            <Text size="sm" c="dimmed">{court.description}</Text>
                            <Text size="sm" mt={4} fw={500} c="blue.6">
                                ฿{court.price_per_hour.toLocaleString()} / hour
                            </Text>
                        </div>
                        <Group>
                            <Badge
                                color={getStatusColor(court.status)}
                                variant="light"
                                size="lg"
                            >
                                {getStatusText(court.status)}
                            </Badge>
                            <Button
                                variant={court.status === 'available' ? 'filled' : 'light'}
                                onClick={() => onBookCourt(court.id)}
                                disabled={court.status !== 'available'}
                            >
                                Book Now
                            </Button>
                        </Group>
                    </Group>
                </Paper>
            ))
        ) : (
            <EmptyState />
        )}
    </Stack>
);

export default CourtsTab;