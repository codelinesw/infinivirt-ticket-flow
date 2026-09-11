import React, { useState } from 'react';
import { Building2, Search, Plus, ExternalLink, ShieldCheck, Users, Ticket, CheckCircle2, XCircle, Pencil } from 'lucide-react';
import { CreateTenantModal } from '../../components/modals/create-tenant/CreateTenantModal';
import { useTenantViewModel } from './tenant-view-model';
import { Button } from '../../components/button/button-component';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  activeTickets: number;
  totalUsers: number;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export const TenantsView: React.FC = () => {
  const viewModel = useTenantViewModel();
  return (
    <div className="w-full space-y-6">
      {/* Header local */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Organizaciones</h1>
          <p className="text-xs text-slate-500">Gestión de empresas e instituciones integradas en la plataforma.</p>
        </div>
        <Button color='primary' onClick={() => { viewModel.setIsOpen(true) }}>
          <Plus className="h-4 w-4" /> Nueva Organización
        </Button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={viewModel.search}
          onChange={(e) => viewModel.setSearch(e.target.value)}
          placeholder="Buscar por empresa o dominio..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
        />
      </div>

      {/* Tabla de Tenants */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Organización</th>
                <th className="px-6 py-3.5">Celular</th>
                <th className="px-6 py-3.5">Correo</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {viewModel.filteredTenants.length > 0 && viewModel.filteredTenants.map((tenant: any) => (
                <tr key={tenant.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FE9501]/10 text-[#FE9501] border border-indigo-100">
                        <Building2 className="h-4 w-4 color-[#FE9501]" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{tenant.name}</p>
                        <p className="text-[11px] font-mono text-slate-400">{tenant.domain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-extrabold ${tenant.plan === 'ENTERPRISE'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : tenant.plan === 'PRO'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                      {tenant.phone ?? ""}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-slate-400" /> {tenant.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    {tenant.isActive ? (
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
                    <button className="cursor-pointer text-slate-400 hover:text-indigo-600 font-semibold text-[11px]" onClick={() => viewModel.openModal(tenant)}>
                      <Pencil className="w-3 h-3 text-slate-400 transition-colors group-focus-within:text-blue-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>        
      </div>
      {/* Componente Modal */}
      <CreateTenantModal
        isOpen={viewModel.isOpen}
        onClose={() => viewModel.setIsOpen(false)}
        control={viewModel.control}
        onSubmit={viewModel.handleSubmit(viewModel.save)}
        hasErrors={viewModel.hasErrors}
        isSubmitted={viewModel.isSubmitted}
      />
    </div>
  );
};