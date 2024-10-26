import { Card, Stack, Group, TextInput, Select, Button } from '@mantine/core';
import { IconUser, IconPhone } from '@tabler/icons-react';
import type { FormData } from '../register';

interface ProfileStepProps {
    formData: FormData;
    loading: boolean;
    onInputChange: (key: keyof FormData, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
    formData,
    loading,
    onInputChange,
    onSubmit,
}) => (
    <Card shadow="md" radius="md" className="p-4 sm:p-8 mt-6" withBorder>
        <form onSubmit={onSubmit}>
            <Stack className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <TextInput
                        label="First Name"
                        placeholder="Your first name"
                        required
                        leftSection={<IconUser size={16} />}
                        value={formData.firstName}
                        onChange={(e) => onInputChange('firstName', e.target.value)}
                        className="flex-1"
                        classNames={{ input: 'text-sm sm:text-base' }}
                    />
                    <TextInput
                        label="Last Name"
                        placeholder="Your last name"
                        required
                        leftSection={<IconUser size={16} />}
                        value={formData.lastName}
                        onChange={(e) => onInputChange('lastName', e.target.value)}
                        className="flex-1"
                        classNames={{ input: 'text-sm sm:text-base' }}
                    />
                </div>

                <TextInput
                    label="Phone Number"
                    placeholder="Your phone number"
                    required
                    leftSection={<IconPhone size={16} />}
                    value={formData.phone}
                    onChange={(e) => onInputChange('phone', e.target.value)}
                    classNames={{ input: 'text-sm sm:text-base' }}
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
                    classNames={{ input: 'text-sm sm:text-base' }}
                />

                <Button
                    type="submit"
                    loading={loading}
                    className="mt-4 text-sm sm:text-base"
                >
                    Continue
                </Button>
            </Stack>
        </form>
    </Card>
);
