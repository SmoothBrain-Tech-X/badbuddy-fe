import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authService, LoginDTO, User } from '@/services';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  login: (data: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      isLoading: true,
      error: null,
      isAuthenticated: false,

      setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),

      login: async (data: LoginDTO) => {
        try {
          set({ error: null, isLoading: true });

          await authService.login(data);
          const profile = await authService.getProfile();

          set({
            user: profile,
            isAuthenticated: true,
            error: null,
          });

          // Handle remember me
          if (data.remember_me) {
            localStorage.setItem('remember_me', 'true');
          }
        } catch (error: any) {
          const errorMessage = error.message || 'Login failed';
          set({ error: errorMessage, isAuthenticated: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error: any) {
          set({ error: error.message || 'Logout failed' });
          throw error;
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });

          if (!authService.isAuthenticated()) {
            set({
              user: null,
              isAuthenticated: false,
            });
            return false;
          }

          const profile = await authService.getProfile();
          set({
            user: profile,
            isAuthenticated: true,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            error: 'Authentication check failed',
          });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: 'auth-store' }
  )
);
