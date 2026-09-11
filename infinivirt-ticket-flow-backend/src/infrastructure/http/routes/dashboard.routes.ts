import { Router } from 'express';
import { DashboardController } from '../../../controllers/DashboardController';
import { authenticate } from '../middlewares/authenticate';
import { RoleName } from '@prisma/client';
import authorize = require('../middlewares/authorize');


const dashboardRouter = Router();
dashboardRouter.use(authenticate);


/**
 * @openapi
 * /api/v1/dashboard/summary:
 *   get:
 *     summary: Consulta la data para del dashboard que es un resumen de los tickets
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Obtiene la información para el resumen del dashboard.
 */

// Ruta principal para resumen de dashboard
dashboardRouter.get('/summary', DashboardController.getSummary);

export default dashboardRouter;