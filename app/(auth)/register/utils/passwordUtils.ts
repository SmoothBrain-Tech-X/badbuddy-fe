import { PasswordStrength } from '../register';

export const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  let feedback = '';

  if (password.length >= 8) score += 20;
  if (password.match(/[A-Z]/)) score += 20;
  if (password.match(/[a-z]/)) score += 20;
  if (password.match(/[0-9]/)) score += 20;
  if (password.match(/[^A-Za-z0-9]/)) score += 20;

  if (score < 40) feedback = 'Weak password';
  else if (score < 80) feedback = 'Moderate password';
  else feedback = 'Strong password';

  return { score, feedback };
};

export const getPasswordStrengthColor = (score: number): string => {
  if (score < 40) return 'red';
  if (score < 80) return 'yellow';
  return 'green';
};
