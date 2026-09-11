import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../core/services/TicketService';
import { PrismaTicketRepository } from '../infrastructure/repositories/PrismaTicketRepository';
import { TicketStatus, PriorityLevel } from '@prisma/client';

const ticketRepository = new PrismaTicketRepository();
const ticketService = new TicketService(ticketRepository);

export class TicketController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.sub;
      const ticket = await ticketService.createTicket(req.body, userId);
      res.status(201).json({ success: true, data: ticket });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const ticket = await ticketService.getTicketById(id);
      res.status(200).json({ success: true, data: ticket });
    } catch (error) {
      next(error);
    }
  }

  // static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const { status, priority, skip, take } = req.query;

  //     const filters = {
  //       status: status ? (status as TicketStatus) : undefined,
  //       priority: priority ? (priority as PriorityLevel) : undefined,
  //       skip: skip ? parseInt(skip as string, 10) : 0,
  //       take: take ? parseInt(take as string, 10) : 10,
  //     };

  //     const result = await ticketService.getAllTickets(filters);
  //     res.status(200).json({ success: true, data: result.tickets, total: result.total });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { status, priority, clientId, createdById, assignedToId, search, page, limit } = req.query;

      // Extraer datos del usuario autenticado (inyectados por el middleware authenticate)
      const currentUser = {
        id: req.user?.id || req.user?.sub,
        role: req.user?.role,
        clientId: req.user?.clientId, // Si el JWT almacena la empresa/cliente
      };

      const filters = {
        status: status ? (status as any) : undefined,
        priority: priority ? (priority as any) : undefined,
        clientId: clientId ? String(clientId) : undefined,
        createdById: createdById ? String(createdById) : undefined,
        assignedToId: assignedToId ? String(assignedToId) : undefined,
        search: search ? String(search) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      };

      const result = await ticketService.getAllTickets(filters, currentUser);

      res.status(200).json({
        data: result.tickets,
        pagination: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async assign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { assignedToId, notes } = req.body;
      
      // Garantiza leer el ID del token (revisa si en tu payload usas .sub o .id)
      const assignedById = req.user?.sub || req.user?.id;

      if (!assignedById) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      if (!assignedToId) {
        return res.status(400).json({ error: 'El parámetro assignedToId es obligatorio' });
      }

      const ticket = await ticketService.assignTicket(id, assignedToId, assignedById, notes);

      return res.status(200).json({
        message: 'Ticket asignado exitosamente',
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.sub;
      const updatedTicket = await ticketService.updateStatus(id, req.body, userId);
      res.status(200).json({ success: true, data: updatedTicket, message: 'Estado actualizado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}