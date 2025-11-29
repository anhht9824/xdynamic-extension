const API_URL = 'http://localhost:8000/admin'; // Adjust if needed

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  last_login: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface OverviewStats {
  total_users: number;
  active_today: number;
  content_blocked: number;
  pending_reports: number;
  total_revenue: number;
  blocked_images_count: number;
}

export interface SystemSettingItem {
    key: string;
    value: string;
    description: string;
}

export const adminService = {
  getOverviewStats: async (): Promise<OverviewStats> => {
    const response = await fetch(`${API_URL}/stats/overview`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  getUsers: async (page = 1, limit = 10, search = '', status = '', role = ''): Promise<UserListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      status,
      role,
    });
    const response = await fetch(`${API_URL}/users?${params}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  updateUserStatus: async (userId: number, isActive: boolean | null, isAdmin: boolean | null) => {
    const response = await fetch(`${API_URL}/users/${userId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ is_active: isActive, is_admin: isAdmin }),
    });
    if (!response.ok) throw new Error('Failed to update user status');
    return response.json();
  },

  getSystemSettings: async (): Promise<SystemSettingItem[]> => {
    const response = await fetch(`${API_URL}/settings`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  updateSystemSettings: async (settings: SystemSettingItem[]) => {
    const response = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ settings }),
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
  }
};
