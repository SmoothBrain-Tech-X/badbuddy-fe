'use client';
import { useState } from 'react';
import {
    Group,
    Button,
    Box,
    Burger,
    Drawer,
    ScrollArea,
    Divider,
    Stack,
    Text,
    Avatar,
    Menu,
    ActionIcon,
    Badge,
    Paper,
    UnstyledButton,
    rem,
} from '@mantine/core';
import {
    IconHome,
    IconCalendarEvent,
    IconMapPin,
    IconMessage,
    IconSearch,
    IconLogout,
    IconSettings,
    IconUserCircle,
    IconChevronDown,
    IconPlus,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
    user?: {
        name: string;
        email: string;
        avatar: string;
    };
}

const Navbar = ({ user }: NavbarProps) => {
    const router = useRouter();
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    const mainLinks = [
        { label: 'Home', icon: IconHome, href: '/home' },
        { label: 'Parties', icon: IconCalendarEvent, href: '/parties' },
        { label: 'Venues', icon: IconMapPin, href: '/venues' },
        { label: 'Messages', icon: IconMessage, href: '/chat', badge: 3 },
    ];

    const userLinks = [
        { label: 'Profile', icon: IconUserCircle, href: '/profile' },
        { label: 'Settings', icon: IconSettings, href: '/settings' },
        { label: 'Sign out', icon: IconLogout, href: '/logout', color: 'red' },
    ];

    return (
        <Box>
            <Paper
                shadow="sm"
                p="md"
                withBorder
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: 'var(--mantine-color-body)',
                }}
            >
                <Group justify="space-between" h={rem(50)}>
                    <Group>
                        <Box mr="xl">
                            <Text size="xl" fw={700} c="blue">
                                Badbuddy
                            </Text>
                        </Box>

                        {/* Desktop Navigation Links */}
                        <Group gap="md" visibleFrom="sm">
                            {mainLinks.map((link) => (
                                <UnstyledButton
                                    key={link.label}
                                    onClick={() => {
                                        router.push(link.href);
                                    }}
                                >
                                    <Group gap="xs">
                                        <link.icon size={20} />
                                        <Text size="sm" fw={500}>
                                            {link.label}
                                        </Text>
                                        {link.badge && (
                                            <Badge size="xs" variant="filled" color="red">
                                                {link.badge}
                                            </Badge>
                                        )}
                                    </Group>
                                </UnstyledButton>
                            ))}
                        </Group>
                    </Group>

                    <Group>
                        {/* Search Button */}
                        <ActionIcon variant="light" size="lg" visibleFrom="sm">
                            <IconSearch size={20} />
                        </ActionIcon>

                        <Button
                            leftSection={<IconPlus size={20} />}
                            visibleFrom="sm"
                        >
                            Create Party
                        </Button>

                        {user ? (
                            <Menu
                                width={260}
                                position="bottom-end"
                                transitionProps={{ transition: 'pop-top-right' }}
                                onClose={() => setUserMenuOpened(false)}
                                onOpen={() => setUserMenuOpened(true)}
                                withinPortal
                            >
                                <Menu.Target>
                                    <UnstyledButton>
                                        <Group gap={7}>
                                            <Avatar src={user.avatar} alt={user.name} radius="xl" size={30} />
                                            <Text fw={500} size="sm" visibleFrom="sm">
                                                {user.name}
                                            </Text>
                                            <IconChevronDown size={rem(12)} stroke={1.5} />
                                        </Group>
                                    </UnstyledButton>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item>
                                        <Group>
                                            <Avatar src={user.avatar} radius="xl" />
                                            <div>
                                                <Text fw={500}>{user.name}</Text>
                                                <Text size="xs" c="dimmed">{user.email}</Text>
                                            </div>
                                        </Group>
                                    </Menu.Item>

                                    <Menu.Divider />

                                    {userLinks.map((link) => (
                                        <Menu.Item
                                            key={link.label}
                                            leftSection={<link.icon size={16} />}
                                            color={link.color}
                                        >
                                            {link.label}
                                        </Menu.Item>
                                    ))}
                                </Menu.Dropdown>
                            </Menu>
                        ) : (
                            <Group gap="xs" visibleFrom="sm">
                                <Button variant="default" onClick={() => {
                                    router.push('/login');
                                }}
                                >
                                    Log in
                                </Button>
                                <Button
                                    onClick={() => {
                                        router.push('/register');
                                    }}
                                >Sign up
                                </Button>
                            </Group>
                        )}

                        <Burger
                            opened={drawerOpened}
                            onClick={() => setDrawerOpened(true)}
                            hiddenFrom="sm"
                        />
                    </Group>
                </Group>
            </Paper>

            <Drawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000}
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`}>
                    <Divider my="sm" />

                    <Stack>
                        {mainLinks.map((link) => (
                            <UnstyledButton
                                key={link.label}
                                onClick={() => {
                                    console.log(`Navigate to ${link.href}`);
                                    setDrawerOpened(false);
                                }}
                            >
                                <Group>
                                    <link.icon size={20} />
                                    <Text size="sm" fw={500}>
                                        {link.label}
                                    </Text>
                                    {link.badge && (
                                        <Badge size="xs" variant="filled" color="red">
                                            {link.badge}
                                        </Badge>
                                    )}
                                </Group>
                            </UnstyledButton>
                        ))}

                        <Divider my="sm" />

                        <Button
                            leftSection={<IconPlus size={20} />}
                            fullWidth
                        >
                            Create Party
                        </Button>

                        {!user && (
                            <>
                                <Divider my="sm" />
                                <Group grow>
                                    <Button variant="default" onClick={() => {
                                        router.push('/login');
                                    }}
                                    >
                                        Log in
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            router.push('/register');
                                        }}
                                    >Sign up
                                    </Button>
                                </Group>
                            </>
                        )}
                    </Stack>
                </ScrollArea>
            </Drawer>
        </Box>
    );
};

export default Navbar;
