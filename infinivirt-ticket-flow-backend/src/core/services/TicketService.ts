import { ITicketRepository, TicketFilterOptions } from '../interfaces/repositories/ITicketRepository';
import { CreateTicketInput, UpdateTicketStatusInput } from '../../infrastructure/http/validators/ticket.validator';
import { AppError } from '../errors/AppError';

export class TicketService {
  constructor(private ticketRepository: ITicketRepository) {}

  async createTicket(input: CreateTicketInput, userId: string) {
    return this.ticketRepository.create({
      ...input,
      priority: input.priority,
      clientId: input.clientId, // <-- Heredado del DTO validado
      createdById: userId,
    });
  }

  async getTicketById(id: string) {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new AppError('El ticket no existe', 404, 'TICKET_NOT_FOUND');
    }
    return ticket;
  }

  async getAllTickets(
    filters: TicketFilterOptions,
    currentUser: { id: string; role: string; clientId?: string }
  ) {
    // Si el usuario es tipo CLIENT, restringimos los resultados a su cliente asignado
    if (currentUser.role === 'CLIENT') {
      filters.clientId = currentUser.clientId || currentUser.id;
    }

    return this.ticketRepository.findAll(filters);
  }

  async assignTicket(ticketId: string, assignedToId: string, assignedById: string, notes?: string) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError('El ticket especificado no existe', 404, 'TICKET_NOT_FOUND');
    }

    return this.ticketRepository.assignTicket({
      ticketId,
      assignedToId,
      assignedById,
      notes,
    });
  }

  async updateStatus(ticketId: string, input: UpdateTicketStatusInput, userId: string) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError('El ticket no existe', 404, 'TICKET_NOT_FOUND');
    }

    if (ticket.status === input.status) {
      throw new AppError('El ticket ya se encuentra en ese estado', 400, 'SAME_STATUS');
    }

    return this.ticketRepository.updateStatus(ticketId, input.status, userId, input.note);
  }
}