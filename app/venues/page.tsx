'use client';

import { useState } from 'react';
import {
    Container, Grid, Card, Group, Text, Badge,
    Button, TextInput, Stack, Box, ThemeIcon,
    Paper, Title, ActionIcon, Image, Select,
    RangeSlider, Checkbox, Collapse, rem,
} from '@mantine/core';
import {
    IconMapPin, IconSearch, IconAdjustments,
    IconStarFilled, IconClock, IconParking,
    IconShoe, IconAirConditioning, IconWifi,
    IconChevronDown, IconChevronUp, IconProps,
} from '@tabler/icons-react';

// Types
interface Venue {
    id: string;
    name: string;
    image: string;
    location: string;
    rating: number;
    totalReviews: number;
    priceRange: string;
    courtCount: number;
    facilities: string[];
    openHours: string;
    distance: string;
}

interface FacilityOption {
    icon: React.FC<IconProps>;
    label: string;
}

interface District {
    value: string;
    label: string;
}

// Constants
const DISTRICTS: District[] = [
    { value: 'chatuchak', label: 'Chatuchak' },
    { value: 'ladprao', label: 'Ladprao' },
    { value: 'bangkapi', label: 'Bangkapi' },
];

const FACILITIES_OPTIONS: FacilityOption[] = [
    { icon: IconParking, label: 'Parking' },
    { icon: IconShoe, label: 'Shower' },
    { icon: IconAirConditioning, label: 'Air Conditioning' },
    { icon: IconWifi, label: 'WiFi' },
];

const FACILITY_ICONS: Record<string, React.FC<IconProps>> = {
    Parking: IconParking,
    Shower: IconShoe,
    'Air Conditioning': IconAirConditioning,
    WiFi: IconWifi,
};

// Components
const FacilityIcon: React.FC<{ facility: string }> = ({ facility }) => {
    const Icon = FACILITY_ICONS[facility];
    return Icon ? <Icon size={16} /> : null;
};

const SearchSection: React.FC<{
    search: string;
    onSearchChange: (value: string) => void;
    selectedDistrict: string | null;
    onDistrictChange: (value: string | null) => void;
    filtersVisible: boolean;
    onToggleFilters: () => void;
}> = ({
    search,
    onSearchChange,
    selectedDistrict,
    onDistrictChange,
    filtersVisible,
    onToggleFilters,
}) => (
        <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 8 }}>
                <TextInput
                    placeholder="Search venues..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    leftSection={<IconSearch size={16} />}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Group grow>
                    <Select
                        placeholder="Select district"
                        data={DISTRICTS}
                        value={selectedDistrict}
                        onChange={onDistrictChange}
                        leftSection={<IconMapPin size={16} />}
                    />
                    <Button
                        variant="light"
                        leftSection={<IconAdjustments size={16} />}
                        onClick={onToggleFilters}
                        rightSection={
                            filtersVisible ? (
                                <IconChevronUp size={16} />
                            ) : (
                                <IconChevronDown size={16} />
                            )
                        }
                    >
                        Filters
                    </Button>
                </Group>
            </Grid.Col>
        </Grid>
    );

const FilterSection: React.FC<{
    visible: boolean;
    priceRange: [number, number];
    onPriceRangeChange: (value: [number, number]) => void;
    selectedFacilities: string[];
    onFacilitiesChange: (facilities: string[]) => void;
}> = ({
    visible,
    priceRange,
    onPriceRangeChange,
    selectedFacilities,
    onFacilitiesChange,
}) => (
        <Collapse in={visible}>
            <Paper p="md" radius="md" bg="gray.0" mt="xs">
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text fw={500} mb="xs">Price Range (per hour)</Text>
                        <RangeSlider
                            min={0}
                            max={1000}
                            step={50}
                            value={priceRange}
                            onChange={onPriceRangeChange}
                            marks={[
                                { value: 0, label: '฿0' },
                                { value: 500, label: '฿500' },
                                { value: 1000, label: '฿1000' },
                            ]}
                            styles={{
                                mark: { fontSize: rem(12) },
                                markLabel: { fontSize: rem(12) },
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text fw={500} mb="xs">Facilities</Text>
                        <Group>
                            {FACILITIES_OPTIONS.map((facility) => (
                                <Checkbox
                                    key={facility.label}
                                    label={facility.label}
                                    checked={selectedFacilities.includes(facility.label)}
                                    onChange={(e) => {
                                        const newFacilities = e.currentTarget.checked
                                            ? [...selectedFacilities, facility.label]
                                            : selectedFacilities.filter(f => f !== facility.label);
                                        onFacilitiesChange(newFacilities);
                                    }}
                                />
                            ))}
                        </Group>
                    </Grid.Col>
                </Grid>
            </Paper>
        </Collapse>
    );

const ActiveFilters: React.FC<{
    selectedDistrict: string | null;
    selectedFacilities: string[];
    onClearDistrict: () => void;
    onClearFacility: (facility: string) => void;
    onClearAll: () => void;
}> = ({
    selectedDistrict,
    selectedFacilities,
    onClearDistrict,
    onClearFacility,
    onClearAll,
}) => {
        if (!selectedDistrict && selectedFacilities.length === 0) return null;

        return (
            <Group mb="xl">
                <Text size="sm" fw={500}>Active Filters:</Text>
                {selectedDistrict && (
                    <Badge
                        variant="light"
                        rightSection={
                            <ActionIcon
                                variant="transparent"
                                size="sm"
                                onClick={onClearDistrict}
                            >
                                ×
                            </ActionIcon>
                        }
                    >
                        {DISTRICTS.find(d => d.value === selectedDistrict)?.label}
                    </Badge>
                )}
                {selectedFacilities.map((facility) => (
                    <Badge
                        key={facility}
                        variant="light"
                        rightSection={
                            <ActionIcon
                                variant="transparent"
                                size="sm"
                                onClick={() => onClearFacility(facility)}
                            >
                                ×
                            </ActionIcon>
                        }
                    >
                        {facility}
                    </Badge>
                ))}
                <Button
                    variant="subtle"
                    size="xs"
                    onClick={onClearAll}
                >
                    Clear All
                </Button>
            </Group>
        );
    };

const VenueCard: React.FC<{ venue: Venue }> = ({ venue }) => (
    <Card
        shadow="sm"
        radius="md"
        withBorder
        style={{
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 'var(--mantine-shadow-md)',
            },
        }}
    >
        <Card.Section>
            <Image
                src={venue.image}
                height={200}
                alt={venue.name}
            />
        </Card.Section>

        <Stack mt="md">
            <Group justify="space-between">
                <div>
                    <Text fw={500} size="lg">{venue.name}</Text>
                    <Group gap="xs">
                        <IconMapPin size={14} style={{ color: 'var(--mantine-color-blue-6)' }} />
                        <Text size="sm" c="dimmed">{venue.location}</Text>
                        <Text size="sm" c="dimmed">•</Text>
                        <Text size="sm" c="dimmed">{venue.distance}</Text>
                    </Group>
                </div>
                <Badge color="blue">{venue.courtCount} Courts</Badge>
            </Group>

            <Group>
                <ThemeIcon size="sm" color="yellow" variant="filled">
                    <IconStarFilled size={12} />
                </ThemeIcon>
                <Text fw={500}>{venue.rating}</Text>
                <Text size="sm" c="dimmed">({venue.totalReviews} reviews)</Text>
            </Group>

            <Paper p="xs" radius="md" bg="gray.0">
                <Group>
                    <IconClock size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />
                    <Text size="sm">{venue.openHours}</Text>
                </Group>
            </Paper>

            <Group gap="xs">
                {venue.facilities.map((facility) => (
                    <ThemeIcon
                        key={facility}
                        size="sm"
                        variant="light"
                        radius="xl"
                        title={facility}
                        style={{
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        <FacilityIcon facility={facility} />
                    </ThemeIcon>
                ))}
            </Group>

            <Group justify="space-between" mt="xs">
                <Text fw={500} c="blue">
                    {venue.priceRange}
                </Text>
                <Button
                    variant="light"
                    style={{
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                        },
                    }}
                >
                    View Details
                </Button>
            </Group>
        </Stack>
    </Card>
);

// Main Component
const VenueListPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

    // Mock data
    const venues: Venue[] = [
        {
            id: '1',
            name: 'Sports Complex A',
            image: 'https://images.unsplash.com/photo-1721760886713-1ab0c5045bf7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            location: 'Chatuchak, Bangkok',
            rating: 4.5,
            totalReviews: 128,
            priceRange: '฿200-400/hour',
            courtCount: 6,
            facilities: ['Parking', 'Shower', 'Air Conditioning', 'WiFi'],
            openHours: '06:00 - 22:00',
            distance: '2.5 km',
        },
        {
            id: '2',
            name: 'Central Stadium',
            image: 'https://images.unsplash.com/photo-1721760886713-1ab0c5045bf7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            location: 'Ladprao, Bangkok',
            rating: 4.2,
            totalReviews: 95,
            priceRange: '฿150-300/hour',
            courtCount: 4,
            facilities: ['Parking', 'Shower', 'WiFi'],
            openHours: '07:00 - 21:00',
            distance: '3.8 km',
        },
    ];
    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="xl" py="xl">
                {/* Header */}
                <Stack mb="xl" align="center">
                    <Title
                        style={{
                            fontSize: rem(36),
                            background: 'linear-gradient(45deg, var(--mantine-color-blue-6), var(--mantine-color-indigo-5))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Find Badminton Courts
                    </Title>
                    <Text size="lg" c="dimmed" ta="center">
                        Discover and book the best courts near you
                    </Text>
                </Stack>

                {/* Search and Filters */}
                <Paper shadow="sm" p="md" radius="md" mb="xl">
                    <Stack>
                        <SearchSection
                            search={search}
                            onSearchChange={setSearch}
                            selectedDistrict={selectedDistrict}
                            onDistrictChange={setSelectedDistrict}
                            filtersVisible={filtersVisible}
                            onToggleFilters={() => setFiltersVisible(!filtersVisible)}
                        />
                        <FilterSection
                            visible={filtersVisible}
                            priceRange={priceRange}
                            onPriceRangeChange={setPriceRange}
                            selectedFacilities={selectedFacilities}
                            onFacilitiesChange={setSelectedFacilities}
                        />
                    </Stack>
                </Paper>

                {/* Active Filters */}
                <ActiveFilters
                    selectedDistrict={selectedDistrict}
                    selectedFacilities={selectedFacilities}
                    onClearDistrict={() => setSelectedDistrict(null)}
                    onClearFacility={(facility) =>
                        setSelectedFacilities(prev => prev.filter(f => f !== facility))
                    }
                    onClearAll={() => {
                        setSelectedDistrict(null);
                        setSelectedFacilities([]);
                    }}
                />

                {/* Venues Grid */}
                <Grid>
                    {venues.map((venue) => (
                        <Grid.Col key={venue.id} span={{ base: 12, md: 6, lg: 4 }}>
                            <VenueCard venue={venue} />
                        </Grid.Col>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default VenueListPage;
