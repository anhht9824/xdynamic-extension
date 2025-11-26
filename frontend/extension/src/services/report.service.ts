import { apiService } from './api.service';
import { API_ENDPOINTS } from '../core/config/api';

export interface CreateReportData {
  url: string;
  type: 'image' | 'video' | 'text' | 'other';
  category: 'sensitive' | 'violence' | 'toxicity' | 'vice' | 'other';
  description?: string;
  context?: {
    pageUrl: string;
    domain: string;
    timestamp: string;
  };
}

export interface Report {
  id: string;
  url: string;
  type: string;
  category: string;
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export class ReportService {
  async create(data: CreateReportData): Promise<Report> {
    // TODO: Implement actual API call
    const response = await apiService.post<Report>(
      API_ENDPOINTS.REPORT.CREATE,
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to create report');
  }

  async list(page = 1, pageSize = 10): Promise<Report[]> {
    // TODO: Implement actual API call
    const response = await apiService.get<Report[]>(
      `${API_ENDPOINTS.REPORT.LIST}?page=${page}&pageSize=${pageSize}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get reports');
  }

  async get(id: string): Promise<Report> {
    // TODO: Implement actual API call
    const endpoint = API_ENDPOINTS.REPORT.GET.replace(':id', id);
    const response = await apiService.get<Report>(endpoint);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get report');
  }
}

export const reportService = new ReportService();
