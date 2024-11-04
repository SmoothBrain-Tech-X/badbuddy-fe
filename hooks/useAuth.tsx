import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { LoginDTO } from '@/services';
import { useAuthStore } from '@/stores/auth.store';

interface AuthError extends Error {
    code?: string;
    status?: number;
}

export function useAuth() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {
        user,
        isLoading,
        error,
        isAuthenticated,
        tokenExpiresAt,
        login: storeLogin,
        logout: storeLogout,
        checkAuth,
        clearError,
    } = useAuthStore();

    const handleAuthError = useCallback((error: AuthError, action: string) => {
        console.error(`${action} error:`, error);

        let errorMessage = 'An unexpected error occurred';

        if (error.status === 401) {
            errorMessage = 'Session expired. Please login again.';
            storeLogout();
        } else if (error.status === 403) {
            errorMessage = 'Access denied. Please check your permissions.';
        } else if (error.code === 'NETWORK_ERROR') {
            errorMessage = 'Network error. Please check your connection.';
        }

        toast.error(errorMessage);
    }, [storeLogout]);

    useEffect(() => {
        const loadingToast = toast.loading('Checking authentication...');

        checkAuth().finally(() => {
            toast.dismiss(loadingToast);
        });

        // Calculate time until token expires
        const setupTokenCheck = () => {
            if (tokenExpiresAt) {
                const timeUntilExpiry = tokenExpiresAt - Date.now() - (5 * 60 * 1000); // 5 minutes before expiry
                if (timeUntilExpiry > 0) {
                    return setTimeout(() => {
                        toast.error('Your session is about to expire. Please login again.');
                        storeLogout();
                    }, timeUntilExpiry);
                }
            }
        };

        const tokenCheckTimeout = setupTokenCheck();

        // Periodic light check
        const checkInterval = setInterval(() => {
            checkAuth();
        }, 5 * 60 * 1000); // Check every 5 minutes

        return () => {
            clearInterval(checkInterval);
            if (tokenCheckTimeout) clearTimeout(tokenCheckTimeout);
        };
    }, [checkAuth, tokenExpiresAt, storeLogout]);

    const login = async (data: LoginDTO): Promise<void> => {
        const loadingToast = toast.loading('Signing in...');
        try {
            await storeLogin(data);
            toast.success('Successfully signed in!');
            router.push('/home');
        } catch (error) {
            handleAuthError(error as AuthError, 'Login');
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const logout = async (): Promise<void> => {
        const loadingToast = toast.loading('Signing out...');
        try {
            await storeLogout();
            toast.success('Successfully signed out');
            router.push('/login');
        } catch (error) {
            handleAuthError(error as AuthError, 'Logout');
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    return {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        error,
        clearError,
    };
}