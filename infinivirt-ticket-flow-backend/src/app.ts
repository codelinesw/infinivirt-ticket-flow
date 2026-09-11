// src/app.ts
// import express from 'express';
// import userRoutes from './infrastructure/http/routes/user.routes';
// import { errorHandler } from './infrastructure/http/middlewares/errorHandler';

// const app = express();

// app.use(express.json());

// // Declaración de rutas
// app.use('/users', userRoutes);

// // El middleware de errores DEBE ir al final
// app.use(errorHandler);

// export default app;


import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import rootRouter from './infrastructure/http/routes';
import { errorHandler } from './infrastructure/http/middlewares/errorHandler';
import { globalRateLimiter } from './infrastructure/http/middlewares/rateLimiter';
import cookieParser from 'cookie-parser';

const app: Application = express();

// ------------------------------------------------------
// MIDDLEWARES DE SEGURIDAD Y LOGS
// ------------------------------------------------------

// Protección de cabeceras HTTP
app.use(helmet());
app.use(cookieParser());

// Configuración de CORS
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Control de tasa de peticiones (Rate Limiting)
app.use(globalRateLimiter);

// Lectura de body JSON y URL Encoded
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Logging de peticiones HTTP en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ------------------------------------------------------
// RUTAS
// ------------------------------------------------------
/**
 * @openapi
 * /api/ping:
 *   get:
 *     summary: Endpoint de prueba
 *     description: Retorna un mensaje confirmando la carga de Swagger.
 *     responses:
 *       200:
 *         description: Conexión exitosa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/api/v1/ping', (req, res) => {
  res.json({ status: 'ok', message: 'Swagger cargado correctamente' });
});

// Prefijo global de API V1
app.use('/api/v1', rootRouter);


// Manejo de rutas no encontradas (404)
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'El recurso solicitado no fue encontrado.',
    },
  });
});

// ------------------------------------------------------
// MIDDLEWARE CENTRALIZADO DE ERRORES
// ------------------------------------------------------
app.use(errorHandler);

export default app;