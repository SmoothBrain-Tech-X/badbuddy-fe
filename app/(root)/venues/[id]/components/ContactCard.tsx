import React from 'react';
import { Card, Stack, Title, List, Text, Button, Group } from '@mantine/core';
import { IconPhone, IconMail, IconMapPin } from '@tabler/icons-react';

interface ContactCardProps {
    venue: {
        phone: string;
        email: string;
        address: string;
        location: string;
    };
    onContact?: () => void;
}

const ContactCard = ({ venue, onContact }: ContactCardProps) => (
    <Card radius="md" >
        <Stack>
            <Title order={3}>Contact</Title>
            <List spacing="md">
                <List.Item icon={
                    <IconPhone
                        size={18}
                        stroke={1.5}
                        className="text-gray-500"
                    />
                }>
                    <Text size="sm" component="a" href={`tel:${venue.phone}`}>
                        {venue.phone}
                    </Text>
                </List.Item>
                <List.Item icon={
                    <IconMail
                        size={18}
                        stroke={1.5}
                        className="text-gray-500"
                    />
                }>
                    <Text size="sm" component="a" href={`mailto:${venue.email}`}>
                        {venue.email}
                    </Text>
                </List.Item>
                <List.Item icon={
                    <IconMapPin
                        size={18}
                        stroke={1.5}
                        className="text-gray-500"
                    />
                }>
                    <Stack gap={4}>
                        <Text size="sm">{venue.address}</Text>
                        <Text size="sm" c="dimmed">{venue.location}</Text>
                    </Stack>
                </List.Item>
            </List>
            <Group grow>
                <Button
                    variant="light"
                    component="a"
                    href={`tel:${venue.phone}`}
                    leftSection={<IconPhone size={16} stroke={1.5} />}
                >
                    Call Now
                </Button>
                {onContact && (
                    <Button
                        variant="filled"
                        onClick={onContact}
                        leftSection={<IconMail size={16} stroke={1.5} />}
                    >
                        Contact Venue
                    </Button>
                )}
            </Group>
        </Stack>
    </Card>
);

export default ContactCard; 