import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';

export interface ApiErrorResponse {
  error: string;
  status: number;
  data?: any;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class Api {
  private instance: AxiosInstance;
  private authCheckInProgress: boolean = false;
  private tokenCheckInterval: NodeJS.Timeout | null = null;

  constructor(baseURL: string) {
    this.startTokenCheck();

    if (!baseURL) {
      throw new Error('API base URL is required');
    }

    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private checkAuth(): boolean {
    const token = this.getToken();
    if (!token && !this.authCheckInProgress) {
      this.authCheckInProgress = true;
      // Dispatch auth error event
      window.dispatchEvent(new CustomEvent('auth:required'));
      this.logout();
      this.authCheckInProgress = false;
      return false;
    }
    return true;
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Skip auth check for login and register endpoints
        const isAuthEndpoint =
          config.url?.includes('/users/login') || config.url?.includes('/users/register');

        if (!isAuthEndpoint) {
          // Check authentication before making request
          if (!this.checkAuth()) {
            return Promise.reject(new UnauthorizedError());
          }

          const token = this.getToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error: AxiosError<ApiErrorResponse>) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (!response || !response.data) {
          throw new ApiError(500, 'Empty response received from server');
        }
        return response;
      },
      (error: AxiosError<ApiErrorResponse>) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError<ApiErrorResponse>): Error {
    if (error instanceof UnauthorizedError) {
      return error;
    }

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error || error.message;
      const data = error.response.data;

      // Handle specific status codes
      switch (status) {
        case 401:
          return new UnauthorizedError(message);

        case 403:
          return new ApiError(status, 'Access denied', data);

        case 404:
          return new ApiError(status, 'Resource not found', data);

        case 422:
          return new ApiError(status, 'Validation error', data);

        default:
          if (status >= 500) {
            return new ApiError(status, 'Server error', data);
          }
          return new ApiError(status, message, data);
      }
    }

    if (error.request) {
      // Network error
      return new ApiError(0, 'Network error, please check your connection');
    }

    return new ApiError(500, error.message);
  }

  private async makeRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      let response;

      switch (method) {
        case 'get':
          response = await this.instance.get<T>(url, config);
          break;
        case 'post':
          response = await this.instance.post<T>(url, data, config);
          break;
        case 'put':
          response = await this.instance.put<T>(url, data, config);
          break;
        case 'delete':
          response = await this.instance.delete<T>(url, config);
          break;
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  // Public API methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('get', url, undefined, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('post', url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('put', url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('delete', url, undefined, config);
  }

  logout(): void {
    try {
      this.stopTokenCheck(); // Stop token checking
      this.removeToken();
      this.clearStoredData();

      // Dispatch a custom event that can be listened to by the app
      window.dispatchEvent(new CustomEvent('auth:logout'));
    } catch (error) {
      console.error('Logout error:', error);
      this.forceLogout();
    }
  }
  getToken(): string | null {
    // Check both storage locations and ensure they match
    const cookieToken = Cookies.get('access_token');
    const localToken = localStorage.getItem('access_token');

    if (cookieToken && localToken && cookieToken === localToken) {
      return cookieToken;
    }

    // If tokens don't match or one is missing, clear everything and return null
    this.logout();
    return null;
  }
  private removeToken(): void {
    Cookies.remove('access_token', { path: '/' });
    this.clearStoredData();
  }

  private isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Check both storage locations
      const cookieToken = Cookies.get('access_token');
      const localToken = localStorage.getItem('access_token');

      // Token should exist in both places or neither
      if (Boolean(cookieToken) !== Boolean(localToken)) {
        return false;
      }

      // Try to decode the JWT to check if it's valid
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp;

      // Check if token has expiration and isn't expired
      if (!exp || Date.now() >= exp * 1000) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
  private startTokenCheck() {
    // Clear existing interval if any
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }

    // Check token every minute
    this.tokenCheckInterval = setInterval(() => {
      if (!this.isTokenValid()) {
        this.logout();
      }
    }, 60000); // every minute
  }
  private stopTokenCheck() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
  }
  private clearStoredData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('remember_me');
    sessionStorage.clear();
  }

  private forceLogout(): void {
    try {
      this.stopTokenCheck();
      Cookies.remove('access_token', { path: '/' });
      localStorage.clear();
      sessionStorage.clear();
      window.dispatchEvent(new CustomEvent('auth:logout'));
    } catch (error) {
      console.error('Force logout error:', error);
    }
  }
}

// Environment check and instance creation
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8004/api';
if (!apiBaseUrl) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

export const api = new Api(apiBaseUrl);
