import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../core/errors/AppError';

/**
 * Middleware para restringir el acceso a roles específicos (RBAC).
 * @param allowedRoles Lista de nombres de roles autorizados
 */
// export const authorize = (allowedRoles: string[]) => {
//   return (req: Request, _res: Response, next: NextFunction): void => {
//     if (!req.user) {
//       next(new AppError('Usuario no autenticado.', 401, 'UNAUTHORIZED'));
//       return;
//     }

//     if (!allowedRoles.includes(req.user.role)) {
//       next(
//         new AppError(
//           'No tiene los permisos necesarios para realizar esta acción.',
//           403,
//           'FORBIDDEN'
//         )
//       );
//       return;
//     }

//     next();
//   };
// };
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    console.log('--- AUTHORIZE MIDDLEWARE ---');
    console.log('User Role:', req.user?.role);
    console.log('Allowed Roles:', allowedRoles);

    if (!req.user) {
      next(new AppError('Usuario no autenticado.', 401, 'UNAUTHORIZED'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(
        new AppError(
          'No tiene los permisos necesarios para realizar esta acción.',
          403,
          'FORBIDDEN'
        )
      );
      return;
    }

    next();
  };
};