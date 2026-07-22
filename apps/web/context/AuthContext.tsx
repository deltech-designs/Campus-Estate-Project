'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { IUser, UserRole, IRegisterResponse } from '@ems/shared';
import { authService } from '@/services/auth.service';
import { API_URL } from '@/lib/config';

if (typeof window !== 'undefined' && !(window as unknown as Record<string, unknown>)['__fetchIntercepted']) {
  (window as unknown as Record<string, unknown>)['__fetchIntercepted'] = true;
  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    let url = '';
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof URL) {
      url = input.toString();
    } else if (input && 'url' in input) {
      url = (input as Request).url;
    }

    const apiUrl = API_URL;
    const isApiRequest = url.startsWith('/api') || (apiUrl && url.startsWith(`${apiUrl}/api`));

    const response = await originalFetch.call(this, input, init);

    if (isApiRequest && response.status === 401) {
      try {
        const clone = response.clone();
        const data = await clone.json() as { code?: string };
        if (data && (data.code === 'INVALID_TOKEN' || data.code === 'NO_TOKEN')) {
          const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
          const isPublicPage =
            pathname === '/' ||
            pathname.startsWith('/login') ||
            pathname.startsWith('/register') ||
            pathname.startsWith('/forgot-password') ||
            pathname.startsWith('/reset-password');

          const isMeEndpoint = url.includes('/api/auth/me');
          if (!isPublicPage && !(isMeEndpoint && data.code === 'NO_TOKEN')) {
            window.location.href = `/login?clear=true&from=${encodeURIComponent(pathname)}`;
          }
        }
      } catch {
        // Ignore json parse error
      }
    }

    return response;
  };
}


interface AuthContextValue {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<IUser>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role?: UserRole,
    phone?: string,
  ) => Promise<IRegisterResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const me = await authService.getMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string): Promise<IUser> => {
    const { user: loggedIn } = await authService.login({ email, password });
    setUser(loggedIn);
    return loggedIn;
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role?: UserRole,
    phone?: string,
  ): Promise<IRegisterResponse> => {
    const res = await authService.register({
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
    });
    if (!res.otpRequired && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
