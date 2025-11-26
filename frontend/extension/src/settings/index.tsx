import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from '../components/common';
import Settings from './Settings';

const rootEl = document.getElementById('settings-root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <ErrorBoundary>
      <Settings />
    </ErrorBoundary>
  );
}
