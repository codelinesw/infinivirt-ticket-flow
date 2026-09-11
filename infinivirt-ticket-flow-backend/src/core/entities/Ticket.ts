import { Client } from './Client';
import { User } from './User';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Entidad principal de dominio para las solicitudes de soporte.
 */
export interface Ticket {
  id: string;
  clientId: string;
  client?: Client;
  createdBy: string;
  creator?: User;
  assignedTo?: string | null;
  assignee?: User | null;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
  dueAt?: Date | null;
  resolvedAt?: Date | null;
  closedAt?: Date | null;
}