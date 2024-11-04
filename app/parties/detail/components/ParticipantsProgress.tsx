import React from 'react';
import { Paper, Group, Text, Progress } from '@mantine/core';


const ParticipantsProgress: React.FC<{
    current: number;
    max: number;
}> = ({ current, max }) => (
    <Paper p="md" radius="md" withBorder>
        <Text fw={500} mb="xs">Participants Status</Text>
        <Progress
            value={(current / max) * 100}
            mb="xs"
            size="md"
            radius="xl"
            color={current / max >= 0.8 ? 'orange' : 'blue'}
        />
        <Group justify="space-between" mb="xs">
            <Text size="sm">
                {max - current} spots left
            </Text>
            <Text size="sm" fw={500}>
                {current}/{max}
            </Text>
        </Group>
    </Paper>
);

export default ParticipantsProgress;