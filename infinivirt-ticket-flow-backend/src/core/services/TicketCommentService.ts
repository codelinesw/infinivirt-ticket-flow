import { ITicketCommentRepository, CreateCommentDTO } from '../interfaces/repositories/ITicketCommentRepository';
import { ITicketRepository } from '../interfaces/repositories/ITicketRepository';
import { prisma } from '../../infrastructure/database/prisma/PrismaClient';

export class TicketCommentService {
  constructor(
    private commentRepository: ITicketCommentRepository,
    private ticketRepository: ITicketRepository
  ) {}

  async addComment(data: CreateCommentDTO) {
    const ticket = await this.ticketRepository.findById(data.ticketId);
    if (!ticket) {
      throw new Error('El ticket no existe');
    }

    const comment = await this.commentRepository.create(data);

    // Actualizar última actividad del ticket
    await prisma.ticket.update({
      where: { id: data.ticketId },
      data: { lastActivityAt: new Date() },
    });

    return comment;
  }

  async getTicketComments(ticketId: string, userRole: string) {
    const includeInternal = userRole === 'ADMIN' || userRole === 'AGENT';
    return this.commentRepository.findByTicketId(ticketId, includeInternal);
  }
}