import { Ticket, TicketStatus } from './Ticket';
import { User } from './User';

/**
 * Trazabilidad de las transiciones de estado de un ticket.
 */
export interface TicketStatusHistory {
  id: string;
  ticketId: string;
  ticket?: Ticket;
  fromStatus: TicketStatus;
  toStatus: TicketStatus;
  changedBy: string;
  user?: User;
  changedAt: Date;
  notes?: string;
}