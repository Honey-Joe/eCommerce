
// src/validation/RegisterSchema.js
import { z } from 'zod';

export const userRegisterSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),

  email: z
    .string()
    .email('Invalid email address'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(30, 'Password must be less than 30 characters'),
});
