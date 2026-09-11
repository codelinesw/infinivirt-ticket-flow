import { Ticket } from './Ticket';
import { User } from './User';

/**
 * Trazabilidad histórica de asignaciones y reasignaciones de tickets.
 */
export interface TicketAssignment {
  id: string;
  ticketId: string;
  ticket?: Ticket;
  assignedTo: string;
  assignee?: User;
  assignedBy: string;
  assigner?: User;
  notes?: string;
  assignedAt: Date;
  unassignedAt?: Date | null;
}