import { Stack, Progress, Group, Text, Badge } from '@mantine/core';
import type { PasswordStrength } from '../register';
import { getPasswordStrengthColor } from '../utils/passwordUtils';

interface PasswordStrengthIndicatorProps {
    passwordStrength: PasswordStrength;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
    passwordStrength,
}) => {
    const color = getPasswordStrengthColor(passwordStrength.score);

    return (
        <Stack gap="xs">
            <Progress
                value={passwordStrength.score}
                color={color}
                size="sm"
            />
            <Group justify="space-between">
                <Text size="sm" c={color}>
                    {passwordStrength.feedback}
                </Text>
                <Badge color={color}>
                    {passwordStrength.score}%
                </Badge>
            </Group>
        </Stack>
    );
};
