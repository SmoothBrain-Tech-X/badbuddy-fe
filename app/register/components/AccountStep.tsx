import { Card, Stack, Text, Group, Button, TextInput, PasswordInput, Divider } from '@mantine/core';
import { IconMail, IconLock, IconBrandGoogle } from '@tabler/icons-react';
import type { FormData, PasswordStrength } from '../register';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface AccountStepProps {
    formData: FormData;
    passwordStrength: PasswordStrength;
    loading: boolean;
    onInputChange: (key: keyof FormData, value: string) => void;
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
    <Card shadow="md" radius="md" className="p-4 sm:p-8 mt-6" withBorder>
        <Stack className="space-y-4 sm:space-y-6">
            <Stack className="space-y-2">
                <Text fw={500} className="text-sm sm:text-base text-center">Quick Registration</Text>
                <Group grow>
                    <Button
                        variant="light"
                        leftSection={<IconBrandGoogle size={16} />}
                        className="text-sm sm:text-base"
                        onClick={() => onSocialRegister('Google')}
                    >
                        Google
                    </Button>
                </Group>
            </Stack>

            <Divider label="Or register with email" labelPosition="center" />

            <form onSubmit={onSubmit} className="w-full">
                <Stack className="space-y-3 sm:space-y-4">
                    <TextInput
                        label="Email"
                        placeholder="your@email.com"
                        required
                        leftSection={<IconMail size={16} />}
                        value={formData.email}
                        onChange={(e) => onInputChange('email', e.target.value)}
                        classNames={{ input: 'text-sm sm:text-base' }}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Create a strong password"
                        required
                        leftSection={<IconLock size={16} />}
                        value={formData.password}
                        onChange={(e) => onInputChange('password', e.target.value)}
                        classNames={{ input: 'text-sm sm:text-base' }}
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
                        classNames={{ input: 'text-sm sm:text-base' }}
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
                        className="mt-4 text-sm sm:text-base"
                    >
                        Continue
                    </Button>
                </Stack>
            </form>
        </Stack>
    </Card>
);
