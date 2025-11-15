#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Start script for CRA dev server that avoids shell-specific expansions.
 * - Sets BROWSER=none and HOST=0.0.0.0 for container previews.
 * - Sets PORT based on REACT_APP_PORT or defaults to 3000.
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
process.env.PORT = String(resolvePort());

/**
 * Start CRA dev server
 * We require react-scripts' start directly to avoid spawning child processes.
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
