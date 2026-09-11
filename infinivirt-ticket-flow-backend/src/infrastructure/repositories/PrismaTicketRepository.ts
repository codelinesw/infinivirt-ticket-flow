import { Ticket, TicketStatus } from '@prisma/client';
import { ITicketRepository, CreateTicketDTO, TicketFilterOptions, PaginatedTickets , AssignTicketDTO } from '../../core/interfaces/repositories/ITicketRepository';
import { prisma } from '../database/prisma/PrismaClient';

export class PrismaTicketRepository implements ITicketRepository {
  constructor(){}
  async create(data: CreateTicketDTO): Promise<Ticket> {
    return prisma.$transaction(async (tx) => {
      // 1. Crear el Ticket
      const ticket = await tx.ticket.create({
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: TicketStatus.OPEN,
          creator: {
            connect: { id: data.createdById },
          },
          client: {
            connect: { id: data.clientId },
          },
        },
      });

      // 2. Registrar el evento inicial en el historial mediante "connect"
      await tx.ticketStatusHistory.create({
        data: {
          ticket: { connect: { id: ticket.id } },
          user: { connect: { id: data.createdById } },
          fromStatus: TicketStatus.OPEN,
          toStatus: TicketStatus.OPEN,
          notes: 'Ticket creado en el sistema.',
        },
      });

      return ticket;
    });
  }

async findById(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignee: { select: { id: true, firstName: true, lastName: true, email: true } }, // <-- Cambiado a assignee
        client: { select: { id: true, name: true, email: true } },
        statusHistory: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } }, // <-- Cambiado a user
          },
          orderBy: { changedAt: 'desc' }, // <-- Usamos changedAt en lugar de createdAt
        },
      },
    });
  }

  // async findAll(filters: TicketFilterOptions) {
  //   const where: any = {};

  //   if (filters.status) where.status = filters.status;
  //   if (filters.priority) where.priority = filters.priority;
  //   if (filters.assignedToId) where.assignedToId = filters.assignedToId;
  //   if (filters.createdById) where.createdById = filters.createdById;

  //   const [tickets, total] = await Promise.all([
  //     prisma.ticket.findMany({
  //       where,
  //       skip: filters.skip || 0,
  //       take: filters.take || 10,
  //       include: {
  //         creator: { select: { id: true, firstName: true, lastName: true } },
  //         assignee: { select: { id: true, firstName: true, lastName: true } }, // <-- Cambiado a assignee
  //         client: { select: { id: true, name: true } },
  //       },
  //       orderBy: { createdAt: 'desc' },
  //     }),
  //     prisma.ticket.count({ where }),
  //   ]);

  //   return { tickets, total };
  // }

  async findAll(filters: TicketFilterOptions): Promise<PaginatedTickets> {
      const page = filters.page && filters.page > 0 ? Number(filters.page) : 1;
      const limit = filters.limit && filters.limit > 0 ? Number(filters.limit) : 10;
      const skip = (page - 1) * limit;

      // Construcción limpia del objeto where
      const where: Prisma.TicketWhereInput = {};

      if (filters.status) where.status = filters.status;
      if (filters.priority) where.priority = filters.priority;
      if (filters.clientId) where.clientId = filters.clientId;
      if (filters.createdById) where.createdById = filters.createdById;
      if (filters.assignedToId) where.assignedToId = filters.assignedToId;

      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.trim();
        where.OR = [
          { title: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ];
      }

      // Ejecución paralela
      const [total, tickets] = await prisma.$transaction([
        prisma.ticket.count({ where }),
        prisma.ticket.findMany({
          where,
          take: limit,
          skip,
          orderBy: { createdAt: 'desc' },
          include: {
            client: { select: { id: true, name: true } },
            creator: { select: { id: true, firstName: true, lastName: true, email: true } },
            assignee: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        }),
      ]);

      return {
        tickets,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    }

  async assignTicket(data: AssignTicketDTO): Promise<Ticket> {
    return prisma.$transaction(async (tx) => {
      // 1. Actualizar el ticket asignando el nuevo agente
      const updatedTicket = await tx.ticket.update({
        where: { id: data.ticketId },
        data: {
          assignee: { connect: { id: data.assignedToId } },
        },
      });

      // 2. Crear el registro en la tabla ticket_assignments
      await tx.ticketAssignment.create({
        data: {
          ticket: { connect: { id: data.ticketId } },
          assignee: { connect: { id: data.assignedToId } },
          assigner: { connect: { id: data.assignedById } },
          notes: data.notes || 'Asignación de ticket',
        },
      });

      return updatedTicket;
    });
  }

  async updateStatus(
      ticketId: string,
      newStatus: TicketStatus,
      changedById: string,
      note?: string
    ): Promise<Ticket> {
      return prisma.$transaction(async (tx) => {
        const currentTicket = await tx.ticket.findUniqueOrThrow({ where: { id: ticketId } });

        // Actualizar ticket
        const updatedTicket = await tx.ticket.update({
          where: { id: ticketId },
          data: { status: newStatus },
        });

        // Registrar traza de auditoría
        await tx.ticketStatusHistory.create({
          data: {
            ticket: { connect: { id: ticketId } },
            user: { connect: { id: changedById } },
            fromStatus: currentTicket.status,
            toStatus: newStatus,
            notes: note || `Cambio de estado a ${newStatus}`,
          },
        });

        return updatedTicket;
      });
  }
}