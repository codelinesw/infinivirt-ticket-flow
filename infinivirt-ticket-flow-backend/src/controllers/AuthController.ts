import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../core/services/AuthService';
import { PrismaUserRepository } from '../infrastructure/repositories/PrismaUserRepository';
import cacheService = require('../infrastructure/http/cache/cache.service');
import jwt from 'jsonwebtoken';

const userRepository = new PrismaUserRepository();
const authService = new AuthService(userRepository);

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      console.log("TOKEN :: ", result);
      res.cookie('authToken', result.token, {
        httpOnly: true,
        // En producción (dockerizado con HTTPS) pasa a true
        secure: true, // process.env.NODE_ENV === 'production'
        sameSite: 'lax', // Permite que funcione sin problemas en el flujo local y producción
        maxAge: 3600000,
      });
      delete result.token;
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Endpoint: GET /api/v1/auth/me
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.sub;
      const profile = await authService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  // Endpoint: POST /api/v1/auth/logout
  static async logout(req: Request, res: Response): Promise<void> {
    const token = req.cookies?.authToken || req.headers.authorization?.split(' ')[1];
    if (token) {
    // Decodificamos el JWT para leer el sub y el exp
    const decoded = jwt.decode(token) as { sub: string; exp: number };
  
    if (decoded?.sub && decoded?.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      const ttlInSeconds = decoded.exp - currentTime;
      // Si al token aún le quedaba tiempo de vida, lo metemos a la lista negra
      if (ttlInSeconds > 0) {
        cacheService.CacheService.set(`blacklist:user:${decoded.sub}`, true, ttlInSeconds);
      }
    }
  }

  res.clearCookie('authToken');
  // Al ser autenticación stateless con JWT, el logout principal se procesa eliminando el token en cliente
  res.status(200).json({
    success: true,
    message: 'Sesión cerrada correctamente.',
  });
  
  }
}