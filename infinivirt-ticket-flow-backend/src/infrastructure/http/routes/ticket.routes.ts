import { Router } from 'express';
import { TicketController } from '../../../controllers/TicketController';
import { validateRequest } from '../middlewares/validateRequest';
import { getTicketsQuerySchema, createTicketSchema, updateTicketStatusSchema } from '../validators/ticket.validator';
import { createCommentSchema, getCommentsSchema } from '../validators/ticketComment.validator';
import { TicketCommentController } from '../../../controllers/TicketCommentController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';


const ticketRouter = Router();

// Todas las rutas de tickets requieren autenticación previa
ticketRouter.use(authenticate);

/**
 * @openapi
 * /api/v1/tickets:
 *   post:
 *     summary: Crear un nuevo ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
ticketRouter.post('/', validateRequest(createTicketSchema), TicketController.create);

/**
 * @openapi
 * /api/v1/tickets:
 *   get:
 *     summary: Listar todos los tickets con filtros
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
ticketRouter.get('/', TicketController.getAll);

/**
 * @openapi
 * /api/v1/tickets/{id}:
 *   get:
 *     summary: Obtener el detalle de un ticket por ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
ticketRouter.get('/:id', TicketController.getById);

/**
 * @openapi
 * /api/v1/tickets/{id}/status:
 *   patch:
 *     summary: Cambiar el estado de un ticket y registrar en auditoría
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 */
// ticketRouter.patch('/:id/status', validateRequest(updateTicketStatusSchema), TicketController.updateStatus);
ticketRouter.patch(
  '/:id/status', 
  authorize(['ADMIN', 'AGENT']), 
  validateRequest(updateTicketStatusSchema), 
  (req, res, next) => TicketController.updateStatus(req, res, next)
);


// ticketRouter.patch('/:id/assign', TicketController.assign);
ticketRouter.patch(
  '/:id/assign', 
  authorize(['ADMIN']), 
  (req, res, next) => TicketController.assign(req, res, next)
);

// ticketRouter.post('/:id/comments', validateRequest(createCommentSchema), TicketCommentController.create);
// ticketRouter.get('/:id/comments', validateRequest(getCommentsSchema), TicketCommentController.getComments);

ticketRouter.post('/:id/comments', validateRequest(createCommentSchema), TicketCommentController.create);
ticketRouter.get('/:id/comments', TicketCommentController.getComments);

export default ticketRouter;