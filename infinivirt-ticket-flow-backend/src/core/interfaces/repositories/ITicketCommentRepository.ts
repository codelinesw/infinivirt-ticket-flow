import { TicketComment } from '@prisma/client';

export interface CreateCommentDTO {
  ticketId: string;
  authorId: string;
  content: string;
  isInternal?: boolean;
}

export interface ITicketCommentRepository {
  create(data: CreateCommentDTO): Promise<TicketComment>;
  findByTicketId(ticketId: string, includeInternal?: boolean): Promise<TicketComment[]>;
}