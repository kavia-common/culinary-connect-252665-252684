import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Input
 */
export function Input({ label, id, hint, ...props }) {
  /** Accessible input with optional label and hint. */
  return (
    <div>
      {label && <label htmlFor={id} style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{label}</label>}
      <input id={id} className="input" {...props} />
      {hint && <div role="note" style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}
