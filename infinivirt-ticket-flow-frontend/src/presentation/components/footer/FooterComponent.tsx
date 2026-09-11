import React from 'react';

interface FooterProps {
  apiStatus?: 'connected' | 'disconnected' | 'connecting';
}

export const Footer: React.FC<FooterProps> = ({ apiStatus = 'connected' }) => {
  return (
    <footer className="flex h-12 w-full items-center justify-between border-t border-slate-200 bg-white px-6 text-xs text-slate-500">
      <div>
        © {new Date().getFullYear()} <span className="font-semibold text-slate-700">TicketFlow Inc.</span> Todos los derechos reservados.
      </div>

      <div className="flex items-center gap-4">
        <span className="font-mono text-[11px] text-slate-400">v1.0.0</span>
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              apiStatus === 'connected'
                ? 'bg-emerald-500 animate-pulse'
                : apiStatus === 'connecting'
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          />
          <span className="text-[11px] font-medium capitalize text-slate-600">
            API: {apiStatus}
          </span>
        </div>
      </div>
    </footer>
  );
};