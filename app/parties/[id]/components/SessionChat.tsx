'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Card,
    Stack,
    Group,
    TextInput,
    ActionIcon,
    Avatar,
    Text,
    Paper,
    ScrollArea,
    Loader,
    Container,
    useMantineTheme
} from '@mantine/core'
import {
    IconSend,
} from '@tabler/icons-react'
import { useAuth } from '@/hooks/useAuth'

// Types and Interfaces
interface Author {
    id: string
    email: string
    first_name: string
    last_name: string
    avatar_url: string
    last_active_at: string
}

interface APIMessage {
    id: string
    chat_id: string
    autor: Author
    message: string
    timestamp: string
    edit_timestamp: string
}

interface SessionChatProps {
    sessionId: string
}

// Config
const CONFIG = {
    API_BASE_URL: 'https://general-badbuddy-be.tu4rl4.easypanel.host',
    WS_BASE_URL: 'wss://general-badbuddy-be.tu4rl4.easypanel.host',
} as const

// Message Component
const MessageCard: React.FC<{ message: APIMessage; currentUserId: string }> = ({ message, currentUserId }) => {
    const theme = useMantineTheme()
    const isOwn = message?.autor?.id == currentUserId


    return (
        <Group align="flex-start" wrap="nowrap" justify={isOwn ? 'flex-end' : 'flex-start'}>
            {!isOwn && (
                <Avatar
                    src={message.autor.avatar_url || '/api/placeholder/32/32'}
                    radius="xl"
                    size="md"
                />
            )}
            <Stack gap={2} style={{ maxWidth: '70%' }}>
                <Group justify="space-between" wrap="nowrap">
                    <Text size="xs" c="dimmed">
                        {message.autor.first_name} {message.autor.last_name}
                    </Text>
                    <Text size="xs" c="dimmed">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </Group>
                <Paper
                    p="xs"
                    radius="lg"
                    bg={isOwn ? theme.colors.blue[6] : theme.colors.gray[1]}
                    c={isOwn ? 'white' : 'dark'}
                    style={{ wordBreak: 'break-word' }}
                >
                    <Text size="sm">
                        {message.message}
                    </Text>
                </Paper>
            </Stack>

        </Group>
    )
}

// Main Chat Component
const SessionChat: React.FC<SessionChatProps> = ({ sessionId }) => {
    const theme = useMantineTheme()
    const [messages, setMessages] = useState<APIMessage[]>([])
    const [messageInput, setMessageInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
    const [chatId, setChatId] = useState<string | null>(null)
    const accessToken = typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    const { user } = useAuth()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [messages])

    // Initial scroll to bottom
    useEffect(() => {
        if (scrollAreaRef.current && !loading) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [loading])

    const connectWebSocket = useCallback(() => {
        if (!sessionId) return

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.close()
        }

        wsRef.current = new WebSocket(`${CONFIG.WS_BASE_URL}/ws/${sessionId}`)

        wsRef.current.onopen = () => {
            console.log('WebSocket Connected')
            setIsConnected(true)
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
        }

        wsRef.current.onclose = () => {
            console.log('WebSocket Disconnected')
            setIsConnected(false)
            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000)
        }

        wsRef.current.onerror = (error) => {
            console.error('WebSocket Error:', error)
            wsRef.current?.close()
        }

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                if (data.chat_massage) {
                    setMessages(prev => [...prev, data.chat_massage])
                }
                scrollToBottom()
            } catch (error) {
                console.error('Error parsing message:', error)
            }
        }
    }, [sessionId])

    useEffect(() => {
        connectWebSocket()
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
            wsRef.current?.close()
        }
    }, [connectWebSocket])


    const fetchInitialMessages = async () => {
        if (!sessionId || !accessToken) return

        try {
            setLoading(true)
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/chats/session/${sessionId}/messages`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            })

            if (!response.ok) throw new Error('Failed to fetch messages')

            const data = await response.json()
            if (data.data?.chat_massage) {
                setMessages(data.data.chat_massage)
            }
            if (data.data?.chat_id) {
                setChatId(data.data.chat_id)
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
            setError('Failed to load messages')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInitialMessages()
    }, [sessionId])

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !chatId || !accessToken) return

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/chats/${chatId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageInput.trim() })
            })

            if (!response.ok) throw new Error('Failed to send message')
            setMessageInput('')
            fetchInitialMessages() // Refresh messages after sending
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    return (
        <Card shadow="sm" radius="lg" withBorder mt={8}>
            <Stack gap="lg">

                <ScrollArea
                    h={400}
                    viewportRef={scrollAreaRef}
                    offsetScrollbars
                >
                    <Stack gap="md" p="md" justify="flex-end" style={{ minHeight: '100%' }}>
                        {messages.map((msg) => (
                            <MessageCard
                                key={msg.id}
                                message={msg}
                                currentUserId={user?.id || ''}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </Stack>
                </ScrollArea>

                <Group align="flex-end" px="md" pb="md">
                    <TextInput
                        placeholder={isConnected ? "Type a message..." : "Connecting..."}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        style={{ flex: 1 }}
                        size="md"
                        radius="xl"
                        disabled={!isConnected}
                        rightSection={
                            <ActionIcon
                                variant="filled"
                                color={isConnected ? "blue" : "gray"}
                                size={32}
                                radius="xl"
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim() || !isConnected}
                            >
                                <IconSend size={18} />
                            </ActionIcon>
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && isConnected) {
                                e.preventDefault()
                                handleSendMessage()
                            }
                        }}
                    />
                </Group>
            </Stack>
        </Card>
    )
}

export default SessionChat