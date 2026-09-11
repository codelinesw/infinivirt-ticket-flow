import { z } from 'zod';
import { TicketPriority, TicketStatus, Priority } from '@prisma/client';

export const createTicketSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  priority: z.nativeEnum(TicketPriority, {
    message: 'Prioridad inválida (LOW, MEDIUM, HIGH, CRITICAL)',
  }),
  clientId: z.string().uuid('Debe proporcionar un ID de cliente válido (UUID)')
});

export const updateTicketStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus, {
    message: 'Estado inválido (OPEN, IN_PROGRESS, PENDING, RESOLVED, CLOSED)',
  }),
  note: z.string().optional(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;