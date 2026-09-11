import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { User, AuthState } from './presentation/types';
import { ProtectedRoute } from './presentation/layouts/ProtectedRoute';

// Layouts
import { AuthLayout } from './presentation/layouts/AuthLayout';
import { AppLayout } from './presentation/layouts/AppLayout';

// Vistas
import { SignIn } from './presentation/views/sign-in/SignIn';
import { SignUp } from './presentation/views/sign-up/SignUp';
import { Dashboard } from './presentation/views/dashboard/dashboard';
import { UserProfile } from './presentation/views/profile/UserProfile';
import { TicketList } from './presentation/views/tickets/TicketList';
import { HelpCenter } from './presentation/views/help-center/HelpCenter';
import { TicketListWrapper } from './presentation/views/ticket-list-wrapper/TicketListWrapper';
import { TenantsView } from './presentation/views/tenants/Tenant';
import { ReportsView } from './presentation/views/reports/ReportsView';
import { TicketDetailWrapper } from './presentation/views/ticket-detail-wrapper/TicketDetailWrapper';
import { Loader } from './presentation/components/loader/loader-component';
import { Bounce, ToastContainer } from 'react-toastify';
import { UserView } from './presentation/views/users/User';
import { AuthProvider } from './presentation/context/AuthContext';
import { LoginRoute } from './presentation/layouts/LoginRoute';

export const App: React.FC = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Loader />
        <ToastContainer
          position="top-center"
          autoClose={8000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          theme='colored'
          transition={Bounce}
        />
        <Routes>
          <Route element={<AppLayout />}>
            <Route
              path="/help-center"
              element={
                <ProtectedRoute>
                  <HelpCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tickets"
              element={
                <ProtectedRoute>
                  <TicketList onSelectTicket={() => { }} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tickets/:id"
              element={
                <ProtectedRoute>
                  <TicketDetailWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <TicketListWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenants"
              element={
                <ProtectedRoute>
                  <TenantsView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UserView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsView />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/" element={
            <LoginRoute>
              <SignIn />
            </LoginRoute>

          } />
          <Route path="/sign-in" element={
            <LoginRoute>
              <SignIn />
            </LoginRoute>
          } />
          <Route path="/sign-up" element={<SignUp />} />
          {/* Catch-all para redireccionar rutas no encontradas */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;