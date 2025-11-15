import React from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
// Requires: npm install lucide-react
import { Search, Plus, UserCircle2, LogOut, LogIn, UserPlus, Settings as SettingsIcon, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * PUBLIC_INTERFACE
 * Header (Redesigned)
 * A sticky, translucent gradient navbar with pill search and action buttons.
 */
export default function Header() {
  /** Header with responsive search and auth actions wired to existing navigation */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 animate-fadeIn"
      style={{
        background: 'linear-gradient(180deg, rgba(37,99,235,0.06), rgba(255,255,255,0.9))',
        backdropFilter: 'saturate(160%) blur(8px)',
        borderBottom: '1px solid rgba(17,24,39,0.06)',
      }}
    >
      <div className="container" style={{ padding: '12px 0' }}>
        <div
          className="transition-all duration-300 ease-out"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Link
            to="/"
            aria-label="FlavorShare Home"
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 12,
                background:
                  'linear-gradient(135deg, rgba(37,99,235,.14), rgba(249,250,251,1))',
                border: '1px solid rgba(37,99,235,0.25)',
                color: 'var(--color-primary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <HomeIcon size={20} />
            </span>
            <span
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
            className="group transition-all duration-300 ease-out"
            style={{
              flex: '1 1 480px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#f3f4f6',
              border: '1px solid rgba(17,24,39,0.08)',
              borderRadius: 9999,
              padding: '8px 12px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              marginLeft: 8,
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
                if (e.key === 'Enter') navigate(`/search?q=${encodeURIComponent(q)}`);
              }}
            />
            <button
              onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
              className="transition-colors duration-300 ease-out focus-visible:outline-none"
              style={{
                border: '1px solid rgba(37,99,235,0.2)',
                background:
                  'linear-gradient(135deg, rgba(37,99,235,1), rgba(29,78,216,1))',
                color: '#fff',
                padding: '8px 14px',
                borderRadius: 9999,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.95')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Search size={16} />
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
              className="transition-colors duration-200"
              style={({ isActive }) => ({
                padding: '8px 12px',
                borderRadius: 12,
                color: isActive ? '#2563EB' : '#475569',
                background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              })}
            >
              <HomeIcon size={16} />
              Home
            </NavLink>

            <NavLink
              to="/recipes/new"
              className="transition-colors duration-200"
              style={({ isActive }) => ({
                padding: '8px 12px',
                borderRadius: 12,
                color: isActive ? '#2563EB' : '#475569',
                background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              })}
            >
              <Plus size={16} />
              Create
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to={`/profile/${user.id}`}
                  className="transition-colors duration-200"
                  style={({ isActive }) => ({
                    padding: '8px 12px',
                    borderRadius: 12,
                    color: isActive ? '#2563EB' : '#475569',
                    background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  })}
                >
                  <UserCircle2 size={16} />
                  Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  className="transition-colors duration-200"
                  style={({ isActive }) => ({
                    padding: '8px 12px',
                    borderRadius: 12,
                    color: isActive ? '#2563EB' : '#475569',
                    background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  })}
                >
                  <SettingsIcon size={16} />
                  Settings
                </NavLink>
                <button
                  type="button"
                  onClick={logout}
                  className="transition-all duration-300 ease-out"
                  aria-label="Logout"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 12,
                    border: '1px solid rgba(17,24,39,0.08)',
                    background: 'transparent',
                    color: '#111827',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="transition-colors duration-200"
                  style={({ isActive }) => ({
                    padding: '8px 12px',
                    borderRadius: 12,
                    color: isActive ? '#2563EB' : '#475569',
                    background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  })}
                >
                  <LogIn size={16} />
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="transition-colors duration-200"
                  style={({ isActive }) => ({
                    padding: '8px 12px',
                    borderRadius: 12,
                    color: isActive ? '#2563EB' : '#475569',
                    background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  })}
                >
                  <UserPlus size={16} />
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
