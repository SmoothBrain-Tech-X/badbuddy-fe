import { Box, Container, Grid, Stack, Text, Title, Group, Button } from '@mantine/core';
import { IconCalendarEvent, IconMapPin } from '@tabler/icons-react';

export const HeroSection = () => (
    <Box bg="blue.6" c="white" py={48}>
        <Container size="xl">
            <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="lg">
                        <div>
                            <Text size="xl" fw={500}>Welcome back,</Text>
                            <Title order={1}>Sarawut Inpol</Title>
                        </div>
                        <Text size="lg">
                            Ready for your next badminton session?
                            Find players, book courts, and join matches near you.
                        </Text>
                        <Group>
                            <Button
                                variant="white"
                                color="blue"
                                leftSection={<IconCalendarEvent size={16} />}
                                size="lg"
                            >
                                Create Party
                            </Button>
                            <Button
                                variant="white"
                                color="blue"
                                leftSection={<IconMapPin size={16} />}
                                size="lg"
                            >
                                Find Venues
                            </Button>
                        </Group>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Container>
    </Box>
);
