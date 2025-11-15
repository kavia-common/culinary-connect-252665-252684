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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
      <Header />
      <main style={{ flex: '1 1 auto' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
