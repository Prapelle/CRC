import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { loadData } from '../data/store';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('crc_auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('crc_auth_user');
      }
    }
  }, []);

  const login = (username: string, _password: string): boolean => {
    const data = loadData();
    const found = data.users.find(u => u.username === username);
    if (found) {
      setUser(found);
      localStorage.setItem('crc_auth_user', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crc_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function hasPermission(role: UserRole, module: string): boolean {
  const permissions: Record<UserRole, string[]> = {
    'Admin': ['all'],
    'Management': ['all'],
    'Marketing': ['executive', 'marketing', 'social', 'website', 'leads', 'data_quality', 'export'],
    'Sales': ['executive', 'leads', 'quotations', 'sales', 'data_quality', 'export'],
    'Data Analyst': ['executive', 'marketing', 'social', 'website', 'leads', 'quotations', 'sales', 'data_quality', 'export', 'settings'],
  };
  const userPerms = permissions[role] || [];
  return userPerms.includes('all') || userPerms.includes(module);
}
