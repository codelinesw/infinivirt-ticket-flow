import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Ticket as TicketIcon,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import type { User, Ticket, TicketStatus, TicketPriority, PaginatedResponse } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { useTicketViewModel } from './ticket-view-model';
import { Button } from '../../components/button/button-component';
import { useAuthStore } from '../../storage/zustand-store';

interface TicketListProps {
  onSelectTicket: (ticketId: string) => void;
  onCreateTicket?: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({  
  onSelectTicket,
  onCreateTicket,
}) => {

  const user = useAuthStore((s) => s.user_data);
  const isClient = user && user.role === 'CLIENT';

  // Estados de consulta y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  // Debounce del buscador (400ms)
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Simulación de Fetch a la API: GET /api/v1/tickets?search=...&status=...&priority=...&page=...&limit=...
  const fetchTickets = useCallback(async () => {
    //setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock Dataset
      const mockTickets: Ticket[] = [
        {
          id: 'tkn-101',
          ticketNumber: 'TKN-1024',
          title: 'Fallo en la integración de pasarela de pagos PSE',
          description: 'Los clientes reportan timeout al intentar confirmar la transacción.',
          status: 'IN_PROGRESS',
          priority: 'URGENT',
          clientId: 'client_tenant_1',
          client: { id: 'client_tenant_1', name: 'Acme Corp' },
          createdById: 'usr_201',
          createdBy: { id: 'usr_201', email: 'juan@acme.com', name: 'Juan Pérez', role: 'CLIENT', createdAt: '', updatedAt: '' },
          assignedToId: 'usr_agent_1',
          assignedTo: { id: 'usr_agent_1', email: 'soporte@ticketflow.io', name: 'Carlos Agente', role: 'AGENT', createdAt: '', updatedAt: '' },
          createdAt: '2026-09-08T10:30:00Z',
          updatedAt: '2026-09-09T14:20:00Z',
        },
        {
          id: 'tkn-102',
          ticketNumber: 'TKN-1023',
          title: 'Error de renderizado en exportación de facturas PDF',
          description: 'El encabezado se corta cuando el documento supera las 2 páginas.',
          status: 'OPEN',
          priority: 'HIGH',
          clientId: user?.clientId || 'client_tenant_1',
          client: { id: 'client_tenant_1', name: 'Stark Tech' },
          createdById: 'usr_202',
          createdBy: { id: 'usr_202', email: 'marta@stark.com', name: 'Marta Díaz', role: 'CLIENT', createdAt: '', updatedAt: '' },
          assignedToId: null,
          assignedTo: null,
          createdAt: '2026-09-09T08:15:00Z',
          updatedAt: '2026-09-09T08:15:00Z',
        },
        {
          id: 'tkn-103',
          ticketNumber: 'TKN-1022',
          title: 'Solicitud de actualización de credenciales API Webhook',
          description: 'Requerimos la regeneración de tokens para el entorno de producción.',
          status: 'RESOLVED',
          priority: 'MEDIUM',
          clientId: 'client_tenant_2',
          client: { id: 'client_tenant_2', name: 'Cyberdyne' },
          createdById: 'usr_203',
          createdBy: { id: 'usr_203', email: 'dev@cyberdyne.com', name: 'Alex Murphy', role: 'CLIENT', createdAt: '', updatedAt: '' },
          assignedToId: 'usr_agent_2',
          assignedTo: { id: 'usr_agent_2', email: 'ana@ticketflow.io', name: 'Ana Silva', role: 'AGENT', createdAt: '', updatedAt: '' },
          createdAt: '2026-09-05T11:00:00Z',
          updatedAt: '2026-09-07T16:45:00Z',
        },
      ];

      // Filtrado simulado en Backend / Prisma
      let filtered = mockTickets;

      // Restricción RBAC para CLIENT
      if (isClient && user?.clientId) {
        filtered = filtered.filter((t) => t.clientId === user?.clientId);
      }

      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query) ||
            t.ticketNumber.toLowerCase().includes(query)
        );
      }

      if (statusFilter !== 'ALL') {
        filtered = filtered.filter((t) => t.status === statusFilter);
      }

      if (priorityFilter !== 'ALL') {
        filtered = filtered.filter((t) => t.priority === priorityFilter);
      }

      // setTicketData({
      //   data: filtered,
      //   pagination: {
      //     page: currentPage,
      //     limit,
      //     total: filtered.length,
      //     totalPages: Math.ceil(filtered.length / limit) || 1,
      //   },
      // });
    } catch (error) {
      console.error('Error al obtener tickets:', error);
    } finally {
      //setLoading(false);
    }
  }, [debouncedSearch, statusFilter, priorityFilter, currentPage, limit, isClient, user?.clientId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const getStatusBadge = (status: TicketStatus) => {
    const styles: Record<TicketStatus, string> = {
      OPEN: 'bg-amber-50 text-amber-700 border-amber-200',
      IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
      RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      CLOSED: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    const labels: Record<TicketStatus, string> = {
      OPEN: 'Abierto',
      IN_PROGRESS: 'En Progreso',
      RESOLVED: 'Resuelto',
      CLOSED: 'Cerrado',
    };
    return (
      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    const styles: Record<TicketPriority, string> = {
      LOW: 'bg-slate-100 text-slate-700 border-slate-200',
      MEDIUM: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
      URGENT: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse',
    };
    return (
      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-extrabold tracking-wider ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  const navigate = useNavigate();
  const viewModel = useTicketViewModel();

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isClient ? 'Mis Casos de Soporte' : 'Gestión de Casos & Tickets'}
          </h1>
          <p className="text-xs text-slate-500">
            {isClient
              ? 'Listado de tickets vinculados a tu organización.'
              : 'Vista global de solicitudes para triaje, asignación y resolución.'}
          </p>
        </div>

        {onCreateTicket && (
          <Button
            onClick={onCreateTicket}
          >
            <Plus className="h-4 w-4" /> Crear Nuevo Ticket
          </Button>
        )}
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
              setCurrentPage(1);
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
                setCurrentPage(1);
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
                setCurrentPage(1);
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

      {/* <div>{JSON.stringify(viewModel.filteredTickets)}</div> */}
      {/* Main Table Content */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {viewModel.loading ? (
          <div className="flex h-64 w-full items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" /> Cargando tickets...
          </div>
        ) : !viewModel.loading && viewModel.filteredTickets.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
              <TicketIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No se encontraron casos</p>
            <p className="mt-1 text-xs text-slate-500">Intenta ajustar los filtros de búsqueda o crea un nuevo ticket.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Código / Título</th>
                  <th className="px-5 py-3.5 font-semibold">Estado</th>
                  <th className="px-5 py-3.5 font-semibold">Prioridad</th>
                  {!isClient && <th className="px-5 py-3.5 font-semibold">Cliente</th>}
                  <th className="px-5 py-3.5 font-semibold">Asignado a</th>
                  <th className="px-5 py-3.5 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {viewModel.filteredTickets.data.map((ticket: any) => (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="group cursor-pointer transition-colors hover:bg-indigo-50/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] font-bold text-indigo-600 group-hover:underline">
                          TK_{ticket.ticket_number || ""}
                        </span>
                        <span className="mt-0.5 font-semibold text-slate-900 group-hover:text-indigo-900 line-clamp-1">
                          {ticket.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">{getStatusBadge(ticket.status)}</td>
                    <td className="px-5 py-4">{getPriorityBadge(ticket.priority)}</td>
                    {!isClient && (
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium truncate">{ticket.client?.name || 'N/A'}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-5 py-4">
                      {ticket.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="font-medium text-slate-800">{ticket.assignee.firstName || ""} {ticket.assignee.lastName || ""}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Sin Asignar</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Server-Side Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          <span>
            Mostrando <strong className="font-semibold text-slate-800">{viewModel.filteredTickets.data.length}</strong> de{' '}
            <strong className="font-semibold text-slate-800">{viewModel.filteredTickets.pagination.total}</strong> resultados
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1 || viewModel.loading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-medium text-slate-700">
              Página {viewModel.filteredTickets.pagination.page} de {viewModel.filteredTickets.pagination.totalPages}
            </span>
            <button
              disabled={currentPage >= viewModel.filteredTickets.pagination.totalPages || viewModel.loading}
              onClick={() => setCurrentPage((p) => Math.min(viewModel.filteredTickets.pagination.totalPages, p + 1))}
              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};