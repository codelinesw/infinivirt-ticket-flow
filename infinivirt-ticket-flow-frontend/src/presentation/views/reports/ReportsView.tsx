import React from 'react';
import { Clock, ShieldCheck, AlertTriangle, TrendingUp, Download, BarChart2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/button/button-component';

export const ReportsView: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Métricas & Cumplimiento SLA</h1>
          <p className="text-xs text-slate-500">Reportes de rendimiento operacional y tiempo de resolución de la mesa de ayuda.</p>
        </div>
        <Button color='white'>
          <Download className="h-3.5 w-3.5" /> Exportar reporte PDF
        </Button>
      </div>

      {/* Tarjetas KPi de SLA */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Cumplimiento Global SLA</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">96.8%</p>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96.8%' }} />
          </div>
          <p className="text-[10px] text-slate-400">+2.4% vs el mes anterior</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Tiempo Primera Respuesta (MTTA)</span>
            <Clock className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">18 min</p>
          <p className="text-[10px] text-emerald-600 font-bold">Meta esperada: &lt; 30 min (Cumplido)</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Tiempo de Resolución (MTTR)</span>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">4.2 hrs</p>
          <p className="text-[10px] text-slate-400">Promedio en tickets de prioridad alta/urgente</p>
        </div>
      </div>

      {/* Desglose de Rendimiento por Agente */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-indigo-600" /> Desglose por Agente de Soporte
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            { name: 'Carlos Agente', resolved: 42, avgTime: '2.5h', sla: '98%' },
            { name: 'Ana Silva', resolved: 38, avgTime: '3.1h', sla: '95%' },
            { name: 'Roberto Gómez', resolved: 29, avgTime: '4.0h', sla: '91%' },
          ].map((ag, idx) => (
            <div key={idx} className="flex items-center justify-between py-3">
              <span className="font-bold text-slate-800">{ag.name}</span>
              <div className="flex items-center gap-6 text-slate-600">
                <span>Casos resueltos: <strong>{ag.resolved}</strong></span>
                <span>Tiempo prom: <strong>{ag.avgTime}</strong></span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-extrabold text-emerald-700 border border-emerald-200">
                  SLA: {ag.sla}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};