'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Container,
    Title,
    Paper,
    TextInput,
    Textarea,
    Button,
    Group,
    Stack,
    SegmentedControl,
    Select,
    NumberInput,
    Switch,
    ThemeIcon,
    Text,
    Grid,
    Card,
    SimpleGrid,
    Box,
    ActionIcon,
    List,
    Alert,
    rem,
} from '@mantine/core';
import {
    IconMapPin,
    IconUsers,
    IconArrowLeft,
    IconInfoCircle,
    IconPlus,
    IconMinus,
    IconAlertCircle,
    IconCheck,
    IconTrash,
    IconCalendar,
    IconClock,
} from '@tabler/icons-react';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { useRouter } from 'next/navigation';
import { VenueList, venueService, VenueListDTO } from '@/services';

// Types and Schema
const skillLevels = ['beginner', 'intermediate', 'advanced'] as const;
type SkillLevel = (typeof skillLevels)[number];

const VENUES = [
    { id: 'venue1', name: 'Sports Complex A' },
    { id: 'venue2', name: 'Central Stadium' },
] as const;


const partySchema = z.object({
    name: z.string()
        .min(3, 'Party name must be at least 3 characters')
        .max(50, 'Party name must be less than 50 characters'),
    skillLevel: z.enum(skillLevels, {
        required_error: 'Please select a skill level',
    }),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be less than 500 characters'),
    venue: z.string().min(1, 'Please select a venue'),
    date: z.date({
        required_error: 'Please select a date',
        invalid_type_error: 'Invalid date format',
    }),
    startTime: z.string().min(1, 'Please select start time'),
    endTime: z.string().min(1, 'Please select end time'),
    maxParticipants: z.number()
        .min(2, 'Minimum 2 participants required')
        .max(100, 'Maximum 100 participants allowed'),
    costPerPerson: z.number()
        .min(0, 'Cost cannot be negative')
        .max(10000, 'Cost cannot exceed 10000'),
    rules: z.array(z.string().min(1, 'Rule cannot be empty')),
    allowCancellation: z.boolean(),
});

type PartyFormData = z.infer<typeof partySchema>;

const CreateParty = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [venues, setVenues] = useState<VenueList[] | null>(null);


    const fetchVenues = async () => {
        try {
            // Fetch venues from API
            const venueResponse: VenueListDTO | null = await venueService.list();
            if (venueResponse) {
                setVenues(venueResponse.venues);
            }
        }
        catch (error) {
            console.error('Error fetching venues:', error);
        }

    }

    useEffect(() => {
        fetchVenues();

    }, []);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        getValues,
    } = useForm<PartyFormData>({
        resolver: zodResolver(partySchema),
        defaultValues: {
            name: '',
            skillLevel: 'intermediate',
            description: '',
            venue: '',
            date: undefined,
            startTime: '',
            endTime: '',
            maxParticipants: 10,
            costPerPerson: 0,
            rules: ['Bring your own racket', 'Arrive 15 minutes early'],
            allowCancellation: true,
        },
    });


    const onSubmit = async (data: PartyFormData) => {
        try {
            setLoading(true);
            console.log('Submitting form data:', data);
            // API call would go here
            // await createParty(data);
            router.push('/parties'); // Redirect after success
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleAddRule = () => {
        const currentRules = getValues('rules');
        setValue('rules', [...currentRules, ''], { shouldValidate: true });
    };

    const handleRemoveRule = (index: number) => {
        const currentRules = getValues('rules');
        setValue(
            'rules',
            currentRules.filter((_, i) => i !== index),
            { shouldValidate: true }
        );
    };

    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="lg" py="xl">
                {/* Header */}
                <Group mb="xl" justify="flex-start">
                    <Button
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={() => router.back()}
                    >
                        Back
                    </Button>
                    <Title order={1}>Create Party</Title>
                </Group>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
                        {/* Basic Info Card */}
                        <Card withBorder radius="md" p="lg">
                            <Group mb="lg">
                                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                                    <IconInfoCircle size={rem(20)} />
                                </ThemeIcon>
                                <Title order={2} size="h3">Basic Information</Title>
                            </Group>

                            <Stack>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextInput
                                            label="Party Name"
                                            placeholder="e.g., Casual Badminton Session"
                                            error={errors.name?.message}
                                            {...field}
                                        />
                                    )}
                                />

                                <Stack>
                                    <Text fw={500} size="sm">Skill Level</Text>
                                    <Controller
                                        name="skillLevel"
                                        control={control}
                                        render={({ field }) => (
                                            <SegmentedControl
                                                fullWidth
                                                data={[
                                                    { value: 'beginner', label: 'Beginner' },
                                                    { value: 'intermediate', label: 'Intermediate' },
                                                    { value: 'advanced', label: 'Advanced' },
                                                ]}
                                                {...field}
                                            />
                                        )}
                                    />
                                </Stack>

                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            label="Description"
                                            placeholder="Describe your party details"
                                            minRows={4}
                                            error={errors.description?.message}
                                            {...field}
                                        />
                                    )}
                                />
                            </Stack>
                        </Card>

                        {/* Location & Time Card */}
                        <Card withBorder radius="md" p="lg">
                            <Group mb="lg">
                                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                                    <IconMapPin size={rem(20)} />
                                </ThemeIcon>
                                <Title order={2} size="h3">Location & Time</Title>
                            </Group>

                            <Stack>
                                <Grid>
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <Controller
                                            name="venue"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    label="Venue"
                                                    placeholder="Select venue"
                                                    data={venues?.map((venue) => ({
                                                        value: venue.id,
                                                        label: venue.name,
                                                    }))}
                                                    error={errors.venue?.message}
                                                    searchable  // Enable search functionality
                                                    nothingFoundMessage="No venues found"
                                                    maxDropdownHeight={280} // Optional: control dropdown height
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <Controller
                                            name="date"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePickerInput
                                                    label="Date"
                                                    placeholder="Pick a date"
                                                    error={errors.date?.message}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <Controller
                                            name="startTime"
                                            control={control}
                                            render={({ field }) => (
                                                <TimeInput
                                                    label="Start Time"
                                                    leftSection={<IconClock size={16} />}
                                                    error={errors.startTime?.message}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <Controller
                                            name="endTime"
                                            control={control}
                                            render={({ field }) => (
                                                <TimeInput
                                                    label="End Time"
                                                    leftSection={<IconClock size={16} />}
                                                    error={errors.endTime?.message}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </Grid.Col>
                                </Grid>


                            </Stack>
                        </Card>

                        {/* Party Settings Card */}
                        <Card withBorder radius="md" p="lg">
                            <Group mb="lg">
                                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                                    <IconUsers size={rem(20)} />
                                </ThemeIcon>
                                <Title order={2} size="h3">Party Settings</Title>
                            </Group>

                            <Stack>
                                <Stack>
                                    <Text fw={500} size="sm">Maximum Participants</Text>
                                    <Controller
                                        name="maxParticipants"
                                        control={control}
                                        render={({ field }) => (
                                            <Group>
                                                <ActionIcon
                                                    variant="light"
                                                    onClick={() => field.onChange(Math.max(2, field.value - 1))}
                                                >
                                                    <IconMinus size={16} />
                                                </ActionIcon>
                                                <NumberInput
                                                    hideControls
                                                    min={2}
                                                    max={100}
                                                    error={errors.maxParticipants?.message}
                                                    style={{ width: '80px' }}
                                                    {...field}
                                                />
                                                <ActionIcon
                                                    variant="light"
                                                    onClick={() => field.onChange(Math.min(100, field.value + 1))}
                                                >
                                                    <IconPlus size={16} />
                                                </ActionIcon>
                                            </Group>
                                        )}
                                    />
                                </Stack>

                                <Controller
                                    name="costPerPerson"
                                    control={control}
                                    render={({ field }) => (
                                        <NumberInput
                                            label="Cost per Person"
                                            placeholder="0"
                                            min={0}
                                            leftSection="฿"
                                            error={errors.costPerPerson?.message}
                                            {...field}
                                        />
                                    )}
                                />

                                <Stack>
                                    <Text fw={500} size="sm">Rules</Text>
                                    <Controller
                                        name="rules"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                {field.value.map((rule, index) => (
                                                    <Group key={index}>
                                                        <TextInput
                                                            style={{ flex: 1 }}
                                                            value={rule}
                                                            error={errors.rules?.[index]?.message}
                                                            onChange={(e) => {
                                                                const newRules = [...field.value];
                                                                newRules[index] = e.target.value;
                                                                field.onChange(newRules);
                                                            }}
                                                        />
                                                        <ActionIcon
                                                            color="red"
                                                            variant="light"
                                                            onClick={() => handleRemoveRule(index)}
                                                        >
                                                            <IconTrash size={16} />
                                                        </ActionIcon>
                                                    </Group>
                                                ))}
                                            </>
                                        )}
                                    />
                                    <Button
                                        variant="light"
                                        leftSection={<IconPlus size={16} />}
                                        onClick={handleAddRule}
                                    >
                                        Add Rule
                                    </Button>
                                </Stack>

                                <Paper p="md" withBorder radius="md">
                                    <Group justify="space-between">
                                        <div>
                                            <Text fw={500}>Allow Cancellation</Text>
                                            <Text size="sm" c="dimmed">
                                                Participants can cancel up to 2 hours before start
                                            </Text>
                                        </div>
                                        <Controller
                                            name="allowCancellation"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch
                                                    checked={field.value}
                                                    onChange={(event) => field.onChange(event.currentTarget.checked)}
                                                    size="lg"
                                                />
                                            )}
                                        />
                                    </Group>
                                </Paper>
                            </Stack>
                        </Card>

                        {/* Guidelines */}
                        <Alert
                            variant="light"
                            color="orange"
                            radius="md"
                            title="Guidelines"
                            icon={<IconAlertCircle />}
                        >
                            <List size="sm">
                                <List.Item>Verify all information before creating the party</List.Item>
                                <List.Item>Some details cannot be modified after creation</List.Item>
                                <List.Item>Support team is available 24/7 for assistance</List.Item>
                            </List>
                        </Alert>

                        {/* Action Buttons */}
                        <Group grow>
                            <Button
                                variant="light"
                                size="lg"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="lg"
                                loading={loading}
                                leftSection={<IconCheck size={20} />}
                            >
                                Create Party
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Container>
        </Box>
    );
};

export default CreateParty;