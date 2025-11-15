import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Footer
 */
export function Footer() {
  /** App footer */
  return (
    <footer className="footer" role="contentinfo">
      <div className="container no-overflow-x" style={{ display: 'flex', justifyContent: 'space-between', overflowX: 'hidden' }}>
        <div>© {new Date().getFullYear()} FlavorShare</div>
        <div style={{ color: 'var(--color-muted)' }}>Ocean Professional theme</div>
      </div>
    </footer>
  );
}
