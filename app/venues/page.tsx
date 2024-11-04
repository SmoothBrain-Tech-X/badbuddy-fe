'use client';

import { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';

// =============== Types ===============
interface BaseVenue {
    id: string;
    name: string;
    location: string;
    facilities: string[];
}

interface Venue extends BaseVenue {
    image: string;
    rating: number;
    totalReviews: number;
    priceRange: string;
    courtCount: number;
    openHours: string;
    distance: string;
}

interface ApiVenue extends BaseVenue {
    description: string;
    address: string;
    phone: string;
    email: string;
    open_time: string;
    close_time: string;
    image_urls: string;
    rating?: number;
    total_reviews?: number;
    price_range?: string;
    court_count?: number;
    distance?: string;
}

// =============== Constants ===============
const DISTRICTS = [
    { value: 'chatuchak', label: 'Chatuchak' },
    { value: 'ladprao', label: 'Ladprao' },
    { value: 'bangkapi', label: 'Bangkapi' },
];

const FACILITIES_OPTIONS = [
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

// =============== API Service ===============
const venueService = {
    searchVenues: async (params: {
        search?: string;
        location?: string;
        facilities?: string[];
        minPrice?: number;
        maxPrice?: number;
        page: number;
        limit: number;
    }) => {
        const queryParams = new URLSearchParams({
            limit: params.limit.toString(),
            offset: ((params.page - 1) * params.limit).toString(),
        });

        if (params.search) queryParams.append('q', params.search);
        if (params.location) queryParams.append('location', params.location);
        if (params.facilities?.length) {
            queryParams.append('facilities', params.facilities.join(','));
        }
        if (params.minPrice !== undefined) {
            queryParams.append('min_price', params.minPrice.toString());
        }
        if (params.maxPrice !== undefined) {
            queryParams.append('max_price', params.maxPrice.toString());
        }

        const response = await fetch(`http://localhost:8004/api/venues/search?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch venues');
        return response.json();
    },

    transformVenue: (apiVenue: ApiVenue): Venue => ({
        id: apiVenue.id,
        name: apiVenue.name,
        image: apiVenue.image_urls || '/api/placeholder/400/200',
        location: apiVenue.location,
        rating: apiVenue.rating || 0,
        totalReviews: apiVenue.total_reviews || 0,
        priceRange: `฿${apiVenue.price_range || '0'}/hour`,
        courtCount: apiVenue.court_count || 0,
        facilities: apiVenue.facilities || [],
        openHours: `${new Date(apiVenue.open_time).toLocaleTimeString()} - ${new Date(apiVenue.close_time).toLocaleTimeString()}`,
        distance: apiVenue.distance || 'N/A',
    }),
};

// =============== Components ===============
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
                        rightSection={filtersVisible ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
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
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text fw={500} mb="xs">Facilities</Text>
                        <Group>
                            {FACILITIES_OPTIONS.map((facility, index) => (
                                <Checkbox
                                    key={facility.label + index}
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
                            <ActionIcon variant="transparent" size="sm" onClick={onClearDistrict}>×</ActionIcon>
                        }
                    >
                        {DISTRICTS.find(d => d.value === selectedDistrict)?.label}
                    </Badge>
                )}
                {selectedFacilities.map((facility, index) => (
                    <Badge
                        key={`filter-${facility}-${index}`}
                        variant="light"
                        rightSection={
                            <ActionIcon variant="transparent" size="sm" onClick={() => onClearFacility(facility)}>×</ActionIcon>
                        }
                    >
                        {facility}
                    </Badge>
                ))}
                <Button variant="subtle" size="xs" onClick={onClearAll}>Clear All</Button>
            </Group>
        );
    };

const VenueCard: React.FC<{ venue: Venue }> = ({ venue }) => {
    const router = useRouter();

    return (
        <Card shadow="sm" radius="md" withBorder>
            <Card.Section>
                <Image src={venue.image} height={200} alt={venue.name} />
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

                <Group gap="xs">
                    {venue.facilities.map((facility, index) => (
                        <ThemeIcon
                            key={`facility-${facility}-${index}`}
                            size="sm"
                            variant="light"
                            radius="xl"
                            title={facility}
                        >
                            <FacilityIcon facility={facility} />
                        </ThemeIcon>
                    ))}
                </Group>

                <Group justify="end" mt="xs">
                    <Button variant="light" onClick={() => router.push(`/venues/${venue.id}`)}>
                        View Details
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
};

const Pagination: React.FC<{
    total: number;
    limit: number;
    page: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}> = ({
    total,
    limit,
    page,
    onPageChange,
    onLimitChange,
}) => {
        const totalPages = Math.ceil(total / limit);

        const getPageNumbers = () => {
            const pages: (number | string)[] = [];
            const maxVisiblePages = 5;

            if (totalPages <= maxVisiblePages) {
                return Array.from({ length: totalPages }, (_, i) => i + 1);
            }

            pages.push(1);

            let start = Math.max(2, page - 1);
            let end = Math.min(totalPages - 1, page + 1);

            if (page <= 3) {
                start = 2;
                end = 4;
            }

            if (page >= totalPages - 2) {
                start = totalPages - 3;
                end = totalPages - 1;
            }

            if (start > 2) pages.push('ellipsis-1');

            for (let i = start; i <= end; i += 1) {
                pages.push(i);
            }

            if (end < totalPages - 1) pages.push('ellipsis-2');

            pages.push(totalPages);

            return pages;
        };

        return (
            <Box mt="xl">
                <Group justify="center" gap="xs">
                    <Button
                        key="first"
                        variant="light"
                        disabled={page === 1}
                        onClick={() => onPageChange(1)}
                        size="sm"
                    >
                        «
                    </Button>
                    <Button
                        key="prev"
                        variant="light"
                        disabled={page === 1}
                        onClick={() => onPageChange(page - 1)}
                        size="sm"
                    >
                        ‹
                    </Button>

                    {getPageNumbers().map((pageNum) =>
                        typeof pageNum === 'string' ? (
                            <Text key={pageNum} c="dimmed">...</Text>
                        ) : (
                            <Button
                                key={`page-${pageNum}`}
                                variant={page === pageNum ? 'filled' : 'light'}
                                onClick={() => onPageChange(pageNum)}
                                size="sm"
                            >
                                {pageNum}
                            </Button>
                        )
                    )}

                    <Button
                        key="next"
                        variant="light"
                        disabled={page === totalPages}
                        onClick={() => onPageChange(page + 1)}
                        size="sm"
                    >
                        ›
                    </Button>
                    <Button
                        key="last"
                        variant="light"
                        disabled={page === totalPages}
                        onClick={() => onPageChange(totalPages)}
                        size="sm"
                    >
                        »
                    </Button>
                </Group>

                <Group justify="center" mt="md">
                    <Text size="sm" c="dimmed">
                        Showing {Math.min((page - 1) * limit + 1, total)} -
                        {Math.min(page * limit, total)} of {total} venues
                    </Text>
                    <Select
                        size="xs"
                        value={limit.toString()}
                        onChange={(value) => onLimitChange(parseInt(value || '10', 10))}
                        data={[
                            { value: '10', label: '10 per page' },
                            { value: '20', label: '20 per page' },
                            { value: '50', label: '50 per page' },
                        ]}
                        styles={{
                            input: { width: '120px' },
                        }}
                    />
                </Group>
            </Box>
        );
    };

// =============== Main Component ===============
const VenueListPage: React.FC = () => {
    // State
    const [search, setSearch] = useState<string>('');
    const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(9);
    const [totalVenues, setTotalVenues] = useState<number>(0);

    // Fetch venues
    const fetchVenues = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await venueService.searchVenues({
                search,
                location: selectedDistrict || undefined,
                facilities: selectedFacilities,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                page,
                limit,
            });

            setVenues(data.venues.map(venueService.transformVenue));
            setTotalVenues(data.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1); // Reset to first page on new search
            fetchVenues();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, selectedDistrict, priceRange, selectedFacilities]);

    // Fetch on page/limit change
    useEffect(() => {
        fetchVenues();
    }, [page, limit]);

    // Handlers
    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page when changing items per page
    };

    const handleClearFilters = () => {
        setSelectedDistrict(null);
        setSelectedFacilities([]);
        setPriceRange([0, 1000]);
        setPage(1);
    };

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
                    onClearDistrict={() => {
                        setSelectedDistrict(null);
                        setPage(1);
                    }}
                    onClearFacility={(facility) => {
                        setSelectedFacilities(prev => prev.filter(f => f !== facility));
                        setPage(1);
                    }}
                    onClearAll={handleClearFilters}
                />

                {/* Loading State */}
                {loading && (
                    <Stack align="center" mt="xl">
                        <Text>Loading venues...</Text>
                    </Stack>
                )}

                {/* Error State */}
                {error && (
                    <Paper p="md" mt="md" radius="md" bg="red.0">
                        <Text c="red" ta="center">{error}</Text>
                    </Paper>
                )}

                {/* No Results */}
                {!loading && !error && venues.length === 0 && (
                    <Paper p="xl" mt="md" radius="md" bg="gray.0">
                        <Stack align="center">
                            <Text size="lg" fw={500}>No venues found</Text>
                            <Text c="dimmed">Try adjusting your search or filters</Text>
                            <Button variant="light" onClick={handleClearFilters}>
                                Clear all filters
                            </Button>
                        </Stack>
                    </Paper>
                )}

                {/* Venues Grid */}
                {!loading && !error && venues.length > 0 && (
                    <>
                        <Grid>
                            {venues.map((venue) => (
                                <Grid.Col key={`venue-${venue.id}`} span={{ base: 12, md: 6, lg: 4 }}>
                                    <VenueCard venue={venue} />
                                </Grid.Col>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        <Pagination
                            total={totalVenues}
                            limit={limit}
                            page={page}
                            onPageChange={setPage}
                            onLimitChange={handleLimitChange}
                        />
                    </>
                )}
            </Container>
        </Box>
    );
};

export default VenueListPage;