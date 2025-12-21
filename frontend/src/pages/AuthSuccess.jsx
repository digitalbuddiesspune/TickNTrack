import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const run = async () => {
      try {
        // Call api.me() with credentials to get user data from cookie
        const data = await api.me();
        const user = data?.user || null;
        
        // Set auth token marker for cookie-based auth
        try { 
          localStorage.setItem('auth_token', 'cookie'); 
          // Dispatch storage event to notify Navbar and other components
          window.dispatchEvent(new Event('storage'));
          // Also trigger a custom event for immediate update
          window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: true } }));
        } catch {}
        
        if (user?.isAdmin) {
          try { localStorage.setItem('auth_is_admin', 'true'); } catch {}
        } else {
          try { localStorage.removeItem('auth_is_admin'); } catch {}
        }
      } catch (err) {
        console.error('Auth success error:', err);
        // Even if api.me() fails, set the cookie marker since cookie is set by backend
        try { 
          localStorage.setItem('auth_token', 'cookie');
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: true } }));
        } catch {}
      }
      const redirectTo = '/';
      navigate(redirectTo, { replace: true, state: location.state });
    };
    run();
  }, [navigate, location.state]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600 mx-auto mb-4"></div>
        <div className="text-gray-700">Signing you in…</div>
      </div>
    </div>
  );
}
