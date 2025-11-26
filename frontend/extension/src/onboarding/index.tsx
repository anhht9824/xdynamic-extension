import React from "react";
import ReactDOM from "react-dom/client";
import OnboardingApp from "./OnboardingApp";
import { AuthProvider } from "../providers/AuthProvider";
import { I18nProvider } from "../providers/I18nProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import { ErrorBoundary } from "../components/common";
import "../styles/global.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <I18nProvider>
          <ThemeProvider>
            <OnboardingApp />
          </ThemeProvider>
        </I18nProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);