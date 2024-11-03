import { Card, Stack, ThemeIcon, Title, Text, Button } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

interface CompletedStepProps {
    onStart: () => void;
}

export const CompletedStep: React.FC<CompletedStepProps> = ({ onStart }) => (
    <Card shadow="md" radius="md" p="xl" mt="md" withBorder>
        <Stack align="center">
            <ThemeIcon
                radius="md"
                color="green"
                size={80}
            >
                <IconCheck size={40} />
            </ThemeIcon>
            <Title order={2} ta="center">Registration Complete!</Title>
            <Text c="dimmed" ta="center">
                Welcome to the Badminton community.
                You can now start exploring and joining games.
            </Text>
            <Button
                fullWidth
                size="md"
                onClick={onStart}
            >
                Start Playing
            </Button>
        </Stack>
    </Card>
);
