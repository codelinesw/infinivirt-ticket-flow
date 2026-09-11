import { Router } from 'express';
import { AuthController } from '../../../controllers/AuthController';
import { validateRequest } from '../middlewares/validateRequest';
import { loginSchema } from '../validators/auth.validator';
import { authenticate } from '../middlewares/authenticate';

const authRouter = Router();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión en el sistema
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@ticketflow.com
 *               password:
 *                 type: string
 *                 example: Admin123!
 *     responses:
 *       200:
 *         description: Login exitoso y entrega de token JWT.
 *       401:
 *         description: Credenciales inválidas.
 */
authRouter.post('/login', validateRequest(loginSchema), AuthController.login);

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil obtenidos correctamente.
 *       401:
 *         description: No autorizado o token inválido.
 */
authRouter.get('/me', authenticate, AuthController.getProfile);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: Cierre de sesión del usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente.
 */
authRouter.post('/logout', authenticate, AuthController.logout);

export default authRouter;