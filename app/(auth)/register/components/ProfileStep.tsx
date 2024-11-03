import { Card, Stack, Group, TextInput, Select, Button, Textarea } from '@mantine/core';
import { IconUser, IconPhone, IconMapPin } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import type { RegisterFormData } from '@/services';

interface Province {
    id: number;
    name_th: string;
    name_en: string;
}

interface ProfileStepProps {
    formData: RegisterFormData;
    loading: boolean;
    onInputChange: (key: keyof RegisterFormData, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
    formData,
    loading,
    onInputChange,
    onSubmit,
}) => {
    const [provinces, setProvinces] = useState<{ value: string; label: string }[]>([]);
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json');
                const data: Province[] = await response.json();

                // Transform the data into the format required by Mantine Select
                const transformedData = data.map((province) => ({
                    value: province.name_en,
                    label: `${province.name_en} (${province.name_th})`,
                }));

                setProvinces(transformedData);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            } finally {
                setIsLoadingProvinces(false);
            }
        };

        fetchProvinces();
    }, []);

    return (
        <Card shadow="md" radius="md" p="xl" mt="md" withBorder>
            <form onSubmit={onSubmit}>
                <Stack>
                    <Group grow>
                        <TextInput
                            label="First Name"
                            placeholder="Your first name"
                            required
                            leftSection={<IconUser size={16} />}
                            value={formData.firstName}
                            onChange={(e) => onInputChange('firstName', e.target.value)}
                        />
                        <TextInput
                            label="Last Name"
                            placeholder="Your last name"
                            required
                            leftSection={<IconUser size={16} />}
                            value={formData.lastName}
                            onChange={(e) => onInputChange('lastName', e.target.value)}
                        />
                    </Group>

                    <TextInput
                        label="Phone Number"
                        placeholder="Your phone number"
                        required
                        leftSection={<IconPhone size={16} />}
                        value={formData.phone}
                        onChange={(e) => onInputChange('phone', e.target.value)}
                    />

                    <Select
                        label="location"
                        placeholder="Select your location"
                        leftSection={<IconMapPin size={16} />}
                        data={provinces}
                        searchable
                        required
                        nothingFoundMessage="No location found"
                        value={formData.location}
                        onChange={(value) => onInputChange('location', value || '')}

                    />

                    <Select
                        label="Gender"
                        placeholder="Select gender"
                        required
                        data={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                            { value: 'other', label: 'Other' },
                        ]}
                        value={formData.gender}
                        onChange={(value) => onInputChange('gender', value || '')}
                    />

                    <Textarea
                        label="Bio"
                        placeholder="Tell us about yourself"
                        value={formData.bio}
                        rows={4}
                        onChange={(e) => onInputChange('bio', e.target.value)}
                    />

                    <Button
                        type="submit"
                        loading={loading}
                        mt="md"
                    >
                        Continue
                    </Button>
                </Stack>
            </form>
        </Card>
    );
};
