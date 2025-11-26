import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserManagement } from './pages/UserManagement';
import { ContentAnalytics } from './pages/ContentAnalytics';
import { SystemSettings } from './pages/SystemSettings';
import './assets/index.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/analytics" element={<ContentAnalytics />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
