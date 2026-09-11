import { create } from 'zustand';
import { persist } from "zustand/middleware";
import type { ReactNode } from 'react';
import { AuthRepository } from '../../data/repositories/remote/auth.repository';
import { useNavigate } from 'react-router-dom';

interface Toast {
  show: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  duration?: number;
}

interface PopUp {
  show: boolean;
  icon: string;
  title: string;
  description: string;
}

interface Notification {
  show: boolean;
}

interface GlobalState {
  loading: boolean;
  setLoading: (value: boolean) => void;
  toast: Toast;
  showToast: (icon: ReactNode, title?: string, description?: string, duration?: number) => void;
  hideToast: () => void;
  popUp: PopUp;
  showPopUp: (icon: string, title?: string, description?: string, duration?: number) => void;
  hidePopUp: () => void;
  notification: Notification;
  notifications: any[],
  setNotifications: (item: any) => void;
  updateNotifications: (id: number, updatedData: any) => void;
  showNotifications: () => void;
  hideNotifications: () => void;
  otpContact: string;
  setOtpContact: (value: string) => void;
}

export const useGlobalStore = create<GlobalState>((set: any) => ({
  //Loader
  loading: false,
  setLoading: (value: boolean) => set({ loading: value }),

  //Toast
  toast: { show: false, icon: 'check', title: '', description: '' },
  showToast: (icon, title, description) => set({ toast: { show: true, icon: icon, title: title, description: description } }),
  hideToast: () => set({ toast: { show: false, icon: '', title: '', description: '' } }),

  //PopUp
  popUp: { show: false, icon: '', title: '', description: '' },
  showPopUp: (icon, title, description) => set({ popUp: { show: true, icon: icon, title: title, description: description } }),
  hidePopUp: () => set({ popUp: { show: false, icon: '', title: '', description: '' } }),

  notifications: [],
  setNotifications: (item: any) => set((state: any) => ({
    notifications: [...state.notifications, item], // 👈 copia + nuevo
  })),
  updateNotifications: (id: number, updatedData: any) => set((state: any) => ({
    notifications: state.notifications.map((item: any) =>
      item.id === id
        ? { ...item, ...updatedData } // 👈 actualizado
        : item
    ),
  })),
  notification: { show: false },
  showNotifications: () =>
    set({
      notification: {
        show: true
      },
    }),
  hideNotifications: () =>
    set({
      notification: {
        show: false
      },
    }),

  //Layout control
  marginLeft: "0%",
  setMarginLeft: (value: string) => set({ marginLeft: value }),

  //OTP
  otpContact: "",
  setOtpContact: (value: string) => set({ otpContact: value }),

}));

interface AuthState {
  user_data: any | null;
  loading: boolean;
  session_expiry: number | null;
  hydrated: boolean;   // ya se rehidrató desde localStorage
  checking: boolean;   // llamada a backend en curso
  setHydrated: (v: boolean) => void;
  refreshUser: () => Promise<void>;
  onAuthSuccess: () => Promise<void>; // para llamar después de login/register
  logout: () => Promise<void>;
  localLogout: () => Promise<void>;
};

const authRepository = new AuthRepository();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user_data: null,
      loading: true,
      session_expiry: null,
      hydrated: false,
      checking: false,
      setHydrated: (v) => set({ hydrated: v }),
      refreshUser: async () => {
        // evita doble request simultánea
        if (get().checking) return;
        set({ checking: true });
        try {
          const res = await authRepository.getMe();
          const user = res.data; // <-- define 1 sola estructura
          set({
            user_data: user,
            session_expiry: Date.now() + 30 * 60 * 1000,
            checking: false,
          });
        } catch {
          set({ user_data: null, session_expiry: null, checking: false });
        }
      },
      // Se llama cuando login/register termina OK
      onAuthSuccess: async () => {
        // Si quieres “optimista” con local cache, puedes validar expiry aquí
        await get().refreshUser();
      },

      logout: async () => {
        const globalState = useGlobalStore.getState();
        try {
          globalState.setLoading(true);
          await authRepository.logout();
          localStorage.removeItem("ticket_flow_auth");
          set({ user_data: null, session_expiry: null, checking: false });
          globalState.setLoading(false);
        } catch {
          globalState.setLoading(false);
          set({ user_data: null, session_expiry: null, checking: false });
        }
      },
      
      localLogout: async () => {
        try {
          localStorage.removeItem("ticket_flow_auth");
          set({ user_data: null, session_expiry: null, checking: false });
        } catch {
          set({ user_data: null, session_expiry: null, checking: false });
        }
      },
    }),
    {
      name: "ticket_flow_auth", // localStorage key
      partialize: (state) => ({ user_data: state.user_data, session_expiry: state.session_expiry }), // no guardes loading
      // marca hydrated cuando termine de rehidratar
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Selector derivado (no lo guardes en persist)
export const selectAuthView = (s: AuthState) => {
  const expired = !s.session_expiry || Date.now() >= s.session_expiry;
  const isAuthed = !!s.user_data && !expired;
  return {
    user: s.user_data,
    hydrated: s.hydrated,
    checking: s.checking,
    isAuthed,
    expired,
    refreshUser: s.refreshUser,
  };
};


// 1. Interfaces de los Modelos (Singular)
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  email: string;
  isActive: boolean;
}

export interface Rol {
  name: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  rol: Rol;
  email: string;
  isActive: boolean;
}

// 2. Interfaces de los Stores
interface TenantsStore {
  items: Tenant[];  
  setTenants: (newItems: Client[]) => void;
  tenantId: string | null;
  setTenantId: (id: string) => void;
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant | null) => void;
  addItem: (newItem: Tenant) => void;
  updateItem: (id: string, updatedData: Partial<Tenant>) => void;
  removeItem: (id: string) => void;
}

interface ClientsStore {
  items: Client[];
  setClients: (newItems: Client[]) => void;
  clientId: string | null;
  setClientId: (id: string) => void;
  currentClient: Client | null;
  setCurrentClient: (client: Client) => void;
  addItem: (newItem: Client) => void;
  updateItem: (id: string, updatedData: Partial<Client>) => void;
  removeItem: (id: string) => void;
}

// 3. Creación de Stores
export const useTenantsStore = create<TenantsStore>((set) => ({
  items: [],  
  setTenants: (newItems: any) => set({ items: newItems }),
  tenantId: null,
  setTenantId: (id: any) => set({ tenantId: id }),
  currentTenant: null,
  setCurrentTenant: (client: Tenant) => set({ currentTenant: client }),
  addItem: (newItem) =>
    set((state) => ({
      items: [...state.items, newItem],
    })),

  updateItem: (id, updatedData) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));

export const useClientsStore = create<ClientsStore>((set) => ({
  items: [],
  setClients: (newItems: any) => set({ items: newItems }),
  clientId: null,
  setClientId: (id: any) => set({ clientId: id }),
  currentClient: null,
  setCurrentClient: (client: Client) => set({ currentClient: client }),
  addItem: (newItem) =>
    set((state) => ({
      items: [...state.items, newItem],
    })),

  updateItem: (id, updatedData) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));