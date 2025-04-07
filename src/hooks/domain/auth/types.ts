import { z } from 'zod';

export const UserRole = z.enum(['patient', 'caregiver', 'doctor']);
export type UserRole = z.infer<typeof UserRole>;

export const User = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: UserRole,
});
export type User = z.infer<typeof User>;

export const AuthResponse = z.object({
  user: User,
  accessToken: z.string(),
});
export type AuthResponse = z.infer<typeof AuthResponse>;

export const LoginPayload = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginPayload = z.infer<typeof LoginPayload>;