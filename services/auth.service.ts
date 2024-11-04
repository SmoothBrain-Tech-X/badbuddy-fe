import Cookies from 'js-cookie';
import { AuthResponse, LoginDTO, RegisterUserDTO, User, UserProfileDTO } from '@/services';
import { Api } from '@/services/api';
import { createLocalStorage } from '@/stores/local-storage';

// Create storage instances
const storage = createLocalStorage();

export class AuthService {
  private tokenCheckInterval: NodeJS.Timeout | null = null;

  constructor(private api: Api) {
    if (typeof window !== 'undefined') {
      this.startTokenCheck();
    }
  }

  private startTokenCheck() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }

    this.tokenCheckInterval = setInterval(() => {
      if (!this.isTokenValid()) {
        this.logout();
      }
    }, 60000);
  }

  private stopTokenCheck() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
  }

  private isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const cookieToken = Cookies.get('access_token');
      const localToken = storage.get('access_token');

      // In SSR context, only check cookie
      if (typeof window === 'undefined') {
        return Boolean(cookieToken);
      }

      // In browser, token should exist in both places
      if (Boolean(cookieToken) !== Boolean(localToken)) {
        return false;
      }

      // Validate JWT structure and expiration
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp;

      if (!exp || Date.now() >= exp * 1000) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  async register(data: RegisterUserDTO): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/users/register', data);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/users/login', {
        ...data,
        email: data.email.toLowerCase().trim(),
      });

      if (!response?.access_token) {
        throw new Error('Invalid login response');
      }

      this.setToken(response.access_token, data.remember_me);
      if (typeof window !== 'undefined') {
        this.startTokenCheck();
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<UserProfileDTO> {
    try {
      if (!this.isTokenValid()) {
        this.logout();
        throw new Error('Invalid token');
      }

      const user = await this.api.get<UserProfileDTO>('/users/profile');
      if (!user) {
        throw new Error('Failed to fetch user profile');
      }
      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      if (!this.isTokenValid()) {
        this.logout();
        throw new Error('Invalid token');
      }

      const updatedUser = await this.api.put<User>('/users/profile', data);
      if (!updatedUser) {
        throw new Error('Failed to update profile');
      }
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  logout(): void {
    try {
      this.stopTokenCheck();
      this.removeToken();
      this.clearStoredData();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    } catch (error) {
      console.error('Logout error:', error);
      this.forceLogout();
    }
  }

  private setToken(token: string, rememberMe: boolean = false): void {
    try {
      const cookieOptions = {
        expires: rememberMe ? 7 : 1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/',
      };

      Cookies.set('access_token', token, cookieOptions);
      storage.set('access_token', token);

      if (rememberMe) {
        storage.set('remember_me', 'true');
      }
    } catch (error) {
      console.error('Error setting token:', error);
      throw new Error('Failed to set authentication token');
    }
  }

  private removeToken(): void {
    Cookies.remove('access_token', { path: '/' });
    this.clearStoredData();
  }

  private clearStoredData(): void {
    storage.remove('access_token');
    storage.remove('remember_me');

    if (typeof window !== 'undefined') {
      sessionStorage?.clear();
    }
  }

  private forceLogout(): void {
    try {
      this.stopTokenCheck();
      Cookies.remove('access_token', { path: '/' });
      storage.clear();

      if (typeof window !== 'undefined') {
        sessionStorage?.clear();
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    } catch (error) {
      console.error('Force logout error:', error);
    }
  }

  getToken(): string | null {
    const cookieToken = Cookies.get('access_token');
    const localToken = storage.get('access_token');

    if (typeof window === 'undefined') {
      return cookieToken || null;
    }

    if (cookieToken && localToken && cookieToken === localToken) {
      return cookieToken;
    }

    this.logout();
    return null;
  }

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }
}

// Single instance
export const authService = new AuthService(
  new Api(process.env.API_BASE_URL || 'http://localhost:8004/api')
);
