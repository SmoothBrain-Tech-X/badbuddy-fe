import React from 'react';
import { Stack, Paper, Group, Text, Progress, Grid, Button } from '@mantine/core';
import { IconMessageCircle, IconEye, IconHeart, IconUsers, IconCreditCard } from '@tabler/icons-react';


const ParticipantsProgress: React.FC<{
    current: number;
    max: number;
}> = ({ current, max }) => (
    <Paper p="md" radius="md" withBorder className="bg-gradient-to-br from-blue-50 to-white">
        <Group align="flex-start" mb="xs">
            <div className="flex-1">
                <Text fw={600} size="sm" className="text-gray-700 mb-1">Participants Status</Text>
                <Progress
                    value={(current / max) * 100}
                    mb="xs"
                    size="lg"
                    radius="xl"
                    color={current / max >= 0.8 ? 'orange' : 'blue'}
                    className="bg-blue-100 w-full"
                />
            </div>
            <Text fw={700} size="xl" className="text-blue-600">
                {current}/{max}
            </Text>
        </Group>
        <Group justify="space-between">
            <Group gap="xs">
                <IconUsers size={16} className="text-blue-500" />
                <Text size="sm" className="text-gray-600">
                    {max - current} spots left
                </Text>
            </Group>
            {current / max >= 0.8 && (
                <Text size="sm" className="text-orange-500 font-medium">
                    Almost full!
                </Text>
            )}
        </Group>
    </Paper>
);

export default ParticipantsProgress;