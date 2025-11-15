import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * SearchBar
 * Centered pill search with CTA button and keyboard Enter support.
 */
export default function SearchBar({ initial = '' }) {
  /** Controlled local state, navigates to /search?q=... */
  const [q, setQ] = React.useState(initial || '');
  const navigate = useNavigate();

  function go() {
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div
      role="search"
      className="transition-all duration-300 ease-out"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#f3f4f6',
        border: '1px solid rgba(17,24,39,0.08)',
        borderRadius: 9999,
        padding: '10px 12px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        maxWidth: 640,
        width: '100%',
        margin: '0 auto',
      }}
    >
      <Search size={18} color="#64748b" aria-hidden />
      <input
        aria-label="Search recipes"
        placeholder="Search recipes..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="transition-all duration-300 ease-out"
        style={{
          appearance: 'none',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          width: '100%',
          fontSize: 14,
          color: '#111827',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') go();
        }}
      />
      <button
        onClick={go}
        className="transition-colors duration-300 ease-out focus-visible:outline-none"
        style={{
          border: '1px solid rgba(37,99,235,0.2)',
          background: 'linear-gradient(135deg, rgba(37,99,235,1), rgba(29,78,216,1))',
          color: '#fff',
          padding: '8px 14px',
          borderRadius: 9999,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.95')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        <Search size={16} />
        Search
      </button>
    </div>
  );
}
