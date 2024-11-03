import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

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

export class Api {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
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

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (!response || !response.data) {
          return Promise.reject(new Error('Empty response received from server'));
        }
        return response;
      },
      (error: AxiosError<ApiErrorResponse>) => {
        // Only handle token removal for 401, but still reject the promise
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<T>(url, config).then((response) => response.data);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T>(url, data, config).then((response) => response.data);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<T>(url, data, config).then((response) => response.data);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<T>(url, config).then((response) => response.data);
  }
}

const apiBaseUrl = 'http://localhost:8004/api';
if (!apiBaseUrl) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

export const api = new Api(apiBaseUrl);

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface SearchParams extends PaginationParams {
  q?: string;
}
