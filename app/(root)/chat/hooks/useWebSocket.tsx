import { useCallback, useEffect, useRef, useState } from 'react';
const CONFIG = {
    API_BASE_URL: 'https://general-badbuddy-be.tu4rl4.easypanel.host',
    WS_BASE_URL: 'wss://general-badbuddy-be.tu4rl4.easypanel.host',
    CURRENT_USER_ID: '4bce920d-9350-42fd-b9ce-9ea2ddf2fe24',
} as const;




const useWebSocket = (chatId: string | null) => {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

    const connect = useCallback(() => {
        if (!chatId) return;

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }

        wsRef.current = new WebSocket(`${CONFIG.WS_BASE_URL}/ws/${chatId}`);

        wsRef.current.onopen = () => {
            setIsConnected(true);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };

        wsRef.current.onclose = () => {
            setIsConnected(false);
            reconnectTimeoutRef.current = setTimeout(connect, 5000);
        };

        wsRef.current.onerror = () => {
            wsRef.current?.close();
        };
    }, [chatId]);

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            wsRef.current?.close();
        };
    }, [connect]);

    const sendMessage = useCallback((content: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ message: content }));
            return true;
        }
        return false;
    }, []);

    return { isConnected, sendMessage };
};

export { useWebSocket }