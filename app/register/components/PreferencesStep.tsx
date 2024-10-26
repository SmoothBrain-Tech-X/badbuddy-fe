import { Card, Stack, Radio, Button } from '@mantine/core';
import type { FormData } from '../register';

interface PreferencesStepProps {
    formData: FormData;
    loading: boolean;
    onInputChange: (key: keyof FormData, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const PreferencesStep: React.FC<PreferencesStepProps> = ({
    formData,
    loading,
    onInputChange,
    onSubmit,
}) => (
    <Card shadow="md" radius="md" className="p-4 sm:p-8 mt-6" withBorder>
        <form onSubmit={onSubmit}>
            <Stack className="space-y-4 sm:space-y-6">
                <Radio.Group
                    label="Skill Level"
                    required
                    value={formData.level}
                    onChange={(value) => onInputChange('level', value)}
                    className="text-sm sm:text-base"
                >
                    <Stack className="mt-2 space-y-2 sm:space-y-3">
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
                    className="text-sm sm:text-base"
                >
                    <Stack className="mt-2 space-y-2 sm:space-y-3">
                        <Radio value="right" label="Right Hand" />
                        <Radio value="left" label="Left Hand" />
                    </Stack>
                </Radio.Group>

                <Button
                    type="submit"
                    loading={loading}
                    className="mt-4 text-sm sm:text-base"
                >
                    Complete Registration
                </Button>
            </Stack>
        </form>
    </Card>
);
