import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  registerStudent: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeIndianUser = (u: any): User => {
  if (!u) return u;
  let name = u.name;
  if (u.role === 'admin' && (!name || name === 'System Administrator' || name === 'admin')) {
    name = 'Dr. Ramesh Deshmukh';
  } else if (u.username === 'teacher1' || name === 'Prof. David Miller') {
    name = 'Prof. Rajesh Sharma';
  } else if (u.username === 'teacher2' || name === 'Dr. Sarah Connor') {
    name = 'Dr. Sunita Kulkarni';
  } else if (!name && u.role === 'student') {
    name = 'Aarav Sharma';
  }
  return { ...u, name };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only restore verified active session from storage
    const stored = localStorage.getItem('spa_current_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role) {
          const normalized = normalizeIndianUser(parsed);
          setUser(normalized);
          localStorage.setItem('spa_current_user', JSON.stringify(normalized));
        } else {
          localStorage.removeItem('spa_current_user');
        }
      } catch (e) {
        localStorage.removeItem('spa_current_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string, role?: UserRole) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        const normalized = normalizeIndianUser(data.user);
        setUser(normalized);
        localStorage.setItem('spa_current_user', JSON.stringify(normalized));
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error during login' };
    }
  };

  const registerStudent = async (studentData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('spa_current_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error during registration' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spa_current_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registerStudent,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
