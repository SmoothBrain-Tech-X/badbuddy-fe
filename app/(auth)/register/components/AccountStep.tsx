import { Card, Stack, Text, Group, Button, TextInput, PasswordInput, Divider } from '@mantine/core';
import { IconMail, IconLock, IconBrandGoogle } from '@tabler/icons-react';
import type { RegisterFormData, PasswordStrength } from '@/services';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface AccountStepProps {
    formData: RegisterFormData;
    passwordStrength: PasswordStrength;
    loading: boolean;
    onInputChange: (key: keyof RegisterFormData, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onSocialRegister: (provider: string) => void;
}

export const AccountStep: React.FC<AccountStepProps> = ({
    formData,
    passwordStrength,
    loading,
    onInputChange,
    onSubmit,
    onSocialRegister,
}) => (
    <Card shadow="md" radius="md" p="xl" mt="md" withBorder>
        <Stack>
            <Stack>
                <Text fw={500} ta="center">Quick Registration</Text>
                <Group grow>
                    <Button
                        variant="light"
                        leftSection={<IconBrandGoogle size={16} />}
                        onClick={() => onSocialRegister('Google')}
                    >
                        Google
                    </Button>
                </Group>
            </Stack>

            <Divider label="Or register with email" labelPosition="center" />

            <form onSubmit={onSubmit}>
                <Stack>
                    <TextInput
                        label="Email"
                        placeholder="your@email.com"
                        required
                        leftSection={<IconMail size={16} />}
                        value={formData.email}
                        onChange={(e) => onInputChange('email', e.target.value)}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Create a strong password"
                        required
                        leftSection={<IconLock size={16} />}
                        value={formData.password}
                        onChange={(e) => onInputChange('password', e.target.value)}
                    />

                    {formData.password && (
                        <PasswordStrengthIndicator passwordStrength={passwordStrength} />
                    )}

                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        required
                        leftSection={<IconLock size={16} />}
                        value={formData.confirmPassword}
                        onChange={(e) => onInputChange('confirmPassword', e.target.value)}
                        error={
                            formData.confirmPassword &&
                            formData.password !== formData.confirmPassword &&
                            "Passwords don't match"
                        }
                    />

                    <Button
                        type="submit"
                        loading={loading}
                        disabled={
                            !formData.email ||
                            !formData.password ||
                            !formData.confirmPassword ||
                            formData.password !== formData.confirmPassword ||
                            passwordStrength.score < 40
                        }
                        mt="md"
                    >
                        Continue
                    </Button>
                </Stack>
            </form>
        </Stack>
    </Card>
);
