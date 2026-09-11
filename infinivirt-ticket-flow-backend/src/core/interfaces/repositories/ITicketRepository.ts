import { Ticket, TicketHistory, TicketStatus, PriorityLevel } from '@prisma/client';

import { User } from '../../entities/User';

export interface CreateTicketDTO {
  title: string;
  description: string;
  priority: PriorityLevel;
  createdById: string;
  clientId: string;
}

export interface AssignTicketDTO {
  ticketId: string;
  assignedToId: string;
  assignedById: string;
  notes?: string;
}

export interface TicketFilterOptions {
  status?: TicketStatus;
  priority?: PriorityLevel;
  assignedToId?: string;
  createdById?: string;
  search?: string;
  skip?: number;
  take?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedTickets {
  tickets: Ticket[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ITicketRepository {
  create(data: CreateTicketDTO): Promise<Ticket>;
  findById(id: string): Promise<(Ticket & { history?: TicketHistory[] }) | null>;
  findAll(filters: TicketFilterOptions): Promise<{ tickets: Ticket[]; total: number }>;
  updateStatus(
    ticketId: string,
    newStatus: TicketStatus,
    changedById: string,
    note?: string
  ): Promise<Ticket>;
  assignTicket(data: AssignTicketDTO): Promise<Ticket>;
}