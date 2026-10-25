import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  authError: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  authError: '',
});

const ADMIN_EMAIL = 'jsuparkit@gmail.com';
const roles: UserRole[] = ['Admin', 'Marketing', 'Sales', 'Management', 'Data Analyst'];

function mapUser(authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }): User {
  const email = authUser.email ?? '';
  const metadataRole = authUser.user_metadata?.role;
  const role: UserRole = email.toLowerCase() === ADMIN_EMAIL
    ? 'Admin'
    : (roles.includes(metadataRole as UserRole) && metadataRole !== 'Admin' ? metadataRole as UserRole : 'Sales');
  return {
    user_id: authUser.id,
    username: email,
    full_name: String(authUser.user_metadata?.full_name ?? email.split('@')[0] ?? 'CRC User'),
    email,
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    localStorage.removeItem('crc_auth_user');
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setUser(data.session?.user ? mapUser(data.session.user) : null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ? mapUser(session.user) : null);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthError('');
    if (!isSupabaseConfigured || !supabase) {
      setAuthError('ระบบยังไม่ได้ตั้งค่า Supabase กรุณาติดต่อผู้ดูแลระบบ');
      return false;
    }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setAuthError('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน หรือรับคำเชิญจากผู้ดูแลระบบก่อน');
      return false;
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    if (supabase) void supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, authError }}>
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
