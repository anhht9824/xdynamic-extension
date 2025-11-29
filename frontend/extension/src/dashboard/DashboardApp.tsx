import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import UserHub from "../settings/UserHub";
import { AdminLayout } from "../admin/layouts/AdminLayout";
import { AdminAuthGuard } from "../admin/guards/AdminAuthGuard";
import { DashboardPage } from "../admin/pages/DashboardPage";
import { ReportsPage } from "../admin/pages/ReportsPage";

const DashboardApp: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<UserHub />} />
        <Route path="/admin" element={<AdminAuthGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default DashboardApp;