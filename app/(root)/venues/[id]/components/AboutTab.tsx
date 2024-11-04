import React from "react";
import { Stack, Text, SimpleGrid, Paper, Group, ThemeIcon, List } from "@mantine/core";
import { IconParking, IconShoe, IconAirConditioning, IconWifi } from '@tabler/icons-react';
import { Venue } from "@/services";

const FacilityIcon = ({ facility }: { facility: string }) => {
    const facilityMap = {
        Parking: IconParking,
        Shower: IconShoe,
        'Air Conditioning': IconAirConditioning,
        WiFi: IconWifi,
    };
    const Icon = facilityMap[facility as keyof typeof facilityMap];
    return Icon ? <Icon size={20} /> : null;
};

const AboutTab = ({ venueData, facilities }: {
    venueData: Venue, facilities: string[]

}) => (
    <Stack>
        <Text>{venueData.description}</Text>
        <div>
            {facilities.length > 0 && (
                <Text fw={500} size="lg" mb="xs">Facilities</Text>
            )}
            <SimpleGrid cols={{ base: 2, sm: 4 }}>
                {facilities.map((facility) => (
                    <Paper key={facility} p="md" radius="md" withBorder>
                        <Group>
                            <ThemeIcon variant="light" size="lg" color="blue">
                                <FacilityIcon facility={facility} />
                            </ThemeIcon>
                            <Text size="sm">{facility}</Text>
                        </Group>
                    </Paper>
                ))}
            </SimpleGrid>
        </div>
        {/* <div>
            <Text fw={500} size="lg" mb="xs">Rules & Guidelines</Text>
            <List withPadding>
                {venueData.rules.map((rule, index) => (
                    <List.Item key={index}>{rule}</List.Item>
                ))}
            </List>
        </div> */}
    </Stack>
);

export default AboutTab;