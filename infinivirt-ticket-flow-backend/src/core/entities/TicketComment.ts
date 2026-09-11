import { Ticket } from './Ticket';
import { User } from './User';

/**
 * Representa las observaciones o interacciones en un ticket.
 */
export interface TicketComment {
  id: string;
  ticketId: string;
  ticket?: Ticket;
  userId: string;
  user?: User;
  comment: string;
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
}