import { Request, Response, NextFunction } from 'express';
import { UserService } from '../core/services/UserService';
import { PrismaUserRepository } from '../infrastructure/repositories/PrismaUserRepository';

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);

export class UserController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawSkip = parseInt(req.query.skip as string, 10);
      const rawTake = parseInt(req.query.take as string, 10);

      // Si no es un número válido o no se envió, asigna los valores por defecto
      const skip = isNaN(rawSkip) || rawSkip < 0 ? 0 : rawSkip;
      const take = isNaN(rawTake) || rawTake <= 0 ? 10 : rawTake;

      // Asegúrate de llamar al método correcto (findAll)
      const users = await userService.getAllUsers(skip, take);
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const user = await userService.changeUserStatus(id, isActive);
      res.status(200).json({ success: true, data: user, message: 'Estado del usuario actualizado' });
    } catch (error) {
      next(error);
    }
  }
}