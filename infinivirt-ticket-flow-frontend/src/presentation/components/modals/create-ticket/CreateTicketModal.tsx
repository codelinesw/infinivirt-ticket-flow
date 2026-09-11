import React from 'react';
import { X, Send, Loader2, Tag, FileText, Building2 } from 'lucide-react';
import type { User } from '../../../types';
import { Input } from '../../input/input-component';
import { TextArea } from '../../textarea/textarea-component';
import { Controller } from 'react-hook-form';
import { Alert } from '../../alert/alert-component';
import { Button } from '../../button/button-component';
import { useAuthStore } from '../../../storage/zustand-store';

interface CreateTicketModalProps {
  control?: any;
  errors: any;
  hasErrors?: any;
  isSubmitted: boolean;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  handleSubmit?:() => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  control,
  errors,
  hasErrors,
  isSubmitted,
  isOpen,
  onClose,
  isLoading,
  handleSubmit
}) => {
  const user = useAuthStore((s) => s.user_data);
  const isStaff = ['ADMIN', 'SUPERVISOR', 'AGENT'].includes(user?.role);

  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  // const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  // const [clientId, setClientId] = useState(user?.clientId || 'client_tenant_1');
  // const [submitting, setSubmitting] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);

  //   if (!title.trim() || !description.trim()) {
  //     setError('Por favor completa todos los campos requeridos.');
  //     return;
  //   }

  //   setSubmitting(true);
  //   try {
  //     // Simulación de petición al Backend (POST /tickets)
  //     await new Promise((resolve) => setTimeout(resolve, 600));

  //     // Reset del formulario
  //     setTitle('');
  //     setDescription('');
  //     setPriority('MEDIUM');

  //     if (onSuccess) onSuccess();
  //     onClose();
  //   } catch (err: any) {
  //     setError(err.message || 'Error al crear el ticket.');
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Crear Nuevo Ticket</h2>
            <p className="text-xs text-slate-500">Radica un nuevo caso de soporte o requerimiento técnico.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Alerta de Error */}
        {isSubmitted && hasErrors && <Alert variant='error'> Por favor completa todos los campos requeridos</Alert>}

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Asunto / Título */}
          <Controller
            name="title"
            control={control}
            rules={{
              required: 'El campo es obligatorio',
              validate: (value) => {
                if (!value) {
                  return 'El campo es obligatorio';
                }
              },
            }}
            render={({ field }) => (
              <Input
                label={"Asunto o Título del Caso "}
                value={field.value}
                onChange={field.onChange}
                placeholder={"Ej. Error al exportar reportes en PDF"}
                Icon={<FileText className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 transition-colors group-focus-within:text-blue-400" />}
                isRequired
              />
            )}
          />

          {/* Selección de Prioridad y Organización */}
          <Controller
            name="priority"
            control={control}
            rules={{
              required: 'El campo es obligatorio',
              validate: (value) => {
                if (!value) {
                  return 'El campo es obligatorio';
                }
              },
            }}
            render={({ field }) => (
              <div className="w-full">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prioridad <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <select
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="LOW">Baja (LOW)</option>
                      <option value="MEDIUM">Media (MEDIUM)</option>
                      <option value="HIGH">Alta (HIGH)</option>
                      <option value="CRITICAL">Urgente (URGENT)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          />

          {/* Selector de Cliente / Tenant (Solo visible si es STAFF) */}
          {isStaff && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organización
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Controller
                  name="clientId"
                  control={control}
                  rules={{
                    required: 'El campo es obligatorio',
                    validate: (value) => {
                      if (!value) {
                        return 'El campo es obligatorio';
                      }
                    },
                  }}
                  render={({ field }) => (<select
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="157cfe1c-f4c1-4737-b734-5fcd09252415">Acme Corporation</option>
                    <option value="157cfe1c-f4c1-4737-b734-5fcd09252412">Stark Industries</option>
                  </select>)}

                />
              </div>
            </div>
          )}

          {/* Descripción Detallada */}
          <Controller
            name="comment"
            control={control}
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
                label={"Descripción Detallada"}
                rows={3}
                value={field.value}
                onChange={field.onChange}
                placeholder={"Explica detalladamente lo ocurrido, pasos para reproducirlo o información relevante..."}
                errorMessage={errors.comment?.message as string || undefined}
                customStyles={"border border-slate-200"}
                isRequired
              />
            )}
          />

          {/* Modal Footer / Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <Button
              color='white'
              onClick={onClose}              
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" /> Radicar Ticket
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};