import React from 'react';
import { Shield, Key, Mail, Building, Clock, Lock } from 'lucide-react';
import type { User } from '../../types';
import { Avatar } from '../../components/avatar/AvatarComponent';
import { useAuthStore } from '../../storage/zustand-store';

interface UserProfileProps {
  user?: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const _session = useAuthStore((s) => s.user_data);
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mi Perfil</h1>
        <p className="text-xs text-slate-500">Configuración de cuenta y detalles de acceso de tu sesión actual.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <Avatar name={(_session?.firstName + " " + (_session.lastName || "")) || ""} src={user?.avatarUrl} size="lg" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{(_session?.firstName + " " + (_session.lastName || "")) || ""}</h2>
            <p className="text-xs text-slate-500">{_session?.email}</p>
            <span className="mt-2 inline-block rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700">
              ROL: {_session?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Key className="h-3.5 w-3.5" /> User ID (Prisma)
            </span>
            <p className="font-mono font-bold text-slate-800">{_session?.id}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Building className="h-3.5 w-3.5" /> Tenant / Client ID
            </span>
            <p className="font-mono font-bold text-slate-800">{_session?.clientId || 'N/A (Global Staff)'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};