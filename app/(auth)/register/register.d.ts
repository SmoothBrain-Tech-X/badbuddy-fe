export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  level: string;
  playingHand: string;
}

export interface PasswordStrength {
  score: number;
  feedback: string;
}
