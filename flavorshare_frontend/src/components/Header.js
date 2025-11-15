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
    <header className="header" role="banner">
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label="FlavorShare Home">
          <span className="brand-badge">🥘</span>
          <span className="brand-title">FlavorShare</span>
        </Link>
        <div className="searchbar" role="search">
          <span aria-hidden="true">🔎</span>
          <input
            aria-label="Search recipes"
            placeholder="Search recipes..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}>Search</button>
        </div>
        <nav className="nav" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/recipes/new">Create</NavLink>
          {user ? (
            <>
              <NavLink to={`/profile/${user.id}`}>Profile</NavLink>
              <NavLink to="/settings">Settings</NavLink>
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
