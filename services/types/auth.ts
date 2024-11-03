import { BaseEntity } from './common';

export interface User extends BaseEntity {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  play_level: 'beginner' | 'intermediate' | 'advanced';
  location: string;
  bio?: string;
  avatar_url?: string;
}

export interface RegisterUserDTO {
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

export interface LoginDTO {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
export type PlayerLevel = 'beginner' | 'intermediate' | 'advanced';
export type PlayingHand = 'left' | 'right';
export type Gender = 'male' | 'female' | 'other';

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string; // Could be constrained to Gender type if needed
  bio: string;
  location: string;
  level: PlayerLevel;
  playingHand: PlayingHand;
}

export interface PasswordStrength {
  score: number;
  feedback: string;
}
