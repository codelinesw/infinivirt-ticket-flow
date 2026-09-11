import { IDashboardRepository } from '../interfaces/repositories/IDashboardRepository';

export interface DashboardResponseDTO {
  kpis: {
    total: { value: number; change: string };
    open: { value: number; change: string };
    in_progress: { value: number; change: string };
    resolved: { value: number; change: string };
  };
  sla: {
    global: number;
    first_response: number;
    resolution: number;
  };
  recent_tickets: Array<{
    id: string;
    code: string;
    title: string;
    createdAt: Date;
    priority: string;
    status: string;
  }>;
}

export class DashboardService {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async getSummaryMetrics(): Promise<DashboardResponseDTO> {
    const now = new Date();
    const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [kpis, sla, recentTickets] = await Promise.all([
      this.dashboardRepository.getKPICounts(startCurrentMonth, startLastMonth),
      this.dashboardRepository.getSLAMetrics(startCurrentMonth),
      this.dashboardRepository.getRecentTickets(3),
    ]);

    const formatChange = (curr: number, prev: number): string => {
      if (prev === 0) return curr > 0 ? '+100%' : '0%';
      const percent = Math.round(((curr - prev) / prev) * 100);
      return `${percent >= 0 ? '+' : ''}${percent}%`;
    };

    const globalSla = Number(
      ((sla.firstResponseSla + sla.resolutionSla) / 2).toFixed(1)
    );

    return {
      kpis: {
        total: {
          value: kpis.totalCurrent,
          change: formatChange(kpis.totalCurrent, kpis.totalLast),
        },
        open: {
          value: kpis.openCurrent,
          change: formatChange(kpis.openCurrent, kpis.openLast),
        },
        in_progress: {
          value: kpis.progressCurrent,
          change: formatChange(kpis.progressCurrent, kpis.progressLast),
        },
        resolved: {
          value: kpis.resolvedCurrent,
          change: formatChange(kpis.resolvedCurrent, kpis.resolvedLast),
        },
      },
      sla: {
        global: globalSla,
        first_response: sla.firstResponseSla,
        resolution: sla.resolutionSla,
      },
      recent_tickets: recentTickets.map((ticket) => ({
        id: ticket.id,
        code: `TKN-${ticket.id.slice(0, 4).toUpperCase()}`,
        title: ticket.title,
        createdAt: ticket.createdAt,
        priority: ticket.priority,
        status: ticket.status,
      })),
    };
  }
}