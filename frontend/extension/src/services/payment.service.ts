import { apiService } from './api.service';
import { API_ENDPOINTS } from '../core/config/api';

export interface TopupResponse {
  pay_url: string;
  request_id: string;
  qr_code_url?: string;
}

export interface PaymentResult {
  transactionId: string;
  status: "success" | "failed" | "pending";
  message?: string;
  timestamp: string;
  amount: number;
  failureReason?: "insufficient_balance" | "network_error" | "unknown";
  // Current plan at the time of payment (if known)
  currentPlan?: "free" | "plus" | "pro";
}

export class PaymentService {
  async createTopup(amount: number, returnUrl?: string): Promise<TopupResponse> {
    // Ensure amount is at least 10,000 VND as per backend requirement
    if (amount < 10000) {
      throw new Error("Số tiền nạp tối thiểu là 10.000đ");
    }

    const response = await apiService.post<TopupResponse>(API_ENDPOINTS.PAYMENT.TOPUP, {
      amount,
      return_url: returnUrl
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error?.message || 'Failed to create topup payment');
  }
}

export const paymentService = new PaymentService();
