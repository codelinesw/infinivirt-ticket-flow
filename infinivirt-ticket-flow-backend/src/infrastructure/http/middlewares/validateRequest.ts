import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler';

/**
 * Middleware genérico para validar body, query o params según un esquema Zod.
 */
export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Acceso seguro a error.issues usando optional chaining o fallback array
        const formattedErrors = (error.issues || []).map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        return res.status(400).json({
          status: 'error',
          errors: formattedErrors,
        });
      }

      next(error);
    }
  };
};