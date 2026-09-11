import { Router } from 'express';
import { UserController } from '../../../controllers/UserController';
import { validateRequest } from '../middlewares/validateRequest';
import { createUserSchema, updateStatusSchema } from '../validators/user.validator';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { RoleName } from '@prisma/client';

const userRouter = Router();

// ========================================================
// TODAS LAS RUTAS DE USUARIOS REQUIEREN AUTENTICACIÓN
// Y PRIVILEGIOS DE ADMINISTRADOR
// ========================================================
userRouter.use(authenticate, authorize([RoleName.ADMIN]));

/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
userRouter.post('/', validateRequest(createUserSchema), UserController.create);

// Endpoint temporal para validar funcionamiento inicial de rutas
userRouter.get('/', UserController.getAll);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: Obtiene los detalles de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
userRouter.get('/:id', UserController.getById);

/**
 * @openapi
 * /api/v1/users/{id}/status:
 *   patch:
 *     summary: Activa o desactiva a un usuario lógicamente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
userRouter.patch('/:id/status', validateRequest(updateStatusSchema), UserController.updateStatus)

export default userRouter;