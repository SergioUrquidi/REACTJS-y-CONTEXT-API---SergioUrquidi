import { z } from 'zod';

export const schemaLogin = z.object({
  username: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .trim(),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .trim(),
});

export type LoginFormValues = z.infer<typeof schemaLogin>;
