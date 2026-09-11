import { prisma } from '../database/prisma/PrismaClient';
import {
  IDashboardRepository,
  DashboardKPIs,
  SLAMetrics,
  RecentTicket,
} from '../../core/interfaces/repositories/IDashboardRepository';

export class PrismaDashboardRepository implements IDashboardRepository {
  constructor() {}

  async getKPICounts(
    startCurrentMonth: Date,
    startLastMonth: Date
  ): Promise<DashboardKPIs> {
    const [
      totalCurrent,
      totalLast,
      currentMonthGroup,
      lastMonthGroup,
    ] = await Promise.all([
      // Usamos createdAt en lugar de created_at
      prisma.ticket.count({
        where: { createdAt: { gte: startCurrentMonth } },
      }),
      prisma.ticket.count({
        where: { createdAt: { gte: startLastMonth, lt: startCurrentMonth } },
      }),
      prisma.ticket.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startCurrentMonth } },
        _count: { _all: true },
      }),
      prisma.ticket.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startLastMonth, lt: startCurrentMonth } },
        _count: { _all: true },
      }),
    ]);

    const getStatusCount = (data: typeof currentMonthGroup, status: any) =>
      data.find((item) => item.status === status)?._count._all || 0;

    const resolvedStatus = ['RESOLVED', 'CLOSED'];

    return {
      totalCurrent,
      totalLast,
      openCurrent: getStatusCount(currentMonthGroup, 'OPEN'),
      openLast: getStatusCount(lastMonthGroup, 'OPEN'),
      progressCurrent: getStatusCount(currentMonthGroup, 'IN_PROGRESS'),
      progressLast: getStatusCount(lastMonthGroup, 'IN_PROGRESS'),
      resolvedCurrent: currentMonthGroup
        .filter((g) => resolvedStatus.includes(g.status))
        .reduce((acc, curr) => acc + curr._count._all, 0),
      resolvedLast: lastMonthGroup
        .filter((g) => resolvedStatus.includes(g.status))
        .reduce((acc, curr) => acc + curr._count._all, 0),
    };
  }

  async getSLAMetrics(startCurrentMonth: Date): Promise<SLAMetrics> {
    // IMPORTANTE: En $queryRaw ejecutas SQL nativo en MySQL,
    // así que aquí SÍ debes usar los nombres de las columnas en la DB (created_at, resolved_at).
    const metrics: Array<{
      first_response_sla: number;
      resolution_sla: number;
    }> = await prisma.$queryRaw`
      SELECT 
        ROUND(
          (COUNT(CASE WHEN TIMESTAMPDIFF(MINUTE, t.created_at, fc.first_comment_at) <= 60 THEN 1 END) * 100.0) 
          / NULLIF(COUNT(t.id), 0), 1
        ) AS first_response_sla,
        ROUND(
          (COUNT(CASE WHEN t.resolved_at IS NOT NULL AND TIMESTAMPDIFF(HOUR, t.created_at, t.resolved_at) <= 24 THEN 1 END) * 100.0) 
          / NULLIF(COUNT(CASE WHEN t.resolved_at IS NOT NULL THEN 1 END), 0), 1
        ) AS resolution_sla
      FROM tickets t
      LEFT JOIN (
        SELECT ticket_id, MIN(created_at) AS first_comment_at
        FROM ticket_comments
        GROUP BY ticket_id
      ) fc ON t.id = fc.ticket_id
      WHERE t.created_at >= ${startCurrentMonth};
    `;

    return {
      firstResponseSla: Number(metrics[0]?.first_response_sla || 0),
      resolutionSla: Number(metrics[0]?.resolution_sla || 0),
    };
  }

  async getRecentTickets(limit: number = 3): Promise<RecentTicket[]> {
    const tickets = await prisma.ticket.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' }, // Corregido a createdAt
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true, // Corregido a createdAt
      },
    });

    return tickets.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      createdAt: t.createdAt,
    }));
  }
}