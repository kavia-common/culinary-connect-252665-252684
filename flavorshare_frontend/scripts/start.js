#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Start script for CRA dev server that avoids shell-specific expansions.
 * - Sets BROWSER=none and HOST=0.0.0.0 for container previews.
 * - Sets PORT based on REACT_APP_PORT or defaults to 3000.
 * - Auto-accepts port changes when the target port is in use (non-interactive).
 * - Starts react-scripts in the same process.
 */

/** Resolve port similar to scripts/set-port.js but in-process */
function resolvePort() {
  const envPort = process.env.REACT_APP_PORT || process.env.PORT;
  const parsed = parseInt(envPort, 10);
  if (!isNaN(parsed) && parsed > 0) {
    return parsed;
  }
  return 3000;
}

// Ensure env is configured for container preview
process.env.BROWSER = process.env.BROWSER || 'none';
process.env.HOST = process.env.HOST || '0.0.0.0';

// Force CI mode to disable interactive prompts from CRA
// This makes CRA automatically choose the next available port.
process.env.CI = process.env.CI || 'true';

// Pre-set desired port
const desiredPort = resolvePort();
process.env.PORT = String(desiredPort);

// Provide explicit startup logs
// eslint-disable-next-line no-console
console.log(
  `[Startup] BROWSER=${process.env.BROWSER}, HOST=${process.env.HOST}, desired PORT=${desiredPort}, CI=${process.env.CI}`
);

/**
 * Start CRA dev server
 * We require react-scripts' start directly to avoid spawning child processes.
 * CRA will auto-select the next available port in CI mode if the desired port is occupied.
 */
try {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  require('react-scripts/scripts/start');
} catch (err) {
  // Provide a clearer error if react-scripts is missing
  // eslint-disable-next-line no-console
  console.error('[Startup Error] Failed to start react-scripts:', err && err.message ? err.message : err);
  process.exit(1);
}
