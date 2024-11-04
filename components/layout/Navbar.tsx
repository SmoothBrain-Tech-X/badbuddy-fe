'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconCalendar,
  IconCalendarEvent,
  IconChevronDown,
  IconHome,
  IconLogout,
  IconMapPin,
  IconMessage,
  IconPlus,
  IconSearch,
  IconSettings,
  IconUserCircle,
  IconUsers,
} from '@tabler/icons-react';
import toast from 'react-hot-toast';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Burger,
  Button,
  Dialog,
  Divider,
  Drawer,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  Paper,
  rem,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  console.log('isAuthenticated', isAuthenticated);

  const mainLinks = [
    { label: 'Home', icon: IconHome, href: '/home', protected: true },
    { label: 'Parties', icon: IconCalendarEvent, href: '/parties', protected: true },
    { label: 'Venues', icon: IconMapPin, href: '/venues', protected: true },
    // { label: 'Messages', icon: IconMessage, href: '/chat', badge: 3, protected: true },
  ];

  const userLinks = [
    {
      label: 'Profile',
      icon: IconUserCircle,
      href: '/profile',
      onClick: () => handleNavigation('/profile'),
    },
    {
      label: 'My Bookings',
      icon: IconCalendar,
      href: '/bookings',
      onClick: () => handleNavigation('/bookings'),
    },
    {
      label: 'My Parties',
      icon: IconUsers,
      href: '/parties/manage',
      onClick: () => handleNavigation('/parties/manage'),
    },
    {
      label: 'Settings',
      icon: IconSettings,
      href: '/settings',
      onClick: () => handleNavigation('/settings'),
    },
    {
      label: 'Sign out',
      icon: IconLogout,
      color: 'red',
      onClick: () => setShowLogoutConfirm(true),
    },
  ];

  async function handleLogout() {
    try {
      setIsNavigating(true);
      setShowLogoutConfirm(false);
      await logout();
      router.push('/login');
    } catch (error) {
      toast.error('Error logging out');
    } finally {
      setIsNavigating(false);
    }
  }

  const handleNavigation = (href: string) => {
    setIsNavigating(true);
    router.push(href);
  };

  const handleCreateParty = () => {
    if (!isAuthenticated) {
      toast.error('Please login to create a party');
      router.push('/login');
      return;
    }
    handleNavigation('/parties/create');
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setIsNavigating(false);
      setDrawerOpened(false);
    };

    // Clean up navigation state after timeout
    if (isNavigating) {
      const timer = setTimeout(() => setIsNavigating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  return (
    <Box>
      <LoadingOverlay
        visible={isNavigating || isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 5 }}
        loaderProps={{ color: 'blue', type: 'bars' }}
      />

      <Modal
        opened={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Confirm Sign Out"
        centered
        size="sm"
      >
        <Text size="sm" mb="lg">
          Are you sure you want to sign out?
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="light" onClick={() => setShowLogoutConfirm(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleLogout}>
            Sign Out
          </Button>
        </Group>
      </Modal>

      <Paper
        radius={0}
        p="md"
        style={{
          top: 0,
          left: 0,
          position: 'fixed',
          right: 0,
          zIndex: 1000,
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        <Group justify="space-between" h={rem(50)}>
          <Group>
            <Box mr="xl">
              <Text
                size="xl"
                fw={700}
                c="blue"
                style={{ cursor: 'pointer' }}
                onClick={() => handleNavigation('/')}
              >
                Badbuddy
              </Text>
            </Box>

            {/* Desktop Navigation Links */}
            <Group gap="md" visibleFrom="sm">
              {mainLinks.map(
                (link) =>
                  (!link.protected || isAuthenticated) && (
                    <UnstyledButton key={link.label} onClick={() => handleNavigation(link.href)}>
                      <Group gap="xs">
                        <link.icon size={20} />
                        <Text size="sm" fw={500}>
                          {link.label}
                        </Text>
                      </Group>
                    </UnstyledButton>
                  )
              )}
            </Group>
          </Group>

          <Group>
            {/* Search Button */}
            <ActionIcon
              variant="light"
              size="lg"
              visibleFrom="sm"
              onClick={() => handleNavigation('/search')}
            >
              <IconSearch size={20} />
            </ActionIcon>

            <Button
              variant="gradient"
              leftSection={<IconPlus size={20} />}
              visibleFrom="sm"
              onClick={handleCreateParty}
            >
              Create Party
            </Button>

            {isAuthenticated && user ? (
              <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
                styles={{
                  dropdown: { marginTop: 20 },
                }}
              >
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap={7}>
                      <Avatar
                        src={user.avatar_url}
                        alt={user.first_name + ' ' + user.last_name}
                        radius="xl"
                        size={30}
                      />
                      <Text fw={500} size="sm" visibleFrom="sm">
                        {user.first_name}
                      </Text>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>
                    <Group>
                      <Avatar src={user.avatar_url} radius="xl" />
                      <div>
                        <Text fw={500}>{user.first_name}</Text>
                        <Text size="xs" c="dimmed">
                          {user.email}
                        </Text>
                      </div>
                    </Group>
                  </Menu.Item>

                  <Menu.Divider />

                  {userLinks.map((link) => (
                    <Menu.Item
                      key={link.label}
                      leftSection={<link.icon size={16} />}
                      onClick={link.onClick}
                      color={link.color}
                    >
                      {link.label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Group gap="xs" visibleFrom="sm">
                <Button variant="default" onClick={() => handleNavigation('/login')}>
                  Log in
                </Button>
                <Button onClick={() => handleNavigation('/register')}>Sign up</Button>
              </Group>
            )}

            <Burger opened={drawerOpened} onClick={() => setDrawerOpened(true)} hiddenFrom="sm" />
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
            {mainLinks.map(
              (link) =>
                (!link.protected || isAuthenticated) && (
                  <UnstyledButton key={link.label} onClick={() => handleNavigation(link.href)}>
                    <Group>
                      <link.icon size={20} />
                      <Text size="sm" fw={500}>
                        {link.label}
                      </Text>
                    </Group>
                  </UnstyledButton>
                )
            )}

            <Divider my="sm" />

            <Button
              variant="gradient"
              leftSection={<IconPlus size={20} />}
              fullWidth
              onClick={handleCreateParty}
            >
              Create Party
            </Button>

            {!isAuthenticated && (
              <>
                <Divider my="sm" />
                <Group grow>
                  <Button variant="default" onClick={() => handleNavigation('/login')}>
                    Log in
                  </Button>
                  <Button onClick={() => handleNavigation('/register')}>Sign up</Button>
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
