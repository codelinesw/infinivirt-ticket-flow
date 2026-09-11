import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(150),
  email: z.string().email('Correo electrónico inválido').max(255),
  phone: z.string().max(50).nullable().optional(),
  domain: z.string().max(70).nullable().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateClientSchema = createClientSchema.partial();

export const clientIdParamSchema = z.object({
  id: z.string().uuid('El ID debe ser un UUID válido'),
});

export const toggleClientActiveSchema = z.object({
  isActive: z.boolean({ required_error: 'El estado isActive es requerido' }),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;