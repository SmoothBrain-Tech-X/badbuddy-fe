/* eslint-disable max-len */
/* eslint-disable react/jsx-indent-props */

'use client';

import { useState } from 'react';
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

// Types
type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

interface Venue {
    id: string;
    name: string;
}

interface PartyFormData {
    name: string;
    skillLevel: SkillLevel | null;
    description: string;
    venue: string;
    date: Date | null;
    startTime: string;
    endTime: string;
    selectedCourts: string[];
    maxParticipants: number;
    costPerPerson: number;
    rules: string[];
    allowCancellation: boolean;
}

// Constants
const SKILL_LEVELS = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
];

const VENUES: Venue[] = [
    { id: 'venue1', name: 'Sports Complex A' },
    { id: 'venue2', name: 'Central Stadium' },
];

const COURTS = ['Court 1', 'Court 2', 'Court 3', 'Court 4'];

const CreateParty = () => {
    const [formData, setFormData] = useState<PartyFormData>({
        name: '',
        skillLevel: null,
        description: '',
        venue: '',
        date: null,
        startTime: '',
        endTime: '',
        selectedCourts: [],
        maxParticipants: 10,
        costPerPerson: 0,
        rules: ['Bring your own racket', 'Arrive 15 minutes early'],
        allowCancellation: true,
    });

    const handleFormChange = <K extends keyof PartyFormData>(
        key: K,
        value: PartyFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Submitting form data:', formData);
            // API call would go here
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="lg" py="xl">
                {/* Header */}
                <Group mb="xl" justify="flex-start">
                    <Button
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={() => window.history.back()}
                    >
                        Back
                    </Button>
                    <Title order={1}>Create Party</Title>
                </Group>

                <form onSubmit={handleSubmit}>
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
                                <TextInput
                                    label="Party Name"
                                    placeholder="e.g., Casual Badminton Session"
                                    value={formData.name}
                                    onChange={(e) => handleFormChange('name', e.target.value)}
                                    required
                                />

                                <Stack>
                                    <Text fw={500} size="sm">Skill Level</Text>
                                    <SegmentedControl
                                        fullWidth
                                        data={SKILL_LEVELS}
                                        value={formData.skillLevel || ''}
                                        onChange={(value) => handleFormChange('skillLevel', value as SkillLevel)}
                                    />
                                </Stack>

                                <Textarea
                                    label="Description"
                                    placeholder="Describe your party details"
                                    minRows={4}
                                    value={formData.description}
                                    onChange={(e) => handleFormChange('description', e.target.value)}
                                    required
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
                                        <Select
                                            label="Venue"
                                            placeholder="Select venue"
                                            data={VENUES.map(venue => ({
                                                value: venue.id,
                                                label: venue.name,
                                            }))}
                                            value={formData.venue}
                                            onChange={(value) => handleFormChange('venue', value || '')}
                                            required
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <DatePickerInput
                                            label="Date"
                                            placeholder="Pick a date"
                                            value={formData.date}
                                            onChange={(date) => handleFormChange('date', date)}
                                            required
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <TimeInput
                                            label="Start Time"
                                            leftSection={<IconClock size={16} />}
                                            value={formData.startTime}
                                            onChange={(e) => handleFormChange('startTime', e.target.value)}
                                            required
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <TimeInput
                                            label="End Time"
                                            leftSection={<IconClock size={16} />}
                                            value={formData.endTime}
                                            onChange={(e) => handleFormChange('endTime', e.target.value)}
                                            required
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Stack>
                                    <Text fw={500} size="sm">Select Courts</Text>
                                    <SimpleGrid cols={{ base: 2, sm: 4 }}>
                                        {COURTS.map((court) => (
                                            <Button
                                                key={court}
                                                variant={formData.selectedCourts.includes(court) ? 'filled' : 'light'}
                                                onClick={() => {
                                                    const newCourts = formData.selectedCourts.includes(court)
                                                        ? formData.selectedCourts.filter(c => c !== court)
                                                        : [...formData.selectedCourts, court];
                                                    handleFormChange('selectedCourts', newCourts);
                                                }}
                                            >
                                                {court}
                                            </Button>
                                        ))}
                                    </SimpleGrid>
                                </Stack>
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
                                    <Group>
                                        <ActionIcon
                                            variant="light"
                                            onClick={() => handleFormChange('maxParticipants', Math.max(1, formData.maxParticipants - 1))}
                                        >
                                            <IconMinus size={16} />
                                        </ActionIcon>
                                        <NumberInput
                                            hideControls
                                            min={1}
                                            max={100}
                                            value={formData.maxParticipants}
                                            onChange={(value) => handleFormChange('maxParticipants', typeof value === 'number' ? value : 1)}
                                            style={{ width: '80px' }}
                                        />
                                        <ActionIcon
                                            variant="light"
                                            onClick={() => handleFormChange('maxParticipants', formData.maxParticipants + 1)}
                                        >
                                            <IconPlus size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Stack>

                                <NumberInput
                                    label="Cost per Person"
                                    placeholder="0"
                                    min={0}
                                    value={formData.costPerPerson}
                                    onChange={(value) => handleFormChange('costPerPerson', typeof value === 'number' ? value : 0)}
                                    leftSection="$"
                                />

                                <Stack>
                                    <Text fw={500} size="sm">Rules</Text>
                                    {formData.rules.map((rule, index) => (
                                        <Group key={index}>
                                            <TextInput
                                                style={{ flex: 1 }}
                                                value={rule}
                                                onChange={(e) => {
                                                    const newRules = [...formData.rules];
                                                    newRules[index] = e.target.value;
                                                    handleFormChange('rules', newRules);
                                                }}
                                            />
                                            <ActionIcon
                                                color="red"
                                                variant="light"
                                                onClick={() => {
                                                    const newRules = formData.rules.filter((_, i) => i !== index);
                                                    handleFormChange('rules', newRules);
                                                }}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    ))}
                                    <Button
                                        variant="light"
                                        leftSection={<IconPlus size={16} />}
                                        onClick={() => handleFormChange('rules', [...formData.rules, ''])}
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
                                        <Switch
                                            checked={formData.allowCancellation}
                                            onChange={(event) => handleFormChange('allowCancellation', event.currentTarget.checked)}
                                            size="lg"
                                        />
                                    </Group>
                                </Paper>
                            </Stack>
                        </Card>

                        {/* Form Validation */}
                        {!formData.selectedCourts.length && (
                            <Alert color="red" radius="md">
                                Please select at least one court
                            </Alert>
                        )}

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
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="lg"
                                leftSection={<IconCheck size={20} />}
                                disabled={!formData.selectedCourts.length}
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
