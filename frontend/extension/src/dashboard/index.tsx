import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "../providers/AuthProvider";
import { I18nProvider } from "../providers/I18nProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import { ErrorBoundary } from "../components/common";
import DashboardApp from "./DashboardApp";
import "../styles/global.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <I18nProvider>
          <ThemeProvider>
            <DashboardApp />
          </ThemeProvider>
        </I18nProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);