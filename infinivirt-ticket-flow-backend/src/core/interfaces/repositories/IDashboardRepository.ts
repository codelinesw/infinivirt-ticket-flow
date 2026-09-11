export interface DashboardKPIs {
  totalCurrent: number;
  totalLast: number;
  openCurrent: number;
  openLast: number;
  progressCurrent: number;
  progressLast: number;
  resolvedCurrent: number;
  resolvedLast: number;
}

export interface SLAMetrics {
  firstResponseSla: number;
  resolutionSla: number;
}

export interface RecentTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: Date;
}

export interface IDashboardRepository {
  getKPICounts(startCurrentMonth: Date, startLastMonth: Date): Promise<DashboardKPIs>;
  getSLAMetrics(startCurrentMonth: Date): Promise<SLAMetrics>;
  getRecentTickets(limit?: number): Promise<RecentTicket[]>;
}