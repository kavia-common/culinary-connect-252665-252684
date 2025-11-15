import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../lib/api';
import { getSupabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Provides auth state and actions to the component tree.
 */
export function AuthProvider({ children }) {
  /** Context provider to manage session state and provide login/register/logout methods. */
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await authApi.getSession();
        if (mounted) setSession(s);
        const supabase = getSupabase();
        supabase.auth.onAuthStateChange((_event, newSession) => {
          setSession(newSession);
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    loading,
    login: authApi.login,
    logout: authApi.logout,
    register: authApi.register
  }), [session, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * PUBLIC_INTERFACE
 * useAuth
 */
export function useAuth() {
  /** Hook to access authentication context. */
  return useContext(AuthContext);
}
