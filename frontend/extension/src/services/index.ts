export { apiService, ApiService, ApiError } from './api.service';
export { authService, AuthService } from './auth.service';
export { detectionService, DetectionService } from './detection.service';
export { userService, UserService } from './user.service';
export { reportService, ReportService } from './report.service';

export type { LoginCredentials, RegisterData, AuthResponse } from './auth.service';
export type { DetectionRequest, DetectionResult, BatchDetectionRequest } from './detection.service';
export type { UserProfile, UserSettings, UserStatistics } from './user.service';
export type { CreateReportData, Report } from './report.service';