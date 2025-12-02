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
      const response = await fetch(`${API_URL}/api/user/profile`, {
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
      // Step 1: Login to get token
      const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        const error = await loginResponse.json().catch(() => ({}));
        throw new Error(error.detail || 'Login failed');
      }

      const tokenData = await loginResponse.json();
      const accessToken = tokenData.access_token;

      // Step 2: Get user profile to check admin status
      const profileResponse = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to get user profile');
      }

      const profileData = await profileResponse.json();
      // Backend returns { success: true, data: {...} }
      const userData = profileData.data || profileData;
      
      // Check if user is admin (backend returns isAdmin in camelCase)
      if (!userData.isAdmin) {
        throw new Error('Admin privileges required');
      }

      // Normalize user data for frontend
      const normalizedUser = {
        id: userData.id,
        email: userData.email,
        full_name: userData.fullName || userData.full_name,
        is_admin: userData.isAdmin,
        avatar: userData.avatar,
        plan: userData.plan,
        credits: userData.credits,
      };

      setToken(accessToken);
      setUser(normalizedUser);
      localStorage.setItem('admin_token', accessToken);
      localStorage.setItem('admin_user', JSON.stringify(normalizedUser));
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
