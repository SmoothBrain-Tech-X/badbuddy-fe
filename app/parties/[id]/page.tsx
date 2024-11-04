'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  IconArrowLeft,
  IconCalendar,
  IconChevronRight,
  IconCrown,
  IconMapPin,
  IconMessageCircle,
  IconUsers,
} from '@tabler/icons-react';
import { AxiosError } from 'axios';
import {
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { ConfirmModalData } from '@/configs/ModalData/ModalData';
import {
  ErrorNotificationData,
  SuccessNotificationData,
} from '@/configs/NotificationData/NotificationData';
import useGetSession from '@/hooks/react-query/session/useGetSession';
import useJoinSession from '@/hooks/react-query/session/useJoinSession';
import useLeaveSession from '@/hooks/react-query/session/useLeaveSession';
import { useAuth } from '@/hooks/useAuth';
import { sessionService } from '@/services';
import FeeCard from './components/FeeCard';
import ParticipantCard from './components/ParticipantCard';
import ParticipantsProgress from './components/ParticipantsProgress';
import SessionChat from './components/SessionChat';

type JoinStatus = 'host' | 'confirmed' | 'pending' | 'cancelled' | 'not_joined';

interface Host {
  name: string;
  avatar: string;
  hostedParties: number;
}

interface Message {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

const PartyView: React.FC = () => {
  const params = useParams();
  const auth = useAuth();
  const sessionId = params.id as string;

  const getSession = useGetSession({ session_id: sessionId });
  const joinSession = useJoinSession();
  const leaveSession = useLeaveSession();

  const isJoin = () => {
    return getSession.data?.data.participants.find((item) => item.user_id === auth.user?.id)
      ? true
      : false;
  };

  const checkDisabled = () => {
    return getSession.data?.data.participants.find(
      (item) => item.user_id === auth.user?.id && item.status === 'cancelled'
    )
      ? true
      : false;
  };

  const onJoin = () => {
    modals.openConfirmModal({
      ...ConfirmModalData,
      children: 'Are you sure you want to join this session?',
      onConfirm: () => {
        joinSession.mutate(
          { session_id: sessionId },
          {
            onSuccess: () => {
              notifications.show(SuccessNotificationData);
              getSession.refetch();
            },
            onError: (error) => {
              if (error instanceof AxiosError) {
                notifications.show({
                  ...ErrorNotificationData,
                  message: error.message,
                });
              }
            },
          }
        );
      },
    });
  };

  const onLeave = () => {
    modals.openConfirmModal({
      ...ConfirmModalData,
      children: 'Are you sure you want to leave this session?',
      onConfirm: () => {
        leaveSession.mutate(
          { session_id: sessionId },
          {
            onSuccess: () => {
              notifications.show(SuccessNotificationData);
              getSession.refetch();
            },
            onError: (error) => {
              if (error instanceof AxiosError) {
                notifications.show({
                  ...ErrorNotificationData,
                  message: error.message,
                });
              }
            },
          }
        );
      },
    });
  };

  return (
    <Box bg="gray.0" mih="100vh">
      <Container size="xl" py="xl">
        <Breadcrumbs mb="lg" separator={<IconChevronRight size={16} />}>
          <Anchor
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            <Group gap="xs">
              <IconArrowLeft size={16} />
              <span>Home</span>
            </Group>
          </Anchor>
          <Text>Badminton</Text>
        </Breadcrumbs>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 8 }}>
            {/* Main Content Card */}
            <Card shadow="sm" radius="lg" p={0} withBorder className="overflow-hidden">
              <Stack p="xl" gap="xl">
                {/* Info Grid */}
                <Grid gutter="lg">
                  {[
                    {
                      icon: IconMapPin,
                      label: 'Venue',
                      value: `${getSession.data?.data.venue_name}\n${getSession.data?.data.venue_location}`,
                      color: 'emerald',
                    },
                    {
                      icon: IconCalendar,
                      label: 'Date & Time',
                      value: `${getSession.data?.data.start_time} - ${getSession.data?.data.end_time}`,
                      color: 'blue',
                    },
                  ].map((item, index) => (
                    <Grid.Col span={{ base: 12, sm: 6, md: 6 }} key={index}>
                      <Paper
                        shadow="sm"
                        p="lg"
                        className={`h-32 flex flex-col items-center justify-center text-center rounded-xl bg-gradient-to-br from-${item.color}-50 to-white hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}
                      >
                        <item.icon
                          className={`w-8 h-8 mb-3 text-${item.color}-500`}
                          strokeWidth={1.5}
                        />
                        <div className="text-sm font-medium text-gray-500 mb-1.5">{item.label}</div>
                        <div className="text-lg font-bold text-gray-800 whitespace-pre-line">
                          {item.value}
                        </div>
                      </Paper>
                    </Grid.Col>
                  ))}
                </Grid>

                {/* Description */}
                <Box>
                  <Text fw={600} mb="xs" size="lg" className="text-gray-800">
                    Description
                  </Text>
                  <Paper p="md" radius="md" className="bg-blue-50 border border-blue-100">
                    <Text className="text-gray-700">{getSession.data?.data.description}</Text>
                  </Paper>
                </Box>
              </Stack>
            </Card>
            <Card shadow="sm" radius="md" withBorder mt="md">
              <Tabs defaultValue="chat">
                <Tabs.List>
                  <Tabs.Tab value="chat" leftSection={<IconMessageCircle size={16} />}>
                    Chat
                  </Tabs.Tab>
                  <Tabs.Tab value="participants" leftSection={<IconUsers size={16} />}>
                    Participants
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="chat">
                  <SessionChat sessionId={sessionId} />
                </Tabs.Panel>

                <Tabs.Panel value="participants">
                  <ScrollArea h={400} offsetScrollbars>
                    <Stack gap="xs" p="md">
                      {getSession.data?.data.participants.map((participant) => (
                        <ParticipantCard participant={participant} />
                      ))}
                    </Stack>
                  </ScrollArea>
                </Tabs.Panel>
              </Tabs>
            </Card>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" radius="md" withBorder>
              <Card.Section p="md" bg="blue.0">
                <Group>
                  <div>
                    <Badge leftSection={<IconCrown size={12} />} color="blue" mb="xs">
                      Host
                    </Badge>
                    <Text fw={500}>{getSession.data?.data.host_name}</Text>
                    <Text size="sm" c="dimmed">
                      {getSession.data?.data.host_level} Level
                    </Text>
                  </div>
                </Group>
              </Card.Section>

              <Stack p="md" gap="md">
                <ParticipantsProgress
                  current={getSession.data?.data.participants.length ?? 0}
                  max={getSession.data?.data.max_participants ?? 0}
                />

                <FeeCard price={`฿${getSession.data?.data.cost_per_person}/person`} />
                {isJoin() ? (
                  <Button disabled={checkDisabled()} onClick={onLeave}>
                    Leave
                  </Button>
                ) : (
                  <Button onClick={onJoin}>Join</Button>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default PartyView;
