import React, { useState } from 'react';
import {
  ArrowLeft,
  UserCheck,
  Send,
  Lock,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import type { User, Ticket, TicketComment, TicketStatus, TicketPriority } from '../../types';
import { Avatar } from '../../components/avatar/AvatarComponent';
import { useTicketDetailViewModel } from './ticket-detail-view-model';
import { Controller } from 'react-hook-form';
import { TextArea } from '../../components/textarea/textarea-component';
import { useAuthStore } from '../../storage/zustand-store';

interface TicketDetailProps {
  ticketId: string;
  onBack: () => void;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId, onBack }) => {

  const user = useAuthStore((s) => s.user_data);
  const isStaff = ['ADMIN', 'SUPERVISOR', 'AGENT'].includes(user?.role);
  const isAdmin = user && user?.role === 'ADMIN';

  // Mock State del Ticket
  const [ticket, setTicket] = useState<Ticket>({
    id: ticketId,
    ticketNumber: 'TKN-1024',
    title: 'Fallo en la integración de pasarela de pagos PSE',
    description:
      'Los clientes reportan un error de tiempo de espera (Timeout 504) al intentar confirmar la transacción desde la aplicación móvil en el entorno de producción.',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    clientId: 'client_tenant_1',
    client: { id: 'client_tenant_1', name: 'Acme Corporation' },
    createdById: 'usr_201',
    createdBy: {
      id: 'usr_201',
      email: 'juan@acme.com',
      name: 'Juan Pérez',
      role: 'CLIENT',
      createdAt: '',
      updatedAt: '',
    },
    assignedToId: 'usr_agent_1',
    assignedTo: {
      id: 'usr_agent_1',
      email: 'carlos@ticketflow.io',
      name: 'Carlos Agente',
      role: 'AGENT',
      createdAt: '',
      updatedAt: '',
    },
    comments: [
      {
        id: 'c1',
        ticketId,
        authorId: 'usr_201',
        author: {
          id: 'usr_201',
          email: 'juan@acme.com',
          name: 'Juan Pérez',
          role: 'CLIENT',
          createdAt: '',
          updatedAt: '',
        },
        content: 'Adjunto logs del servidor donde se observa la caída del socket a las 10:15 AM.',
        isInternal: false,
        createdAt: '2026-09-08T10:35:00Z',
      },
      {
        id: 'c2',
        ticketId,
        authorId: 'usr_agent_1',
        author: {
          id: 'usr_agent_1',
          email: 'carlos@ticketflow.io',
          name: 'Carlos Agente',
          role: 'AGENT',
          createdAt: '',
          updatedAt: '',
        },
        content: 'Revisé la configuración del Webhook en el Dashboard del banco y el endpoint responde con HTTP 500. Escalando a infraestructura.',
        isInternal: true, // NOTA INTERNA
        createdAt: '2026-09-08T11:00:00Z',
      },
    ],
    createdAt: '2026-09-08T10:30:00Z',
    updatedAt: '2026-09-08T11:00:00Z',
  });

  // Estados locales para nuevos comentarios y acciones
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);


  // Lista de agentes para asignación (Simulado para ADMIN)
  const availableAgents: User[] = [
    { id: 'usr_agent_1', name: 'Carlos Agente', email: 'carlos@tf.io', role: 'AGENT', createdAt: '', updatedAt: '' },
    { id: 'usr_agent_2', name: 'Ana Silva', email: 'ana@tf.io', role: 'AGENT', createdAt: '', updatedAt: '' },
  ];

  // Filtrar notas internas si el usuario es CLIENT
  const visibleComments = (ticket.comments || []).filter(
    (comment: any) => !comment.isInternal || isStaff
  );

  const viewModel = useTicketDetailViewModel();

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="cursor-pointer inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al listado
      </button>

      {/* Main Ticket Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Col: Main Detail & Comments (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Main Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold text-indigo-600">
                  TK_{viewModel.ticketDetailData?.ticket_number || "TICKET_NUMBER_NO_DEFINIDO"}
                </span>
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold ${viewModel.ticketDetailData?.priority === 'URGENT'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}
                >
                  {viewModel.ticketDetailData?.priority}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Creado el {new Date(viewModel.ticketDetailData?.createdAt).toLocaleString()}
              </span>
            </div>

            <h1 className="mt-4 text-xl font-bold text-slate-900 leading-snug">
              {viewModel.ticketDetailData?.title}
            </h1>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 border border-slate-100 whitespace-pre-wrap">
              {viewModel.ticketDetailData?.description}
            </div>
          </div>

          {/* Comments Thread */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900">
              Historial y Conversación ({visibleComments.length})
            </h3>

            <div className="space-y-4">
              {viewModel.ticketComments.length > 0 && viewModel.ticketComments.map((comment: any) => (
                <div
                  key={comment.id}
                  className={`rounded-2xl p-4 border transition-all ${comment.isInternal
                    ? 'border-amber-200 bg-amber-50/60 ring-1 ring-amber-300/50'
                    : 'border-slate-100 bg-slate-50/50'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={((comment.user?.firstName || "") + " " + (comment.user?.lastName || "")) || ""} size="sm" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{((comment.user?.firstName || "") + " " + (comment.user?.lastName || "")) || ""}</p>
                        <span className="text-[10px] text-slate-500">{comment.user?.role?.name || ""}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {comment.isInternal && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 border border-amber-300">
                          <Lock className="h-3 w-3" /> NOTA INTERNA
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pl-10">
                    {comment.comment || ""}
                  </p>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={viewModel.handleSubmit(viewModel.handleAddComment)} className="mt-6 border-t border-slate-100 pt-4 space-y-3">
              <Controller
                name="comment"
                control={viewModel.control}
                rules={{
                  required: 'El campo es obligatorio',
                  validate: (value) => {
                    if (!value) {
                      return 'El campo es obligatorio';
                    }
                  },
                }}
                render={({ field }) => (
                  <TextArea
                    label={"Escribir respuesta"}
                    rows={3}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={
                      isInternal
                        ? 'Escribe una nota privada visible únicamente para el equipo técnico...'
                        : 'Escribe un comentario visible para el cliente...'
                    }
                    customStyles={viewModel.isSubmitted && viewModel.errors.comment
                      ? 'border-red-500 bg-red-50/20 placeholder-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : isInternal
                        ? 'border-amber-300 bg-amber-50/30 focus:ring-amber-500/20'
                        : 'border-slate-200 bg-slate-50/50 focus:ring-indigo-500/20'}
                    errorMessage={viewModel.errors.comment?.message as string || undefined}
                  />
                )}
              />

              <div className="flex items-center justify-between">
                {/* Checkbox Nota Interna (Restringido Visualmente) */}
                {isStaff ? (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-xs font-semibold text-amber-800 flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5 text-amber-600" /> ¿Es nota interna? (Oculto al cliente)
                    </span>
                  </label>
                ) : <div />}

                <button
                  type="submit"
                  disabled={submittingComment}
                  className={`cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition-all ${isInternal
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                    }`}
                >
                  {submittingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" /> Enviar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Metadata & Controls Sidebar (1 col) */}
        <div className="space-y-6">
          {/* Control Panel Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Control del viewModel.ticketDetailData
            </h3>

            {/* Status Switcher (Restringido para STAFF) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Estado</label>
              {isStaff ? (
                <select
                  value={viewModel.ticketDetailData?.status}
                  disabled={viewModel.updatingStatus}
                  onChange={(e) => viewModel.handleStatusChange(e.target.value as TicketStatus)}
                  className="cursor-pointer w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="OPEN">Abierto</option>
                  <option value="IN_PROGRESS">En Progreso</option>
                  <option value="RESOLVED">Resuelto</option>
                  <option value="CLOSED">Cerrado</option>
                </select>
              ) : (
                <span className="cursor-pointer inline-block rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 border border-slate-200">
                  {viewModel.ticketDetailData?.status}
                </span>
              )}
            </div>

            {/* Assignee Switcher (Restringido para ADMIN) */}
            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <label className="block text-xs font-semibold text-slate-700">
                Agente Asignado
              </label>
              {isAdmin ? (
                <select
                  value={ticket.assignedToId || ''}
                  onChange={(e) => viewModel.handleAssignAgent(e.target.value)}
                  className="cursor-pointer w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Sin Asignar</option>
                  {viewModel.users.map((ag: any) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.firstName + " " + (ag.lastName || "")} ({ag.role.name === "AGENT" ? "Agente" : (ag.role.name === "CLIENT" ? "Organización" : "Supervisor")})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                  <UserCheck className="h-4 w-4 text-slate-400" />
                  <span>{ticket.assignedTo?.name || 'Sin Asignar'}</span>
                </div>
              )}
            </div>

            {/* Tenant Info */}
            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <span className="block text-xs font-semibold text-slate-700">Organización</span>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span className="font-semibold">{viewModel.ticketDetailData?.client?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};