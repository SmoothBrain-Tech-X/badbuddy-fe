import React from 'react';
import { Paper, Group, Text } from '@mantine/core';
import { IconCreditCard } from '@tabler/icons-react';
interface FeeCardProps {
    price: string;
}

const FeeCard: React.FC<FeeCardProps> = ({ price }) => (
    <Paper p="md" radius="md" withBorder className="bg-gradient-to-br from-green-50 to-white">
        <Group justify="space-between" mb="xs">
            <Group gap="xs">
                <IconCreditCard size={20} className="text-green-600" />
                <Text fw={500}>Fee</Text>
            </Group>
            <Text fw={600} className="text-green-700">{price}</Text>
        </Group>
        <Text size="sm" c="dimmed">Pay at the venue</Text>
    </Paper>
);


export default FeeCard;