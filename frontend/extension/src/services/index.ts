export { apiService, ApiService, ApiError } from './api.service';
export { authService, AuthService } from './auth.service';
export { detectionService, DetectionService } from './detection.service';
export { userService, UserService } from './user.service';
export { reportService, ReportService } from './report.service';

export type { LoginCredentials, RegisterData, AuthResponse } from './auth.service';
export type { DetectionRequest, DetectionResult, BatchDetectionRequest } from './detection.service';
export type { UserSettings } from './user.service';
export type { UserProfile, UserStatistics } from '../types/common';
export type { CreateReportData, Report } from './report.service';