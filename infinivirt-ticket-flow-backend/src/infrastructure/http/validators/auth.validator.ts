import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'El correo electrónico es obligatorio',
      invalid_type_error: 'El correo electrónico debe ser un texto',
    })
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Debe proporcionar un correo electrónico válido'),

  password: z
    .string({
      required_error: 'La contraseña es obligatoria',
      invalid_type_error: 'La contraseña debe ser un texto',
    })
    .min(1, 'La contraseña es obligatoria'),
});

export type LoginDTO = z.infer<typeof loginSchema>;