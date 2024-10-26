'use client';

import { useState } from 'react';
import {
    Container,
    Stack,
    Title,
    ThemeIcon,
    Text,
    Stepper,
    Anchor,
    Box,
} from '@mantine/core';
import { IconShieldCheck } from '@tabler/icons-react';
import type { FormData, PasswordStrength } from './register';
import { checkPasswordStrength } from './utils/passwordUtils';
import { AccountStep } from './components/AccountStep';
import { ProfileStep } from './components/ProfileStep';
import { PreferencesStep } from './components/PreferencesStep';
import { CompletedStep } from './components/CompletedStep';

const initialFormData: FormData = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    level: '',
    playingHand: '',
};

const RegisterPage: React.FC = () => {
    const [active, setActive] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
        score: 0,
        feedback: '',
    });

    const handleInputChange = (key: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (key === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setActive(active + 1);
        }, 1000);
    };

    const handleSocialRegister = (provider: string) => {
        console.log(`Register with ${provider}`);
    };

    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="sm" py="xl" pt="xl">
                <Stack gap="lg">
                    <Stack align="center">
                        <ThemeIcon size={60} radius="md" variant="light" color="blue">
                            <IconShieldCheck size={30} />
                        </ThemeIcon>
                        <Title order={1} ta="center">Create Account</Title>
                        <Text c="dimmed" ta="center" size="sm">
                            Join our badminton community today
                        </Text>
                    </Stack>

                    <Stepper
                        active={active}
                        onStepClick={setActive}
                        allowNextStepsSelect={false}
                    >
                        <Stepper.Step label="Account" description="Create your account">
                            <AccountStep
                                formData={formData}
                                passwordStrength={passwordStrength}
                                loading={loading}
                                onInputChange={handleInputChange}
                                onSubmit={handleSubmit}
                                onSocialRegister={handleSocialRegister}
                            />
                        </Stepper.Step>

                        <Stepper.Step label="Profile" description="Personal information">
                            <ProfileStep
                                formData={formData}
                                loading={loading}
                                onInputChange={handleInputChange}
                                onSubmit={handleSubmit}
                            />
                        </Stepper.Step>

                        <Stepper.Step label="Preferences" description="Playing preferences">
                            <PreferencesStep
                                formData={formData}
                                loading={loading}
                                onInputChange={handleInputChange}
                                onSubmit={handleSubmit}
                            />
                        </Stepper.Step>

                        <Stepper.Completed>
                            <CompletedStep />
                        </Stepper.Completed>
                    </Stepper>

                    <Text ta="center">
                        Already have an account?{' '}
                        <Anchor component="button" type="button" fw={700}>
                            Sign in
                        </Anchor>
                    </Text>

                    <Text size="xs" c="dimmed" ta="center">
                        By registering, you agree to our{' '}
                        <Anchor component="button" type="button" size="xs">Terms of Service</Anchor>
                        {' '}and{' '}
                        <Anchor component="button" type="button" size="xs">Privacy Policy</Anchor>
                    </Text>
                </Stack>
            </Container>
        </Box>
    );
};

export default RegisterPage;
