import React from 'react';
import { Card, Stack, Title, Table, Text, Badge, Group } from '@mantine/core';
import { OpenRange } from '@/services';

interface OperatingHoursCardProps {
    openRange: OpenRange[];
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
const OperatingHoursCard = ({ openRange }: OperatingHoursCardProps) => (
    <Card shadow="sm" radius="md" withBorder>
        <Stack>
            <Title order={3}>Operating Hours</Title>
            <Table>
                <Table.Tbody>
                    {openRange.map((schedule) => (
                        <Table.Tr key={schedule.day}>
                            <Table.Td>
                                <Text size="sm" fw={500}>{schedule.day}</Text>
                            </Table.Td>
                            <Table.Td>
                                {schedule.is_open ? (
                                    <Group gap="xs">
                                        <Text size="sm">
                                            {formatTime(schedule.open_time)} - {formatTime(schedule.close_time)}
                                        </Text>
                                        <Badge color="green" size="sm" variant="light">
                                            Open
                                        </Badge>
                                    </Group>
                                ) : (
                                    <Group gap="xs">
                                        <Badge color="red" size="sm" variant="light">
                                            Closed
                                        </Badge>
                                    </Group>
                                )}
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Stack>
    </Card >
);

export default OperatingHoursCard;