import React from 'react';
import Header from '../components/ui/Header.jsx';
import { Footer } from '../components/Footer';

/**
 * PUBLIC_INTERFACE
 * Layout
 * Provides a consistent app shell with sticky header and page container.
 */
export default function Layout({ children }) {
  /** Wraps pages with the global header and footer. */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAFA', overflowX: 'hidden' }}>
      <Header />
      <main className="block-full no-overflow-x" style={{ flex: '1 1 auto', overflowX: 'hidden' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
