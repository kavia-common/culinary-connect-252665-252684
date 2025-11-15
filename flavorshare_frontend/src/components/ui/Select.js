import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Select
 */
export function Select({ label, id, children, ...props }) {
  /** Accessible select with label */
  return (
    <div>
      {label && <label htmlFor={id} style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{label}</label>}
      <select id={id} className="select" {...props}>{children}</select>
    </div>
  );
}
