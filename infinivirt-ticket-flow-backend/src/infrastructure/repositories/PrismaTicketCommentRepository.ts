import { TicketComment } from '@prisma/client';
import { ITicketCommentRepository, CreateCommentDTO } from '../../core/interfaces/repositories/ITicketCommentRepository';
import { prisma } from '../database/prisma/PrismaClient';

export class PrismaTicketCommentRepository implements ITicketCommentRepository {
  async create(data: CreateCommentDTO): Promise<TicketComment> {
    return prisma.ticketComment.create({
      data: {
        comment: data.content,
        isInternal: data.isInternal ?? false,
        ticket: { connect: { id: data.ticketId } },
        user: { connect: { id: data.authorId } },
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
    });
  }

  async findByTicketId(ticketId: string, includeInternal: boolean = false): Promise<TicketComment[]> {
    const whereCondition: any = { ticketId };

    // Si no es agente/admin, se ocultan los comentarios internos
    if (!includeInternal) {
      whereCondition.isInternal = false;
    }

    return prisma.ticketComment.findMany({
      where: whereCondition,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}