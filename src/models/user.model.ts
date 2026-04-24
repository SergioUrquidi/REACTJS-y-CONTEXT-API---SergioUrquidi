import { z } from 'zod';

export const schemaUser = z
  .object({
    username: z.string().min(3, 'El nombre es obligatorio'),
    password: z
      .string()
      .min(6, 'La contraseña debe de tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'La confirmación debe tener al menos 6 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas son diferentes',
    path: ['confirmPassword'],
  });

export type UserFormValues = z.infer<typeof schemaUser>;
