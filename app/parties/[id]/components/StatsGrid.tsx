import React from 'react';
import { Grid, Paper, Group, Text } from '@mantine/core';
import { IconEye, IconHeart } from '@tabler/icons-react';



interface StatsGridProps {
    views: number;
    likes: number;
}

// Components
const StatsGrid: React.FC<StatsGridProps> = ({ views, likes }) => (
    <Grid>
        <Grid.Col span={6}>
            <Paper p="md" radius="md" className="bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow" withBorder>
                <Group justify="center" gap="xs">
                    <IconEye size={20} className="text-blue-500" />
                    <Text fw={700} size="xl" className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {views}
                    </Text>
                </Group>
                <Text size="sm" c="dimmed" ta="center" mt={4}>Views</Text>
            </Paper>
        </Grid.Col>
        <Grid.Col span={6}>
            <Paper p="md" radius="md" className="bg-gradient-to-br from-pink-50 to-white hover:shadow-md transition-shadow" withBorder>
                <Group justify="center" gap="xs">
                    <IconHeart size={20} className="text-pink-500" />
                    <Text fw={700} size="xl" className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                        {likes}
                    </Text>
                </Group>
                <Text size="sm" c="dimmed" ta="center" mt={4}>Likes</Text>
            </Paper>
        </Grid.Col>
    </Grid>
);

export default StatsGrid;
