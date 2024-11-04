'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandGoogle, IconLock, IconMail, IconShieldCheck } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import {
  Anchor,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  rem,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useAuth } from '@/hooks/useAuth';

// Form validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must not exceed 50 characters'),
  remember_me: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Login form content component
const LoginContent = () => {
  const { login, isLoading: isAuthLoading, error: authError } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // Login function now handles the redirect internally
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    //show toast cooming soon
    toast.error('Social login coming soon');
  };

  return (
    <Box bg="gray.0" mih="100vh">
      <Container size="xs" py="xl">
        <Stack gap="lg">
          <Stack align="center">
            <ThemeIcon size={60} radius="md" variant="light" color="blue">
              <IconShieldCheck size={30} />
            </ThemeIcon>
            <Title order={1} ta="center">
              Welcome Back
            </Title>
            <Text c="dimmed" ta="center" size="sm">
              Sign in to access Badminton App
            </Text>
          </Stack>

          <Card radius="md" p="xl">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Stack>
                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  required
                  leftSection={<IconMail size={16} />}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  required
                  leftSection={<IconLock size={16} />}
                  error={errors.password?.message}
                  {...register('password')}
                />

                <Group justify="space-between">
                  <Checkbox label="Remember me" {...register('remember_me')} />
                  <Anchor
                    component="button"
                    type="button"
                    c="blue"
                    fw={500}
                    size="sm"
                    onClick={() => router.push('/forgot-password')}
                  >
                    Forgot password?
                  </Anchor>
                </Group>

                {authError && (
                  <Text c="red" size="sm" ta="center">
                    {authError}
                  </Text>
                )}

                <Button type="submit" loading={isSubmitting || isAuthLoading} fullWidth size="md">
                  Sign In
                </Button>
              </Stack>
            </form>

            <Stack mt="xl">
              <Divider label="Or continue with" labelPosition="center" />
              <Group grow>
                <Button
                  variant="light"
                  leftSection={<IconBrandGoogle size={16} />}
                  onClick={() => handleSocialLogin('google')}
                >
                  Continue with Google
                </Button>
              </Group>
            </Stack>
          </Card>

          <Text ta="center">
            Don&apos;t have an account?{' '}
            <Anchor
              component="button"
              type="button"
              fw={700}
              onClick={() => router.push('/register')}
            >
              Sign Up
            </Anchor>
          </Text>

          {/* <Paper p="md" radius="md" bg="blue.0" withBorder>
            <Group>
              <ThemeIcon variant="light" size="lg" color="blue" radius="xl">
                <IconShieldCheck size={rem(20)} />
              </ThemeIcon>
              <div>
                <Text size="sm" fw={500} mb={4}>
                  Secure Login
                </Text>
                <Text size="xs" c="dimmed">
                  Your connection is secure and your data is protected
                </Text>
              </div>
            </Group>
          </Paper> */}

          <Text size="xs" c="dimmed" ta="center">
            By signing in, you agree to our{' '}
            <Anchor component="button" type="button" size="xs">
              Terms of Service
            </Anchor>{' '}
            and{' '}
            <Anchor component="button" type="button" size="xs">
              Privacy Policy
            </Anchor>
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

// Main login page component with Suspense boundary
const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <Box bg="gray.0" mih="100vh">
          <Container size="xs" py="xl">
            <Card shadow="md" radius="md" p="xl" withBorder>
              <Text ta="center">Loading...</Text>
            </Card>
          </Container>
        </Box>
      }
    >
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
