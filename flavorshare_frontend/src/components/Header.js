import React from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';

/**
 * PUBLIC_INTERFACE
 * Header
 * Top navigation with search.
 */
export function Header() {
  /** App header with search and auth actions. */
  const { user, logout } = useAuth() || {};
  const [params, setParams] = useSearchParams();
  const [q, setQ] = React.useState(params.get('q') || '');
  const debounced = useDebounce(q, 400);
  const navigate = useNavigate();

  React.useEffect(() => {
    const next = new URLSearchParams(params);
    if (debounced) next.set('q', debounced);
    else next.delete('q');
    setParams(next, { replace: true });
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <header
      role="banner"
      className="bg-gradient-to-b from-blue-50 to-white"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(17,24,39,0.06)',
        background: 'linear-gradient(180deg, rgba(29,78,216,0.18), rgba(255,255,255,1))'
      }}
    >
      <div
        className="container"
        style={{
          padding: '16px 0',
        }}
      >
        <div
          className="animate-fadeIn transition-all duration-400 ease-out"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'saturate(180%) blur(10px)',
            border: '1px solid rgba(17,24,39,0.06)',
            borderRadius: 20, // rounded-2xl+
            padding: 14,
            boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
          }}
        >
          <Link
            className="brand"
            to="/"
            aria-label="FlavorShare Home"
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span
              className="brand-badge"
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 12,
                background:
                  'linear-gradient(135deg, rgba(37,99,235,.12), rgba(249,250,251,1))',
                border: '1px solid rgba(37,99,235,0.25)',
                color: 'var(--color-primary)',
                fontSize: 20,
              }}
            >
              🥘
            </span>
            <span
              className="brand-title"
              style={{
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: 0.2,
                color: '#0f172a',
              }}
            >
              FlavorShare
            </span>
          </Link>

          {/* Search */}
          <div
            role="search"
            className="group transition-all duration-400 ease-out"
            style={{
              flex: '1 1 520px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#f3f4f6',
              border: '1px solid rgba(17,24,39,0.08)',
              borderRadius: 9999, // pill
              padding: '10px 14px',
              boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
            }}
            onFocus={(e) => { e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.12)'; }}
            onBlur={(e) => { e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.08)'; }}
          >
            <span aria-hidden="true" style={{ color: '#64748b' }}>
              🔎
            </span>
            <input
              aria-label="Search recipes"
              placeholder="Search recipes..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="transition-all duration-400 ease-out"
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
                if (e.key === 'Enter') navigate(`/search?q=${encodeURIComponent(q)}`);
              }}
            />
            <button
              onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
              className="transition-colors duration-400 ease-out focus-visible:outline-none"
              style={{
                border: '1px solid rgba(29,78,216,0.25)',
                background: '#1D4ED8',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: 9999,
                boxShadow: '0 10px 20px rgba(0,0,0,0.10)',
                transform: 'translateZ(0)',
                transition: 'background-color 400ms ease, box-shadow 400ms ease, transform 400ms ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#1E40AF'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.14)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#1D4ED8'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Search
            </button>
          </div>

          {/* Nav */}
          <nav
            aria-label="Main navigation"
            style={{
              marginLeft: 'auto',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <NavLink
              to="/"
              end
              className="transition-colors duration-400"
              style={({ isActive }) => ({
                padding: '10px 12px',
                borderRadius: 12,
                color: isActive ? '#1D4ED8' : '#475569',
                background: isActive ? 'rgba(29,78,216,0.10)' : 'transparent',
                transition: 'color .4s ease, background-color .4s ease',
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/recipes/new"
              className="transition-colors duration-400"
              style={({ isActive }) => ({
                padding: '10px 12px',
                borderRadius: 12,
                color: isActive ? '#1D4ED8' : '#475569',
                background: isActive ? 'rgba(29,78,216,0.10)' : 'transparent',
              })}
            >
              Create
            </NavLink>
            {user ? (
              <>
                <NavLink
                  to={`/profile/${user.id}`}
                  className="transition-colors duration-400"
                  style={({ isActive }) => ({
                    padding: '10px 12px',
                    borderRadius: 12,
                    color: isActive ? '#1D4ED8' : '#475569',
                    background: isActive ? 'rgba(29,78,216,0.10)' : 'transparent',
                  })}
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  className="transition-colors duration-400"
                  style={({ isActive }) => ({
                    padding: '10px 12px',
                    borderRadius: 12,
                    color: isActive ? '#1D4ED8' : '#475569',
                    background: isActive ? 'rgba(29,78,216,0.10)' : 'transparent',
                  })}
                >
                  Settings
                </NavLink>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="transition-all duration-300 ease-out"
                  aria-label="Logout"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="transition-colors duration-400"
                  style={({ isActive }) => ({
                    padding: '10px 12px',
                    borderRadius: 12,
                    color: isActive ? '#1D4ED8' : '#475569',
                    background: isActive ? 'rgba(29,78,216,0.10)' : 'transparent',
                  })}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="transition-colors duration-400"
                  style={({ isActive }) => ({
                    padding: '10px 12px',
                    borderRadius: 12,
                    color: isActive ? '#1D4ED8' : '#475569',
                    background: isActive ? 'rgba(29,78,216,0.10)' : 'transparent',
                  })}
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
