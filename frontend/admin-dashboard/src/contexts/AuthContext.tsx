import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }, []);

  const refreshAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('admin_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      // Verify token by fetching user profile or admin stats
      const response = await fetch(`${API_URL}/admin/stats/overview`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Token is valid, try to get user info from stored data
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setToken(storedToken);
      } else if (response.status === 401 || response.status === 403) {
        // Token expired or not admin
        logout();
      }
    } catch (error) {
      console.error('Failed to refresh auth:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Check if user is admin
      if (!data.user?.is_admin) {
        throw new Error('Admin privileges required');
      }

      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    isAdmin: !!user?.is_admin,
    login,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
