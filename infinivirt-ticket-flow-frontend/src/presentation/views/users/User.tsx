import React from 'react';
import { Search, Plus, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { useUserViewModel } from './user-view-model';
import { Button } from '../../components/button/button-component';
import { CreateUserModal } from '../../components/modals/create-user/CreateUserModal';
import { Avatar } from '../../components/avatar/AvatarComponent';

export const UserView: React.FC = () => {
  const viewModel = useUserViewModel();
  return (
    <div className="w-full space-y-6">
      {/* Header local */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Usuarios</h1>
          <p className="text-xs text-slate-500">Gestión de usuarios internos en la plataforma.</p>
        </div>
        <Button color='primary' onClick={() => { viewModel.setIsOpen(true) }}>
          <Plus className="h-4 w-4" /> Nuevo usuario
        </Button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={viewModel.search}
          onChange={(e) => viewModel.setSearch(e.target.value)}
          placeholder="Buscar por usuario o correo"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
        />
      </div>

      {/* Tabla de Tenants */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Usuario</th>
                <th className="px-6 py-3.5">Rol</th>
                <th className="px-6 py-3.5">Correo</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {viewModel.filteredUsers.length > 0 && viewModel.filteredUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={(user?.firstName + " " +(user?.lastName || ""))} size='sm' />
                      <div>
                        <p className="font-bold text-slate-900">{user?.firstName + " " +(user?.lastName || "")}</p>
                        <p className="text-[11px] font-mono text-slate-400">{user.domain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-extrabold ${user.role?.name === 'ADMIN'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : user.role?.name === 'SUPERVISOR'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                      {user.role?.name ?? ""}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" /> {user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                        <XCircle className="h-3 w-3" /> Suspendido
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-indigo-600 font-semibold text-[11px]">
                      Configurar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>        
      </div>
      {/* Componente Modal */}
      <CreateUserModal
        isOpen={viewModel.isOpen}
        onClose={() => viewModel.setIsOpen(false)}
        control={viewModel.control}
        onSubmit={viewModel.handleSubmit(viewModel.createUser)}
        hasErrors={viewModel.hasErrors}
        isSubmitted={viewModel.isSubmitted}
      />
    </div>
  );
};