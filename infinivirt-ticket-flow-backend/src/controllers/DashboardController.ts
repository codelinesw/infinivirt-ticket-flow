import { Request, Response } from 'express';
import { DashboardService } from '../core/services/DashboardService';
import { PrismaDashboardRepository }  from  '../infrastructure/repositories/PrismaDashboardRepository';

const clientRepository = new PrismaDashboardRepository();
const dashboardService = new DashboardService(clientRepository);

export class DashboardController {
  constructor() {}
  static async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const data = await dashboardService.getSummaryMetrics();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      console.error('[DashboardController Error]:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la métricas del dashboard.',
        error: error.message,
      });
    }
  };
}