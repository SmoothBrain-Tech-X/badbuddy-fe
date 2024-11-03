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

// src/types/register.ts
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  bio: string;
  location: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  playingHand: 'left' | 'right';
}

export interface PasswordStrength {
  score: number;
  feedback: string;
}

// Constants for form validation
export const FORM_VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_PASSWORD_STRENGTH: 40,
  PHONE_REGEX: /^[0-9]{10}$/, // Thai phone number format
} as const;

export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner - New to badminton' },
  { value: 'intermediate', label: 'Intermediate - Regular player' },
  { value: 'advanced', label: 'Advanced - Competitive player' },
] as const;

export const PLAYING_HANDS = [
  { value: 'right', label: 'Right Hand' },
  { value: 'left', label: 'Left Hand' },
] as const;

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;
