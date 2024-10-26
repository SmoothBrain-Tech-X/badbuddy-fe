'use client';

import { useState } from 'react';
import {
    Container,
    Card,
    Group,
    Text,
    TextInput,
    Button,
    Stack,
    Title,
    PasswordInput,
    Divider,
    Checkbox,
    Anchor,
    Paper,
    ThemeIcon,
    rem,
    Box,
} from '@mantine/core';
import {
    IconBrandGoogle,
    IconMail,
    IconLock,
    IconShieldCheck,
} from '@tabler/icons-react';

interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface SecurityNoticeProps {
    title: string;
    description: string;
}

interface SocialLoginButtonProps {
    provider: 'Google';
    onClick: (provider: string) => void;
}

const Logo = () => (
    <Stack align="center">
        <ThemeIcon size={60} radius="md" variant="light" color="blue">
            <IconShieldCheck size={30} />
        </ThemeIcon>
        <Title order={1} ta="center">Welcome Back</Title>
        <Text c="dimmed" ta="center" size="sm">
            Sign in to continue to Badminton App
        </Text>
    </Stack>
);

const SecurityNotice: React.FC<SecurityNoticeProps> = ({ title, description }) => (
    <Paper p="md" radius="md" bg="blue.0" withBorder>
        <Group>
            <ThemeIcon variant="light" size="lg" color="blue" radius="xl">
                <IconShieldCheck size={rem(20)} />
            </ThemeIcon>
            <div>
                <Text size="sm" fw={500} mb={4}>{title}</Text>
                <Text size="xs" c="dimmed">{description}</Text>
            </div>
        </Group>
    </Paper>
);

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider, onClick }) => (
    <Button
        variant="light"
        leftSection={<IconBrandGoogle size={16} />}
        onClick={() => onClick(provider)}
    >
        {provider}
    </Button>
);

const TermsAndPrivacy = () => (
    <Text size="xs" c="dimmed" ta="center">
        By continuing, you agree to our{' '}
        <Anchor component="button" type="button" size="xs">Terms of Service</Anchor>
        {' '}and{' '}
        <Anchor component="button" type="button" size="xs">Privacy Policy</Anchor>
    </Text>
);

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleInputChange = (field: keyof LoginFormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = field === 'rememberMe'
            ? event.currentTarget.checked
            : event.currentTarget.value;

        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Login attempt with:', formData);
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider: string): void => {
        console.log(`Login with ${provider}`);
    };

    return (
        <Box bg="gray.0" mih="100vh">
            <Container size="xs" py="xl">
                <Stack gap="lg">
                    <Logo />

                    <Card shadow="md" radius="md" p="xl" withBorder>
                        <form onSubmit={handleLogin}>
                            <Stack>
                                <TextInput
                                    label="Email"
                                    placeholder="your@email.com"
                                    required
                                    leftSection={<IconMail size={16} />}
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    type="email"
                                />

                                <PasswordInput
                                    label="Password"
                                    placeholder="Your password"
                                    required
                                    leftSection={<IconLock size={16} />}
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                />

                                <Group justify="space-between">
                                    <Checkbox
                                        label="Remember me"
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange('rememberMe')}
                                    />
                                    <Anchor component="button" type="button" c="blue" fw={500} size="sm">
                                        Forgot password?
                                    </Anchor>
                                </Group>

                                <Button
                                    type="submit"
                                    loading={loading}
                                    fullWidth
                                    size="md"
                                >
                                    Sign In
                                </Button>
                            </Stack>
                        </form>

                        <Stack mt="xl">
                            <Divider label="Or continue with" labelPosition="center" />
                            <Group grow>
                                <SocialLoginButton
                                    provider="Google"
                                    onClick={handleSocialLogin}
                                />
                            </Group>
                        </Stack>
                    </Card>

                    <Text ta="center">
                        Don&apos;t have an account?{' '}
                        <Anchor component="button" type="button" fw={700}>
                            Sign up
                        </Anchor>
                    </Text>

                    <SecurityNotice
                        title="Secure Login"
                        description="Your connection is secure and your information is protected"
                    />

                    <TermsAndPrivacy />
                </Stack>
            </Container>
        </Box>
    );
};

export default LoginPage;
