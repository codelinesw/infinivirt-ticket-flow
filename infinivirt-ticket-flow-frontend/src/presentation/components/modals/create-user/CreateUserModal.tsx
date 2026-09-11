import React, { useState } from 'react';
import { X, Plus, Lock, Loader2, Smartphone, Mail, User, UserKey } from 'lucide-react';
import { Input } from '../../input/input-component';
import { Controller } from 'react-hook-form';
import { Switch } from '../../switch/switch-component';
import { Alert } from '../../alert/alert-component';
import { Button } from '../../button/button-component';

interface CreateUserModalProps {
  isOpen: boolean;
  control: any;
  hasErrors?: boolean;
  isSubmitted?: boolean;
  onSubmit?: () => void;
  onClose: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  control,
  hasErrors,
  isSubmitted,
  onSubmit,
  onClose
}) => {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [plan, setPlan] = useState<'BASIC' | 'PRO' | 'ENTERPRISE'>('PRO');
  const [maxUsers, setMaxUsers] = useState<number>(10);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !domain.trim()) {
      setError('Por favor ingresa el nombre de la empresa y su dominio.');
      return;
    }

    setSubmitting(true);
    try {
      // Simulación de petición al Backend (POST /tenants)
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Limpiar campos
      setName('');
      setDomain('');
      setPlan('PRO');
      setMaxUsers(10);

      //if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al registrar la organización.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Registrar nuevo usuario</h2>
            <p className="text-xs text-slate-500">Crea una usuario interno.</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mensaje de Error */}
        {hasErrors && isSubmitted && (
          <Alert variant='error' title='Ups!'>Debes de completar todos los campos</Alert>
        )}

        {/* Formulario */}
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="flex gap-2">
            {/* Nombre de la empresa */}
            <Controller
              name="firstName"
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
                  label={"Nombres"}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={"Ej. Error al exportar reportes en PDF"}
                  Icon={<User className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 transition-colors group-focus-within:text-blue-400" />}
                  isRequired
                />
              )}
            />
            {/* Nombre de la empresa */}
            <Controller
              name="lastName"
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
                  label={"Apellido"}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={"Ej. Error al exportar reportes en PDF"}
                  Icon={<User className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 transition-colors group-focus-within:text-blue-400" />}
                  isRequired
                />
              )}
            />
          </div>

          { /* Correo coorporativo */}
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'El campo es obligatorio',
              validate: (value) => {
                if (!value || !value.trim()) {
                  return 'El campo es obligatorio';
                }
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(value)) {
                  return 'Ingresa un correo electrónico válido';
                }
                return true;
              },
            }}
            render={({ field }) => (
              <Input
                label={"Correo electrónico"}
                placeholder={"example@gmail.com"}
                Icon={<Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 transition-colors group-focus-within:text-blue-400" />}
                value={field.value}
                onChange={field.onChange}
                max={20}
                maxLength={20}
                isRequired
              />
            )}
          />

          {/* Dominio Empresarial */}
          <Controller
            name="password"
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
                type="password"
                label={"Contraseña"}
                value={field.value}
                onChange={field.onChange}
                placeholder={"yourdomain.com"}
                Icon={<Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 transition-colors group-focus-within:text-blue-400" />}
              />
            )}
          />

          {/* Rol */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rol
            </label>
            <div className="relative">
              <UserKey className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Controller
                name="roleId"
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
                  <option value="514216ef-e448-4da7-9b5e-abb874359eec5">Supervisor</option>
                  <option value="e8e3cd22-decd-4207-a596-35f56404a35e">Agente de soporte</option>
                  <option value="f56aa016-1ed0-4aec-96ea-abd27482759c">Administrador</option>
                </select>)}

              />
            </div>
          </div>

          {/* Activar / Desactivar */}
          <Controller
            name="isActive"
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
              <Switch
                label={"Activo"}
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {/* Footer de Acciones */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <Button
              color="white"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" /> Registrar usuario
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};