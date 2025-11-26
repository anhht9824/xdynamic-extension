import { apiService } from './api.service';
import { API_ENDPOINTS } from '../core/config/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  plan: 'free' | 'premium' | 'enterprise';
}

export interface UserSettings {
  filters: {
    sensitive: boolean;
    violence: boolean;
    toxicity: boolean;
    vice: boolean;
  };
  contentTypes: {
    image: boolean;
    video: boolean;
  };
  notifications: boolean;
  autoBlock: boolean;
  language: string;
  theme: string;
}

export interface UserStatistics {
  totalBlocked: number;
  todayBlocked: number;
  weeklyBlocked: number;
  monthlyBlocked: number;
  byCategory: {
    sensitive: number;
    violence: number;
    toxicity: number;
    vice: number;
  };
}

export class UserService {
  async getProfile(): Promise<UserProfile> {
    // TODO: Implement actual API call
    const response = await apiService.get<UserProfile>(
      API_ENDPOINTS.USER.PROFILE
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get user profile');
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    // TODO: Implement actual API call
    const response = await apiService.put<UserProfile>(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to update profile');
  }

  async getSettings(): Promise<UserSettings> {
    // TODO: Implement actual API call
    const response = await apiService.get<UserSettings>(
      API_ENDPOINTS.USER.SETTINGS
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get settings');
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    // TODO: Implement actual API call
    const response = await apiService.put<UserSettings>(
      API_ENDPOINTS.USER.UPDATE_SETTINGS,
      settings
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to update settings');
  }

  async getStatistics(): Promise<UserStatistics> {
    // TODO: Implement actual API call
    const response = await apiService.get<UserStatistics>(
      API_ENDPOINTS.USER.STATISTICS
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get statistics');
  }
}

export const userService = new UserService();
