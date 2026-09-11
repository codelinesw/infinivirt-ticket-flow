import React from 'react';
import {
  Ticket as TicketIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/button/button-component';
import { useAuthStore } from '../../storage/zustand-store';
import { useDashboardViewModel } from './dashboard-view-model';

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = () => {

  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user_data);

  const isClient = user && user.role === 'CLIENT';

  // Métricas mock adaptadas al contexto RBAC
  const kpis = [
    {
      title: 'Total Tickets',
      value: isClient ? '12' : '148',
      change: '+12%',
      icon: TicketIcon,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Abiertos (OPEN)',
      value: isClient ? '3' : '32',
      change: '-5%',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'En Progreso',
      value: isClient ? '4' : '45',
      change: '+8%',
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Resueltos / Cerrados',
      value: isClient ? '5' : '71',
      change: '+24%',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  // Actividad reciente simulada
  const recentTickets: Partial<any>[] = [
    {
      id: '1',
      ticketNumber: 'TKN-1024',
      title: 'Fallo en autenticación con proveedor OAuth',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      createdAt: 'Hace 25 min',
    },
    {
      id: '2',
      ticketNumber: 'TKN-1023',
      title: 'Inconsistencia en generación de reporte PDF',
      status: 'OPEN',
      priority: 'HIGH',
      createdAt: 'Hace 1 hora',
    },
    {
      id: '3',
      ticketNumber: 'TKN-1022',
      title: 'Solicitud de ampliación de límites API',
      status: 'RESOLVED',
      priority: 'LOW',
      createdAt: 'Hace 3 horas',
    },
  ];

  const viewModel = useDashboardViewModel();
  const _titles: any = {"total": "Total", "open": "Abiertos", "in_progress": "En progreso", "resolved": "Resueltos"}
  const userName = user.firstName + " " + (user.lastName || "")
  return (
    <div className="w-full">
      {/* Header Contextual */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Hola, {userName || ""} 👋
          </h1>
          <p className="text-xs text-slate-500">
            {isClient
              ? 'Resumen del estado de tus requerimientos de soporte técnico.'
              : 'Panel de control de operaciones y rendimiento del Service Desk.'}
          </p>
        </div>
        <Button
          onClick={() => {
            navigate("/tickets")
          }}          
        >
          Ver todos los casos <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-5">
        {viewModel.summary?.kpis.map((kpi: any, idx: any) => {
          //const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{_titles[kpi.key]}</span>
                {/* <div className={`rounded-lg p-2 ${kpi.bg}`}>
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </div> */}
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900">{kpi.value}</span>
                <span className="flex items-center text-[11px] font-semibold text-emerald-600">
                  <TrendingUp className="mr-0.5 h-3 w-3" /> {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SLA Metrics & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* SLA Health Indicator */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-indigo-600" /> Cumplimiento SLA
            </h3>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              98.2% Óptimo
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Primera Respuesta (&lt; 1h)</span>
                <span className="font-bold text-slate-800">96%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-indigo-600" style={{ width: '96%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Tiempo de Resolución (&lt; 24h)</span>
                <span className="font-bold text-slate-800">92%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-emerald-500" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-100">
              💡 <span className="font-semibold">Nota de arquitectura:</span> Métricas calculadas sobre el promedio acumulado del mes en curso.
            </div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Casos Recientes</h3>
            <button
              onClick={() => {}}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Ver todos
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {viewModel.summary?.recent_tickets.map((t: any) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600">{t.ticketNumber}</span>
                    <span className="text-xs font-semibold text-slate-800 truncate">{t.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{t.createdAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      t.priority === 'URGENT'
                        ? 'bg-rose-100 text-rose-700'
                        : t.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {t.priority}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};