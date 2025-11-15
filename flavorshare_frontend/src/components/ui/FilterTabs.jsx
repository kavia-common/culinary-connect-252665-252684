import React from 'react';

/**
 * PUBLIC_INTERFACE
 * FilterTabs
 * Simple filter tabs with gradient active style. Emits selected key.
 */
export default function FilterTabs({ value = 'popular', onChange }) {
  /** Tabs: Popular, Newest, Quick */
  const tabs = [
    { key: 'popular', label: 'Popular' },
    { key: 'newest', label: 'Newest' },
    { key: 'quick', label: 'Quick' },
  ];

  return (
    <div role="tablist" aria-label="Recipe filters" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(t.key)}
            className="transition-all duration-300 ease-out"
            style={{
              padding: '8px 12px',
              borderRadius: 9999,
              border: active ? '1px solid rgba(255,107,53,0.4)' : '1px solid rgba(17,24,39,0.08)',
              color: active ? '#fff' : '#111827',
              background: active
                ? 'linear-gradient(135deg, #FF6B35, #FF3D00)'
                : '#ffffff',
              boxShadow: active ? '0 4px 10px rgba(255,61,0,0.25)' : 'var(--shadow-sm)',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
