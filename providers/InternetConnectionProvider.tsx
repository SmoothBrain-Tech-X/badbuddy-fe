'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; // เปลี่ยนเป็น toast library ที่ใช้

interface InternetConnectionContextType {
    isOnline: boolean;
}

const InternetConnectionContext = createContext<
    InternetConnectionContextType | undefined
>(undefined);

interface Config {
    onlineMessage?: string;
    offlineMessage?: string;
    onlineIcon?: string;
    offlineIcon?: string;
    onlineDuration?: number;
    offlineDuration?: number;
    showToast?: boolean;
}

export const InternetConnectionProvider: React.FC<{
    children: React.ReactNode;
    config?: Config;
}> = ({
    children,
    config = {},
}) => {
        const {
            onlineMessage = 'อินเทอร์เน็ตกลับมาเชื่อมต่อแล้ว',
            offlineMessage = 'ขาดการเชื่อมต่ออินเทอร์เน็ต',
            onlineIcon = '🌐',
            offlineIcon = '🚫',
            onlineDuration = 3000,
            offlineDuration = Infinity,
            showToast = true,
        } = config;

        const [isOnline, setIsOnline] = useState(navigator.onLine);

        useEffect(() => {
            const handleOnline = () => {
                setIsOnline(true);
                if (showToast) {
                    toast.success(onlineMessage, {
                        icon: onlineIcon,
                        duration: onlineDuration,
                    });
                }
            };

            const handleOffline = () => {
                setIsOnline(false);
                if (showToast) {
                    toast.error(offlineMessage, {
                        icon: offlineIcon,
                        duration: offlineDuration,
                    });
                }
            };

            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);

            return () => {
                window.removeEventListener('online', handleOnline);
                window.removeEventListener('offline', handleOffline);
            };
        }, [
            onlineMessage,
            offlineMessage,
            onlineIcon,
            offlineIcon,
            onlineDuration,
            offlineDuration,
            showToast,
        ]);

        const value = {
            isOnline,
        };

        return (
            <InternetConnectionContext.Provider value={value}>
                {children}
            </InternetConnectionContext.Provider>
        );
    };

// Custom hook สำหรับเรียกใช้ context
export const useInternetConnection = () => {
    const context = useContext(InternetConnectionContext);
    if (context === undefined) {
        throw new Error('useInternetConnection must be used within an InternetConnectionProvider');
    }
    return context;
};
