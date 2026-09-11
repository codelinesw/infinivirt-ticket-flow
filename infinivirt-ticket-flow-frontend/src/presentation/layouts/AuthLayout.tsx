import React from 'react';
import { Ticket } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Decorator */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20">
            <Ticket className="h-7 w-7" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Ticket<span className="text-indigo-500">Flow</span>
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow-2xl rounded-2xl border border-slate-100 sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};