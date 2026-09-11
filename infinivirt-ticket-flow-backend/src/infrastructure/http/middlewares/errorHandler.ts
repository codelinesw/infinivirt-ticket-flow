import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../core/errors/AppError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Manejo de excepciones personalizadas de negocio
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  // Errores no controlados o inesperados (ej. base de datos, fallos sintácticos)
  console.error('[UNHANDLED ERROR]:', err);

  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Error interno del servidor',
  });
};