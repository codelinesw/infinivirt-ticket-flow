import { Request, Response, NextFunction } from 'express';
import { PrismaTicketRepository } from '../infrastructure/repositories/PrismaTicketRepository';
import { PrismaTicketCommentRepository } from '../infrastructure/repositories/PrismaTicketCommentRepository';
import { TicketCommentService } from '../core/services/TicketCommentService';

const ticketRepository = new PrismaTicketRepository();
const ticketCommentRepository = new PrismaTicketCommentRepository();
const ticketCommentService = new TicketCommentService(
  ticketCommentRepository,
  ticketRepository
);

export class TicketCommentController {

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: ticketId } = req.params;
      const { content, isInternal } = req.body;
      const authorId = req.user?.userId || req.user?.sub || req.user?.id;

      const comment = await ticketCommentService.addComment({
        ticketId,
        authorId,
        content,
        isInternal,
      });

      return res.status(201).json({
        message: 'Comentario agregado exitosamente',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: ticketId } = req.params;
      const userRole = req.user.role;

      const comments = await ticketCommentService.getTicketComments(ticketId, userRole);

      return res.status(200).json({ data: comments });
    } catch (error) {
      next(error);
    }
  }
}