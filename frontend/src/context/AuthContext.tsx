import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

export interface ProjectHistoryItem {
  project_name: string;
  client?: string;
  role: string;
  technologies: string[];
  start_date?: string;
  end_date?: string;
  responsibilities: string[];
  achievements: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  username?: string;
  employee_id?: string;
  photo_url?: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  account_status: 'pending' | 'approved' | 'rejected';
  target_role?: string;
  experience_level?: string;
  skills?: string[];
  project_history?: ProjectHistoryItem[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  availability_status?: 'available' | 'partially_allocated' | 'allocated' | 'on_leave' | 'bench';
  has_resume?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    const response = await api.get('/api/auth/me');
    setUser(response.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser: setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
