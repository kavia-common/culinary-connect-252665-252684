import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Modal
 */
export function Modal({ open, title, onClose, children }) {
  /** Simple modal with backdrop and ESC handler */
  React.useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && onClose) onClose(); }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title || 'Dialog'}>
      <div className="modal">
        <div style={{ padding: 16, borderBottom: '1px solid rgba(17,24,39,0.06)' }}>
          <strong>{title}</strong>
        </div>
        <div style={{ padding: 16 }}>
          {children}
        </div>
        <div style={{ padding: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
