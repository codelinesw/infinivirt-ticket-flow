import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { SectionLoader } from "../components/section-loader/section-loader-component";
import { Navigate } from "react-router-dom";

interface LoginRouteProps { 
    children: ReactNode
 }
export const  LoginRoute: React.FC<LoginRouteProps> = ({ children }) => {
  const { user, checking } = useAuth();
  if (checking) return <SectionLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}