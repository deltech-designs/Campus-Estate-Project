'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { IUser, UserRole } from '@ems/shared';
import { authService } from '@/services/auth.service';

interface AuthContextValue {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role?: UserRole,
    phone?: string,
  ) => Promise<void>;
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

  const login = async (email: string, password: string): Promise<void> => {
    const { user: loggedIn } = await authService.login({ email, password });
    setUser(loggedIn);
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role?: UserRole,
    phone?: string,
  ): Promise<void> => {
    const { user: registered } = await authService.register({
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
    });
    setUser(registered);
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
