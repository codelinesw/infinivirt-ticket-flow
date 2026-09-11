import { Router } from 'express';
import { ClientController } from '../../../controllers/ClientController';
import { validateRequest } from '../middlewares/validateRequest';
import { 
  createClientSchema, 
  updateClientSchema, 
  updateClientStatusSchema 
} from '../validators/clients.validator';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { RoleName } from '@prisma/client';

const clientRouter = Router();

// ========================================================
// RUTAS DE CLIENTES/TENANTS REQUIEREN AUTENTICACIÓN
// Y PRIVILEGIOS DE ADMINISTRADOR O SUPERVISOR
// ========================================================
clientRouter.use(authenticate, authorize([RoleName.ADMIN, RoleName.SUPERVISOR]));

/**
 * @swagger
 * /api/v1/clients:
 *   post:
 *     summary: Crea un nuevo cliente/tenant
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 */
clientRouter.post('/', validateRequest(createClientSchema), ClientController.create);

/**
 * @swagger
 * /api/v1/clients:
 *   get:
 *     summary: Obtiene el listado de clientes/tenants
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 */
clientRouter.get('/', ClientController.getAll);

/**
 * @swagger
 * /api/v1/clients/{id}:
 *   get:
 *     summary: Obtiene los detalles de un cliente por su ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 */
clientRouter.get('/:id', ClientController.getById);

/**
 * @swagger
 * /api/v1/clients/{id}:
 *   put:
 *     summary: Actualiza la información de un cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 */
clientRouter.put('/:id', validateRequest(updateClientSchema), ClientController.update);

/**
 * @swagger
 * /api/v1/clients/{id}/status:
 *   patch:
 *     summary: Activa o inhabilita a un cliente lógicamente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 */
//clientRouter.patch('/:id/status', validateRequest(updateClientStatusSchema), ClientController.updateStatus);

export default clientRouter;