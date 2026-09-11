// AuthContext.tsx
import { createContext, useEffect, type ReactNode, useMemo, useRef } from "react";
import { useAuthStore, selectAuthView } from "../storage/zustand-store";
import { useShallow } from "zustand/shallow";

export interface AuthContextType {
  user: any | null;
  hydrated: boolean;
  checking: boolean;
  isAuthed: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const { user, hydrated, checking, isAuthed, expired, refreshUser } =
    useAuthStore(useShallow(selectAuthView));

  // Evita doble ejecución en dev (StrictMode)
  const didCheckRef = useRef(false);

  useEffect(() => {
    if (!hydrated) return;

    // Si ya hay sesión válida, no llames al backend
    if (isAuthed) {
      return;
    }

    // Solo chequear una vez por “ciclo” de hidratación
    if (didCheckRef.current) return;
    didCheckRef.current = true;

    // Si no hay user o está expirada => refresca
    if (!user || expired) {
      refreshUser();
    }
  }, [hydrated, isAuthed, user, expired, refreshUser]);

  const value = useMemo(
    () => ({ user, hydrated, checking, isAuthed }),
    [user, hydrated, checking, isAuthed]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};