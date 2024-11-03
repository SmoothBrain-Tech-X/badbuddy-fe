'use client'
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return <>{children}</>;
};