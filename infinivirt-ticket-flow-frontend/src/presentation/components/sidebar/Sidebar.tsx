import React from 'react';
import {
  LayoutDashboard,
  Ticket,
  FolderKanban,
  Users,
  HelpCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Building2
} from 'lucide-react';
import type { Role } from '../../types';

interface SidebarProps {
  role: Role;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: Role[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  collapsed,
  onToggleCollapse,
  activeTab,
  setActiveTab,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'SUPERVISOR', 'AGENT', 'CLIENT'],
    },
    {
      id: 'my-cases',
      label: 'Mis Casos',
      icon: Ticket,
      roles: ['CLIENT'],
    },
    {
      id: 'all-cases',
      label: 'Todos los Casos',
      icon: Ticket,
      roles: ['ADMIN', 'SUPERVISOR', 'AGENT'],
    },
    {
      id: 'assignments',
      label: 'Asignaciones',
      icon: FolderKanban,
      roles: ['ADMIN', 'SUPERVISOR', 'AGENT'],
    },
    {
      id: 'tenants',
      label: 'Organizaciones',
      icon: Building2,
      roles: ['ADMIN', 'SUPERVISOR'],
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: Users,
      roles: ['ADMIN', 'SUPERVISOR'],
    },
    {
      id: 'help-center',
      label: 'Centro de Ayuda',
      icon: HelpCircle,
      roles: ['ADMIN', 'SUPERVISOR', 'AGENT', 'CLIENT'],
    },
    {
      id: 'reports',
      label: 'Reportes & SLA',
      icon: BarChart3,
      roles: ['ADMIN', 'SUPERVISOR'],
    },
  ];

  // Filtrado RBAC
  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Menu items */}
      <div className="flex-1 space-y-1.5 p-3">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`cursor-pointer group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#FE9501] text-white shadow-md shadow-[#FE9501]-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Direct Support & Collapse Button */}
      <div className="border-t border-slate-800 p-3 space-y-2">
        {!collapsed && (
          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 text-[#FE9501]">
              <Headphones className="h-4 w-4" />
              <span className="text-xs font-semibold">Soporte Directo</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              ¿Problemas con el portal? Contáctanos 24/7.
            </p>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-800/40 py-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
};