import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute
 * Wraps children and redirects to /login if unauthenticated.
 */
export function ProtectedRoute({ children }) {
  /** Protects routes requiring authentication. */
  const { user, loading } = useAuth() || {};
  const location = useLocation();
  if (loading) return <div className="container" style={{ paddingTop: 24 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
