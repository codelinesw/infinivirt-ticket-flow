import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Menu,
  Ticket,
  LogOut,
  User as UserIcon,
  Settings,
  Check,
  ChevronDown
} from 'lucide-react';
import type { User, NotificationItem } from '../../types';
import { Avatar } from '../avatar/AvatarComponent';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../storage/zustand-store';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Mock de notificaciones iniciales
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Nuevo Ticket Asignado',
      message: 'Se te ha asignado el ticket TKN-1024',
      read: false,
      createdAt: 'Hace 5 min',
    },
    {
      id: '2',
      title: 'Respuesta de cliente',
      message: 'El cliente adjunto información en TKN-1019',
      read: false,
      createdAt: 'Hace 1 hora',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const navigate = useNavigate();

  const _session = useAuthStore((s) => s.user_data);
  const logout = useAuthStore((s) => s.logout);

  if (!_session) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md transition-all">
      {/* Izquierda: Logo + Sidebar Toggle + Environment */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FE9501] text-white shadow-md shadow-[#FE9501]-200">
            <Ticket className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Ticket<span className="text-[#FE9501]">Flow</span>
          </span>
        </div>

        <span className="ml-2 hidden rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200 sm:inline-block">
          PROD v1.0
        </span>
      </div>

      {/* Derecha: Notificaciones + Avatar & Dropdown */}
      <div className="flex items-center gap-3">
        {/* Dropdown Notificaciones */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-800">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    <Check className="h-3 w-3" /> Marcar leídas
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">Sin notificaciones</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 transition-colors hover:bg-slate-50 ${
                        !item.read ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                        <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="cursor-pointer flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Avatar name={(_session?.firstName + " " + (_session.lastName || "")) || ""} src={_session?.avatarUrl || ""} size="sm" />
            <div className="hidden text-left md:block mt-1">
              <p className="text-xs font-semibold text-slate-800 leading-none">{(_session?.firstName + " " + (_session.lastName || "")) || ""}</p>
              <span className={`block rborder text-[9px] font-bold`}>
                {_session?.role || ""}
              </span>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{(_session?.firstName + " " + (_session.lastName || "")) || ""}</p>
                <p className="text-[11px] text-slate-500 truncate">{_session?.email || ""}</p>
              </div>

              <div className="py-1">
                <button
                  className="cursor-pointer flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  onClick={() => {
                    navigate("/profile")
                  }}
                >
                  <UserIcon className="h-4 w-4 text-slate-400" /> Mi Cuenta
                </button>
                <button
                  className="cursor-pointer flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Settings className="h-4 w-4 text-slate-400" /> Configuración
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={logout}
                  className="cursor-pointer flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4 text-rose-500" /> Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};