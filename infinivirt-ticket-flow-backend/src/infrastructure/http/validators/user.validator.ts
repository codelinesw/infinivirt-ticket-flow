import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Debe proporcionar un correo electrónico válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  roleId: z.string()
    .trim()
    .min(1, 'El rol es obligatorio')
});

export const updateStatusSchema = z.object({
  isActive: z.boolean({
    required_error: 'El campo isActive es obligatorio',
    invalid_type_error: 'isActive debe ser un valor booleano (true/false)',
  }),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserStatusDTO = z.infer<typeof updateStatusSchema>;