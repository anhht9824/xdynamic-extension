import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { UserManagement } from './pages/UserManagement';
import { ContentAnalytics } from './pages/ContentAnalytics';
import { SystemSettings } from './pages/SystemSettings';
import { LoginPage } from './pages/LoginPage';
import './assets/index.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <AuthGuard>
                  <Navigate to="/users" replace />
                </AuthGuard>
              }
            />
            <Route
              path="/users"
              element={
                <AuthGuard>
                  <UserManagement />
                </AuthGuard>
              }
            />
            <Route
              path="/analytics"
              element={
                <AuthGuard>
                  <ContentAnalytics />
                </AuthGuard>
              }
            />
            <Route
              path="/settings"
              element={
                <AuthGuard>
                  <SystemSettings />
                </AuthGuard>
              }
            />
            
            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
