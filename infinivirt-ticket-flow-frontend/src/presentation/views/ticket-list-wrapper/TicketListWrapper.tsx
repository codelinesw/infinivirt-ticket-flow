import React, { useState } from 'react';
import { CreateTicketModal } from '../../components/modals/create-ticket/CreateTicketModal';
import { useAssigmentViewModel } from './assignment-view-model';
import { ArrowRight,  Clock, Filter, Search } from 'lucide-react';

export const TicketListWrapper: React.FC<any> = () => {

  const viewModel = useAssigmentViewModel();

  return (
    <>
      <div className="p-6 space-y-6 bg-slate-50 min-h-screen dark:bg-slate-900 text-slate-800 dark:text-slate-100">

        {/* HEADER PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mesa de Control & Asignaciones</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Triage de entrada y balanceo de carga operativa para el equipo de soporte.
            </p>
          </div>
        </div>

        {/* Control Bar: Search & Filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          {/* Real-time Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={viewModel.filters.search}
              onChange={(e) => {
                viewModel.setFilters({
                  search: e.target.value,
                  status: viewModel.filters.status,
                  priority: viewModel.filters.priority
                });
              }}
              placeholder="Buscar por ID, título o descripción..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-600">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-medium">Estado:</span>
              <select
                value={viewModel.filters.status}
                onChange={(e) => {
                  viewModel.setFilters({
                    search: viewModel.filters.search,
                    status: e.target.value,
                    priority: viewModel.filters.priority
                  });
                }}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Todos</option>
                <option value="OPEN">Abierto</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="RESOLVED">Resuelto</option>
                <option value="CLOSED">Cerrado</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-600">
              <span className="font-medium">Prioridad:</span>
              <select
                value={viewModel.filters.priority}
                onChange={(e) => {
                  viewModel.setFilters({
                    search: viewModel.filters.search,
                    status: viewModel.filters.status,
                    priority: e.target.value
                  });
                }}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Todas</option>
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL EN 2 COLUMNAS */}
        <div className="w-full">

          {/* PANEL IZQUIERDO: INBOX DE TRIAGE (TICKETS SIN ASIGNAR) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[650px]">

            {/* Header del Panel */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  Por Asignar <span className="ml-1 text-xs px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold rounded-full">{viewModel.filteredTickets.data.length}</span>
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                {viewModel.selectedTicketId ? '1 caso seleccionado' : 'Ningún caso seleccionado'}
              </span>
            </div>

            {/* BARRA DE ACCIÓN (Asignación Individual) */}
            {viewModel.selectedTicketId && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-amber-900 dark:text-amber-200">
                  Asignar caso <strong className="font-bold">{viewModel.selectedTicketId}</strong> a:
                </span>
                <div className="flex items-center gap-2 flex-1 max-w-xs">
                  <select
                    value={viewModel.targetAgentId}
                    onChange={(e) => viewModel.setTargetAgentId(e.target.value)}
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded p-1.5 focus:outline-none"
                  >
                    <option value="">Seleccionar agente...</option>
                    {viewModel.users.length > 0 && viewModel.users.filter((a: any) => a.status !== 'FULL').map((agent: any) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.firstName + " " + (agent.lastName || "")}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={viewModel.asignTicket}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-medium text-xs rounded transition flex items-center gap-1 shrink-0"
                    disabled={!viewModel.targetAgentId}
                  >
                    Aplicar <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Listado de Tickets */}
            <div className="p-3 overflow-y-auto flex-1 space-y-2">
              {viewModel.filteredTickets.data.length > 0 && viewModel.filteredTickets.data.map((ticket: any) => {
                const isSelected = viewModel.selectedTicketId === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => viewModel.toggleSelectTicket(ticket.id)}
                    className={`p-3 rounded-lg border transition cursor-pointer flex items-start gap-3 ${isSelected
                      ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-950/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                  >
                    {/* Indicador visual de selección única (Radio Button) */}
                    <div className="mt-0.5 text-slate-400">
                      {isSelected ? (
                        <div className="h-4 w-4 rounded-full border-2 border-amber-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-amber-500 -translate-y-[0.5px] -translate-x-[0.5px]" />
                        </div>
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">{ticket.id}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {ticket?.title || ""}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <span>🏢 {ticket?.client?.name || ""}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ticket.createdAt}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
      <CreateTicketModal
        isOpen={viewModel.isModalOpen}
        onClose={() => viewModel.setIsModalOpen(false)}
        control={viewModel.control}
        errors={viewModel.errors}
        hasErrors={viewModel.hasErrors}
        isSubmitted={viewModel.isSubmitted}
        handleSubmit={viewModel.handleSubmit(viewModel.addTicket)}
        isLoading={viewModel.isLoading}
      />
    </>
  );
};