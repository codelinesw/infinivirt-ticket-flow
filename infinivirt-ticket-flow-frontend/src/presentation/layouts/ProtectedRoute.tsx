import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SectionLoader } from '../components/section-loader/section-loader-component';

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children
}) => {
  const { user, checking } = useAuth();
  if (checking) return <SectionLoader />;
  if (!user) return <Navigate to="/" replace />;
  return children;
}