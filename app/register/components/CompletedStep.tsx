import { Card, Stack, ThemeIcon, Title, Text, Button } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export const CompletedStep: React.FC = () => (
    <Card shadow="md" radius="md" className="p-4 sm:p-8 mt-6" withBorder>
        <Stack className="items-center space-y-3 sm:space-y-4">
            <ThemeIcon
                radius="md"
                color="green"
                className="w-16 h-16 sm:w-20 sm:h-20"
            >
                <IconCheck className="w-8 h-8 sm:w-10 sm:h-10" />
            </ThemeIcon>
            <Title className="text-xl sm:text-2xl text-center">Registration Complete!</Title>
            <Text className="text-gray-600 text-center text-sm sm:text-base">
                Welcome to the Badminton App community.
                You can now start exploring and joining games.
            </Text>
            <Button
                fullWidth
                className="mt-4 text-sm sm:text-base"
            >
                Start Playing
            </Button>
        </Stack>
    </Card>
);
