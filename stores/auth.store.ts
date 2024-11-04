// stores/auth.store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authService, LoginDTO, UserProfileDTO } from '@/services';

interface AuthState {
  user: UserProfileDTO | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  lastProfileFetch: number;
  tokenExpiresAt: number | null;
  setUser: (user: UserProfileDTO | null) => void;
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
      isLoading: true, // Start with loading true
      error: null,
      isAuthenticated: false,
      lastProfileFetch: 0,
      tokenExpiresAt: null,

      setUser: (user: UserProfileDTO | null) => set({ user, isAuthenticated: !!user }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),

      login: async (data: LoginDTO) => {
        try {
          set({ error: null, isLoading: true });

          // Login and get token
          await authService.login(data);

          // Get user profile
          const profile = await authService.getProfile();

          set({
            user: profile,
            isAuthenticated: true,
            error: null,
            lastProfileFetch: Date.now(),
          });

          if (data.remember_me) {
            localStorage.setItem('remember_me', 'true');
          }
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isAuthenticated: false,
            user: null,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            lastProfileFetch: 0,
            tokenExpiresAt: null,
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

          // Get fresh profile if needed
          const profile = await authService.getProfile();
          set({
            user: profile,
            isAuthenticated: true,
            error: null,
            lastProfileFetch: Date.now(),
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
