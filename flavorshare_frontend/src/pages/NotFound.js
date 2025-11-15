import React from 'react';

/**
 * PUBLIC_INTERFACE
 * NotFound
 */
export default function NotFound() {
  /** 404 page */
  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <h1>Page not found</h1>
      <p>Sorry, we couldn't find what you're looking for.</p>
    </div>
  );
}
