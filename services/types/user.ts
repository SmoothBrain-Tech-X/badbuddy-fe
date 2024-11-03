export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  play_level: 'beginner' | 'intermediate' | 'advanced';
  gender: string;
  play_hand: string;
  location: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRegistrationRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  play_level: 'beginner' | 'intermediate' | 'advanced';
  gender: string;
  play_hand: string;
  location: string;
  bio?: string;
  avatar_url?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  access_token: string;
  user: User;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  play_level?: 'beginner' | 'intermediate' | 'advanced';
  location?: string;
  gender: string;
  play_hand: string;
  bio?: string;
  avatar_url?: string;
}
