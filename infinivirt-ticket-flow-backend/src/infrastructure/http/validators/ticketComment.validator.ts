import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z
      .string({ required_error: 'El contenido del comentario es obligatorio' })
      .min(1, 'El comentario no puede estar vacío')
      .max(2000, 'El comentario no puede exceder los 2000 caracteres'),
  isInternal: z.boolean().optional().default(false),
});

export const getCommentsSchema = z.object({
  id: z.string().uuid('El ID del ticket debe ser un UUID válido'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>['body'];