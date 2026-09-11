import { Request, Response } from 'express';
import { ClientsService } from '../core/services/ClientsService';
import { PrismaClientRepository } from '../infrastructure/repositories/PrismaClientRepository';

const clientRepository = new PrismaClientRepository();
const clientsService = new ClientsService(clientRepository);

export class ClientController {

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const client = await clientsService.createClient(req.body);
      res.status(201).json({ success: true, data: client });
    } catch (error: any) {
      next(error);
    }
  };

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
      const result = await clientsService.listClients(page, limit, isActive);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      next(error);
    }
  };

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: clientId } = req.params;
      const client = await clientsService.getClientById(clientId);
      res.status(200).json({ success: true, data: client });
    } catch (error: any) {
      next(error);
    }
  };

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: clientId } = req.params;
      const updatedClient = await clientsService.updateClient(clientId, req.body);
      res.status(200).json({ success: true, data: updatedClient });
    } catch (error: any) {
      next(error);
    }
  };

  static async disable(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const disabledClient = await clientsService.disableClient(id);
      res.status(200).json({ 
        success: true, 
        message: 'Cliente inhabilitado correctamente', 
        data: disabledClient 
      });
    } catch (error: any) {
      next(error);
    }
  };

  static async toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isActive } = toggleClientActiveSchema.parse(req.body);
      const updatedClient = await clientsService.toggleClientStatus(id, isActive);
      res.status(200).json({ success: true, data: updatedClient });
    } catch (error: any) {
      next(error);
    }
  };

}