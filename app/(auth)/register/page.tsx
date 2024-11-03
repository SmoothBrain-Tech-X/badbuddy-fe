// src/app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import toast from 'react-hot-toast';
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
import { type RegisterFormData, type PasswordStrength } from '@/services';
import { checkPasswordStrength } from './utils/passwordUtils';
import { AccountStep } from './components/AccountStep';
import { ProfileStep } from './components/ProfileStep';
import { PreferencesStep } from './components/PreferencesStep';
import { CompletedStep } from './components/CompletedStep';

const registerSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must not exceed 50 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    gender: z.string().min(1, 'Gender is required'),
    bio: z.string().optional(),
    location: z.string().min(1, 'Location is required'),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    playingHand: z.enum(['left', 'right']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

const initialFormData: RegisterFormData = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    bio: '',
    location: '',
    level: 'beginner',
    playingHand: 'right',
};

const RegisterPage = () => {
    const router = useRouter();

    const [active, setActive] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
        score: 0,
        feedback: '',
    });

    const handleInputChange = (key: keyof RegisterFormData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (key === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const baseSchema = registerSchema.innerType();

    const validateCurrentStep = () => {
        try {
            const dataToValidate = { ...formData };

            switch (active) {
                case 0:
                    z.object({
                        email: baseSchema.shape.email,
                        password: baseSchema.shape.password,
                        confirmPassword: baseSchema.shape.confirmPassword,
                    }).parse(dataToValidate);
                    return passwordStrength.score >= 40;

                case 1:
                    z.object({
                        firstName: baseSchema.shape.firstName,
                        lastName: baseSchema.shape.lastName,
                        phone: baseSchema.shape.phone,
                        gender: baseSchema.shape.gender,
                    }).parse(dataToValidate);
                    return true;

                case 2:
                    z.object({
                        level: baseSchema.shape.level,
                        playingHand: baseSchema.shape.playingHand,
                    }).parse(dataToValidate);
                    return true;

                default:
                    return false;
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstError = error.errors[0];
                toast.error(firstError.message);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
    };

    const handleSocialRegister = async (provider: string) => {
        toast.loading(`Connecting to ${provider}...`);
        // Implement social registration
    };

    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="sm" py="xl">
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
                            <CompletedStep onStart={() => router.push('/home')} />
                        </Stepper.Completed>
                    </Stepper>

                    <Text ta="center">
                        Already have an account?{' '}
                        <Anchor
                            component="button"
                            type="button"
                            fw={700}
                            onClick={() => router.push('/login')}
                        >
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
