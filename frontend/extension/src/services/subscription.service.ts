import { apiService } from './api.service';
import { API_ENDPOINTS } from '../core/config/api';
import { Subscription } from '../types/common';

export class SubscriptionService {
  async getCurrentSubscription(): Promise<Subscription> {
    const response = await apiService.get<Subscription>(API_ENDPOINTS.SUBSCRIPTION.CURRENT);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error?.message || 'Failed to fetch current subscription');
  }

  async purchasePlan(plan: "plus" | "pro"): Promise<Subscription> {
    const response = await apiService.post<Subscription>(API_ENDPOINTS.SUBSCRIPTION.PURCHASE, {
      plan
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error?.message || 'Failed to purchase plan');
  }

  async cancelSubscription(): Promise<Subscription> {
    const response = await apiService.post<Subscription>(API_ENDPOINTS.SUBSCRIPTION.CANCEL, {});
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error?.message || 'Failed to cancel subscription');
  }
}

export const subscriptionService = new SubscriptionService();
