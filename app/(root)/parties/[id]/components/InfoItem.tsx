import React from 'react';
import { Paper, Group, Text, ThemeIcon, rem } from '@mantine/core';
import { IconProps } from '@tabler/icons-react';

const InfoItem: React.FC<{
    icon: React.ComponentType<IconProps>;
    label: string;
    value: string;
}> = ({ icon: Icon, label, value }) => (
    <Paper p="md" radius="md" withBorder>
        <Group>
            <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                <Icon size={rem(20)} />
            </ThemeIcon>
            <div>
                <Text size="sm" c="dimmed">{label}</Text>
                <Text fw={500}>{value}</Text>
            </div>
        </Group>
    </Paper>
);

export default InfoItem;