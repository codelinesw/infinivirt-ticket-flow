import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../security/jwt.service';
import { AppError } from '../../../core/errors/AppError';
import { CacheService } from '../cache/cache.service';

/**
 * Middleware para verificar la validez del token JWT en el encabezado Authorization.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  
  let token: string | undefined;

  if (req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return next(new AppError('Acceso denegado.', 401, 'UNAUTHORIZED'));
  }

  //const token = authHeader.split(' ')[1];

  try {
    const decoded = JwtService.verifyToken(token);
    
    const isRevoked = CacheService.get<boolean>(`blacklist:user:${decoded .sub}`);
    console.log(" is revoked ", isRevoked);

    if (isRevoked) {
      return next(new AppError('Sesión cerrada o token revocado', 401, 'TOKEN_REVOKED'));
    }

    req.user = decoded; // Inyecta la identidad del usuario en la petición
    next();
  } catch (error) {
    console.log(error);
    console.log("");
    next(new AppError('Token inválido o expirado. Inicie sesión nuevamente.', 401, 'INVALID_TOKEN'));
  }
};