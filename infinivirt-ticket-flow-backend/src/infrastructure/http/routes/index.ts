import { Router } from 'express';
import userRouter from './user.routes';
import authRouter from './auth.routes';
import ticketRouter from './ticket.routes';
import clientRouter from './client.routes';
import dashboardRouter from './dashboard.routes';

const rootRouter = Router();

// Salud y monitoreo del servicio
rootRouter.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

// Agrupación de módulos por dominio
rootRouter.use('/users', userRouter);
rootRouter.use('/auth', authRouter);
rootRouter.use('/tickets', ticketRouter);
rootRouter.use('/clients', clientRouter);
rootRouter.use('/dashboard', dashboardRouter);



export default rootRouter;