#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Ensures PORT is set for CRA dev server without relying on shell parameter expansion.
 * - If REACT_APP_PORT is set, use it.
 * - Else default to 3000.
 * - Does not prompt; is intended for CI/non-interactive environments.
 */
const DEFAULT_PORT = 3000;

// PUBLIC_INTERFACE
function derivePort() {
  const envPort = process.env.REACT_APP_PORT || process.env.PORT;
  const parsed = parseInt(envPort, 10);
  if (!isNaN(parsed) && parsed > 0) {
    return parsed;
  }
  return DEFAULT_PORT;
}

const port = derivePort();

// Output in a way cross-env can consume via inline assignment in npm scripts is not necessary;
// we will set process.env.PORT here when this script is required via node -r, but npm scripts
// call it first and set PORT for the same process is not possible. Instead, we print the value
// so the npm script can pick it up.
process.stdout.write(String(port));
