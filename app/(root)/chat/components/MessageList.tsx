import React from 'react';
import { Box, Group, Paper, Text, Avatar, Stack } from '@mantine/core';
import { ChatMessage } from '@/services';



const MessageList: React.FC<{ messages: ChatMessage[] }> = ({ messages }) => (
    <Stack p="md" gap="md">
        {messages.map((message) => (
            <Box
                key={message.id}
                w="100%"
                style={{ position: 'relative' }}
            >
                {message.type === 'system' ? (
                    <Paper
                        p="xs"
                        bg="gray.1"
                        radius="xl"
                        ta="center"
                        maw="70%"
                        mx="auto"
                    >
                        <Text size="sm" c="dimmed">{message.content}</Text>
                    </Paper>
                ) : (
                    <Group justify={!message.isOwn ? "flex-end" : "flex-start"} align="flex-end" wrap="nowrap" w="100%">
                        {/* Avatar - Only show for other's messages */}
                        {message.isOwn && (
                            <Avatar
                                size="md"
                                radius="xl"
                                src="/api/placeholder/32/32"
                                style={{ marginRight: 8 }}
                            />
                        )}

                        <Box style={{ maxWidth: '70%' }}>
                            {/* Name - Only show for other's messages */}
                            {message.isOwn && (
                                <Text size="xs" mb={4} c="dimmed">John Doe</Text>
                            )}

                            <Group gap={4} align="flex-end" wrap="nowrap">
                                {/* Timestamp and Status for Own Messages (Left side) */}
                                {!message.isOwn && (
                                    <Box style={{ minWidth: '55px', textAlign: 'right', paddingRight: 4 }}>
                                        <Stack gap={2} align="flex-end">
                                            {message.status !== 'error' && (
                                                <Text size="xs" c="dimmed">
                                                    {message.status === 'sent' && '✓'}
                                                    {message.status === 'delivered' && '✓✓'}
                                                    {message.status === 'read' && (
                                                        <Text span c="blue">✓✓</Text>
                                                    )}
                                                </Text>
                                            )}
                                            <Text size="xs" c="dimmed">
                                                {message.timestamp}
                                            </Text>
                                        </Stack>
                                    </Box>
                                )}

                                {/* Message Bubble */}
                                <Paper
                                    p="xs"
                                    style={{
                                        backgroundColor: !message.isOwn ? '#95de64' : 'white',
                                        borderRadius: message.isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                        position: 'relative',
                                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                        maxWidth: '100%',
                                        wordBreak: 'break-word',
                                        marginLeft: message.isOwn ? 0 : '4px',
                                        marginRight: message.isOwn ? '4px' : 0
                                    }}
                                >
                                    <Text
                                        size="sm"
                                        style={{
                                            lineHeight: 1.4,
                                            color: '#2C2C2C',
                                            padding: '2px 4px'
                                        }}
                                    >
                                        {message.content}
                                    </Text>

                                    {/* Error Icon */}
                                    {message.status === 'error' && (
                                        <Box
                                            style={{
                                                position: 'absolute',
                                                right: -24,
                                                bottom: 0,
                                                color: 'red'
                                            }}
                                        >
                                            ⚠️
                                        </Box>
                                    )}
                                </Paper>

                                {/* Timestamp and Status for Others' Messages (Right side) */}
                                {message.isOwn && (
                                    <Box style={{ minWidth: '55px', paddingLeft: 4 }}>
                                        <Stack gap={2}>
                                            {message.status !== 'error' && (
                                                <Text size="xs" c="dimmed">
                                                    {message.status === 'sent' && '✓'}
                                                    {message.status === 'delivered' && '✓✓'}
                                                    {message.status === 'read' && (
                                                        <Text span c="blue">✓✓</Text>
                                                    )}
                                                </Text>
                                            )}
                                            <Text size="xs" c="dimmed">
                                                {message.timestamp}
                                            </Text>
                                        </Stack>
                                    </Box>
                                )}
                            </Group>
                        </Box>
                    </Group>
                )}
            </Box>
        ))}
    </Stack>
);

export default MessageList;