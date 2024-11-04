'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  IconArrowLeft,
  IconCalendar,
  IconCheck,
  IconChevronRight,
  IconCrown,
  IconMapPin,
  IconMessageCircle,
  IconUsers,
  IconX,
} from '@tabler/icons-react';
import { AxiosError } from 'axios';
import {
  ActionIcon,
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
import useUpdateUserSession from '@/hooks/react-query/session/useUpdateUserSession';
import { useAuth } from '@/hooks/useAuth';
import { sessionService } from '@/services';
import FeeCard from './components/FeeCard';
import ParticipantCard from './components/ParticipantCard';
import ParticipantsProgress from './components/ParticipantsProgress';
import SessionChat from './components/SessionChat';

const PartyView: React.FC = () => {
  const params = useParams();
  const auth = useAuth();
  const sessionId = params.id as string;
  const [Count, setCount] = useState(0);
  const getSession = useGetSession({ session_id: sessionId }, Count);
  const joinSession = useJoinSession();
  const leaveSession = useLeaveSession();
  const updateUserSession = useUpdateUserSession();

  const isJoin = () => {
    return getSession.data?.data.participants.find((item) => item.user_id === auth.user?.id)
      ? true
      : false;
  };

  const checkDisabled = () => {
    if (
      getSession.data?.data.participants.find(
        (item) => item.user_id === auth.user?.id && item.status === 'cancelled'
      )
    ) {
      return true;
    }

    //check party full
    if (getSession.data?.data.confirmed_players === getSession.data?.data.max_participants) {
      return true;
    }

    // is owner
    if (getSession.data?.data.host_id === auth.user?.id) {
      return true;
    }

    return false;
  };

  const isOwner = () => {
    return getSession.data?.data.host_id === auth.user?.id;
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

  const onApprove = (user_id: string) => {
    modals.openConfirmModal({
      ...ConfirmModalData,
      children: `Are you sure you want to confirmed this user?`,
      onConfirm: () => {
        updateUserSession.mutate(
          { session_id: sessionId, user_id, status: 'confirmed' },
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

  const onCancel = (user_id: string) => {
    modals.openConfirmModal({
      ...ConfirmModalData,
      children: `Are you sure you want to cancel this user?`,
      onConfirm: () => {
        updateUserSession.mutate(
          { session_id: sessionId, user_id, status: 'cancelled' },
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
    <>
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
              <Card radius="lg" p={0} withBorder className="overflow-hidden">
                <Stack p="xl" gap="xl">
                  {/* Info Grid */}
                  <Text size="xl" fw={500}>
                    {getSession.data?.data.title}
                  </Text>
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
                          withBorder
                          p="lg"
                          className={`h-32 flex flex-col items-center justify-center text-center rounded-xl bg-gradient-to-br from-${item.color}-50 to-white hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}
                        >
                          <item.icon
                            className={`w-8 h-8 mb-3 text-${item.color}-500`}
                            strokeWidth={1.5}
                          />
                          <div className="text-sm font-medium text-gray-500 mb-1.5">
                            {item.label}
                          </div>
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
              <Card radius="md" withBorder mt="md">
                <Tabs defaultValue="chat">
                  <Tabs.List>
                    <Tabs.Tab value="chat" leftSection={<IconMessageCircle size={16} />}>
                      Chat
                    </Tabs.Tab>
                    <Tabs.Tab value="participants" leftSection={<IconUsers size={16} />}>
                      Participants
                    </Tabs.Tab>
                    {isOwner() && (
                      <Tabs.Tab value="approve" leftSection={<IconCheck size={16} />}>
                        Approve
                      </Tabs.Tab>
                    )}
                  </Tabs.List>

                  <Tabs.Panel value="chat">
                    <SessionChat sessionId={sessionId} isDisabled={!isJoin()} />
                  </Tabs.Panel>

                  <Tabs.Panel value="participants">
                    <ScrollArea h={400} offsetScrollbars>
                      <Stack gap="xs" p="md">
                        {getSession.data?.data.participants?.map((participant) => (
                          <ParticipantCard participant={participant} />
                        ))}
                      </Stack>
                    </ScrollArea>
                  </Tabs.Panel>
                  {isOwner() && (
                    <Tabs.Panel value="approve">
                      <Stack gap="xs" p="md">
                        {getSession.data?.data.participants
                          .filter((participant) => participant.status === 'pending')
                          .map((participant, index) => (
                            <Card className="flex" withBorder key={index}>
                              <Group justify="space-between">
                                <Group>
                                  <Text>{participant.user_name}</Text>
                                  <Text size="sm" c="dimmed">
                                    {participant.status}
                                  </Text>
                                </Group>
                                <Group>
                                  <ActionIcon
                                    variant="light"
                                    color="green"
                                    onClick={() => onApprove(participant.user_id)}
                                  >
                                    <IconCheck size={16} />
                                  </ActionIcon>
                                  <ActionIcon variant="light" color="red">
                                    <IconX
                                      size={16}
                                      onClick={() => onCancel(participant.user_id)}
                                    />
                                  </ActionIcon>
                                </Group>
                              </Group>
                            </Card>
                          ))}
                      </Stack>
                    </Tabs.Panel>
                  )}
                </Tabs>
              </Card>
            </Grid.Col>

            {/* Sidebar */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card radius="md" withBorder style={{ position: 'sticky', top: 20 }}>
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
                    current={getSession.data?.data.confirmed_players ?? 0}
                    max={getSession.data?.data.max_participants ?? 0}
                  />

                  <FeeCard price={`฿${getSession.data?.data.cost_per_person}/person`} />
                  {isJoin() ? (
                    <Button disabled={checkDisabled()} onClick={onLeave}>
                      Leave
                    </Button>
                  ) : (
                    <Button disabled={checkDisabled()} onClick={onJoin}>Join</Button>
                  )}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default PartyView;
