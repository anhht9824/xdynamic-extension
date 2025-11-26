import React from "react";
import ReactDOM from "react-dom/client";
import PlanApp from "./PlanApp";
import { AuthProvider, ThemeProvider, LanguageProvider } from "../providers";
import { ErrorBoundary } from "../components/common";
import "../styles/global.css";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <PlanApp />
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
