import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Button
 * Accessible button with variants
 */
export function Button({ as: Comp = 'button', variant = 'primary', className = '', children, ...props }) {
  /** This is a public button component. */
  const cls = `btn btn-${variant} ${className}`.trim();
  return <Comp className={cls} {...props}>{children}</Comp>;
}
