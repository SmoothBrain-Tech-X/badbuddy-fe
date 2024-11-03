import { Card, Stack, Radio, Button } from '@mantine/core';
import type { RegisterFormData } from '@/services';

interface PreferencesStepProps {
    formData: RegisterFormData;
    loading: boolean;
    onInputChange: (key: keyof RegisterFormData, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const PreferencesStep: React.FC<PreferencesStepProps> = ({
    formData,
    loading,
    onInputChange,
    onSubmit,
}) => (
    <Card shadow="md" radius="md" p="xl" mt="md" withBorder>
        <form onSubmit={onSubmit}>
            <Stack>
                <Radio.Group
                    label="Skill Level"
                    required
                    value={formData.level}
                    onChange={(value) => onInputChange('level', value)}
                >
                    <Stack mt="xs">
                        <Radio value="beginner" label="Beginner" />
                        <Radio value="intermediate" label="Intermediate" />
                        <Radio value="advanced" label="Advanced" />
                    </Stack>
                </Radio.Group>

                <Radio.Group
                    label="Playing Hand"
                    required
                    value={formData.playingHand}
                    onChange={(value) => onInputChange('playingHand', value)}
                >
                    <Stack mt="xs">
                        <Radio value="right" label="Right Hand" />
                        <Radio value="left" label="Left Hand" />
                    </Stack>
                </Radio.Group>

                <Button
                    type="submit"
                    loading={loading}
                    mt="md"
                >
                    Complete Registration
                </Button>
            </Stack>
        </form>
    </Card>
);
