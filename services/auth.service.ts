// src/services/auth.ts
import Cookies from 'js-cookie';
import { AuthResponse, LoginDTO, RegisterUserDTO, User } from '@/services';
import { Api } from '@/services/api';

export class AuthService {
  constructor(private api: Api) {}

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
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const user = await this.api.get<User>('/users/profile');
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
      this.removeToken();
      this.clearStoredData();
    } catch (error) {
      console.error('Logout error:', error);
      this.forceLogout();
    }
  }

  private setToken(token: string, rememberMe: boolean = false): void {
    try {
      // Set token in both cookie and localStorage
      const cookieOptions = {
        expires: rememberMe ? 7 : 1, // 7 days if remember me, 1 day if not
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/',
      };

      Cookies.set('access_token', token, cookieOptions);
      localStorage.setItem('access_token', token);

      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('remember_me');
    sessionStorage.clear();
  }

  private forceLogout(): void {
    try {
      Cookies.remove('access_token', { path: '/' });
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Force logout error:', error);
    }
  }

  getToken(): string | null {
    return Cookies.get('access_token') || localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Create a single instance
export const authService = new AuthService(
  new Api(process.env.API_BASE_URL || 'http://localhost:8004/api')
);
