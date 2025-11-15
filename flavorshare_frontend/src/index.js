import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './theme.css';
import RoutesApp from './RoutesApp';

// Diagnostic: mark client render path
// eslint-disable-next-line no-console
console.info('[FlavorShare] Bootstrapping React application...');

const rootEl = document.getElementById('root');
if (!rootEl) {
  // eslint-disable-next-line no-console
  console.error('[FlavorShare] Root element #root not found in DOM.');
} else {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <RoutesApp />
    </React.StrictMode>
  );
}
