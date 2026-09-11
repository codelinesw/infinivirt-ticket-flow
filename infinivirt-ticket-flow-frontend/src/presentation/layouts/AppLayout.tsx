import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/header/Header';
import { Sidebar } from '../components/sidebar/Sidebar';
import { Footer } from '../components/footer/FooterComponent';
import { useAuthStore } from '../storage/zustand-store';

interface AppLayoutProps {}

export const AppLayout: React.FC<AppLayoutProps> = () => {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const _session = useAuthStore((s) => s.user_data);

  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/tickets')) return _session?.role === 'CLIENT' ? 'my-cases' : 'all-cases';
    if (path.startsWith('/assignments')) return 'assignments';
    if (path.startsWith('/tenants')) return 'tenants';
    if (path.startsWith('/users')) return 'users';
    if (path.startsWith('/help-center')) return 'help-center';
    if (path.startsWith('/reports')) return 'reports';
    if (path.startsWith('/profile')) return 'profile';
    return 'dashboard';
  };

  const handleTabChange = (tabId: string) => {
    switch (tabId) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'my-cases':
      case 'all-cases':
        navigate('/tickets');
        break;
      case 'assignments':
        navigate('/assignments');
        break;
      case 'tenants':
        navigate('/tenants');
        break;
      case 'users':
        navigate('/users');
        break;        
      case 'help-center':
        navigate('/help-center');
        break;
      case 'reports':
        navigate('/reports');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 font-sans antialiased overflow-hidden">
      {/* Header fijo en la parte superior abarcando todo el ancho */}
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Contenedor principal horizontal para Sidebar + Contenido */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar alineado a la izquierda */}
        <Sidebar
          role={_session?.role || "SUPERVISOR"}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeTab={getActiveTabFromPath()}
          setActiveTab={handleTabChange}
        />

        {/* Área de contenido flexible (ocupa todo el espacio restante) */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
            {/* Se elimina 'mx-auto' y 'max-w-7xl' para evitar que se centre en medio de la pantalla */}
            <div className="w-full">
              <Outlet />
            </div>
          </main>

          <Footer apiStatus="connected" />
        </div>
      </div>
    </div>
  );
};