import React from 'react';
import { Paper, Group, Text, List, ThemeIcon } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';



const SafetyGuidelines: React.FC = () => (
    <Paper p="md" radius="md" bg="orange.0" withBorder>
        <Group align="flex-start">
            <ThemeIcon color="orange" variant="light" size="lg">
                <IconAlertCircle size={20} />
            </ThemeIcon>
            <div>
                <Text fw={500} c="orange.8" mb="xs">Safety Guidelines</Text>
                <List spacing="xs" size="sm" c="dimmed" withPadding>
                    <List.Item>Chat with the host before joining</List.Item>
                    <List.Item>Pay only at the venue</List.Item>
                    <List.Item>Follow venue rules and guidelines</List.Item>
                    <List.Item>Report any suspicious activity</List.Item>
                </List>
            </div>
        </Group>
    </Paper>
);

export default SafetyGuidelines;    